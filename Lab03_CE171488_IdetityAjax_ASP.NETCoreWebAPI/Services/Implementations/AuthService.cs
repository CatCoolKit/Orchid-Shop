using Azure.Core;
using BusinessObjects.Entities;
using Repositories.Interfaces;
using Services.DTOs.Request;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly IEmailService _emailService;

        public AuthService(IAccountRepository accountRepository, IRoleRepository roleRepository, IEmailService emailService)
        {
            _accountRepository = accountRepository;
            _roleRepository = roleRepository;
            _emailService = emailService;
        }

        public async Task<Account> Login(string email, string password)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            {
                throw new ArgumentException("Email and password cannot be empty.");
            }

            var account = await _accountRepository.FindAccountByEmail(email);

            if (account == null)
            {
                return null; 
            }

            if (!BCrypt.Net.BCrypt.Verify(password, account.Password)) 
            {
                return null; 
            }

            return account; 
        }

        public async Task<Account> Register(RegisterRequest request)
        {
            var newAccount = new Account
            {
                AccountName = request.AccountName,
                Email = request.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12), 
                RoleId = 2
            };

            if (string.IsNullOrWhiteSpace(newAccount.AccountName) ||
                string.IsNullOrWhiteSpace(newAccount.Email) ||
                string.IsNullOrWhiteSpace(newAccount.Password))
            {
                throw new ArgumentException("Account name, email, and password cannot be empty.");
            }

            var existingAccounts = await _accountRepository.GetAccounts();
            if (existingAccounts.Any(a => a.Email.ToLower().Equals(newAccount.Email.ToLower())))
            {
                throw new ArgumentException($"Email '{newAccount.Email}' is already registered.");
            }

            var role = await _roleRepository.GetRoleById(newAccount.RoleId);
            if (role == null)
            {
                throw new KeyNotFoundException($"Role with ID {newAccount.RoleId} not found for registration.");
            }

            await _accountRepository.AddAccount(newAccount); 

            try
            {
                var subject = "Chào mừng bạn đến với Orchid Shop!";
                var body = $@"
                    <div style=""font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);"">
                        <div style=""text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee;"">
                            <h1 style=""color: #0056b3; font-size: 28px; margin: 0; padding: 0;"">Chào mừng đến với Orchid Shop!</h1>
                            <p style=""color: #666; font-size: 14px;"">Khám phá vẻ đẹp tinh tế của thế giới hoa lan</p>
                        </div>
                        
                        <p>Kính gửi <strong style=""color: #0056b3;"">{newAccount.AccountName}</strong>,</p>
                        <p>Chúng tôi rất vui mừng chào đón bạn đến với cộng đồng những người yêu hoa lan của Orchid Shop!</p>
                        <p>Tài khoản của bạn đã được đăng ký thành công với thông tin sau:</p>
                        <ul style=""list-style-type: none; padding: 0; margin: 15px 0; background-color: #f8f9fa; border-left: 5px solid #28a745; padding: 10px 20px; border-radius: 5px;"">
                            <li style=""margin-bottom: 5px;""><strong>Email đăng nhập:</strong> <span style=""color: #007bff;"">{newAccount.Email}</span></li>
                            <li style=""margin-bottom: 5px;""><strong>Tên tài khoản:</strong> {newAccount.AccountName}</li>
                            <li><strong>Vai trò:</strong> {role.RoleName}</li>
                        </ul>
                        <p>Bạn có thể bắt đầu khám phá bộ sưu tập hoa lan độc đáo của chúng tôi và đặt hàng ngay bây giờ!</p>
                        <p style=""text-align: center; margin-top: 25px;"">
                            <a href=""#"" style=""display: inline-block; padding: 12px 25px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;"">Khám phá ngay</a>
                        </p>
                        
                        <p style=""font-size: 14px; margin-top: 25px;"">Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.</p>
                        
                        <div style=""text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee;"">
                            <p style=""color: #888; font-size: 13px; margin: 5px 0;"">Trân trọng,</p>
                            <p style=""color: #0056b3; font-size: 16px; font-weight: bold; margin: 0;"">Đội ngũ Orchid Shop</p>
                            <p style=""color: #888; font-size: 12px; margin: 5px 0;"">Email: support@orchidshop.com | Điện thoại: 0123 456 789</p>
                        </div>
                    </div>";

                await _emailService.SendEmailAsync(newAccount.Email, subject, body);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Không thể gửi email chào mừng đến {newAccount.Email}: {ex.Message}");
            }

            return newAccount;
        }

        public async Task ChangePassword(int accountId, string oldPassword, string newPassword)
        {
            if (string.IsNullOrWhiteSpace(oldPassword) || string.IsNullOrWhiteSpace(newPassword))
            {
                throw new ArgumentException("Mật khẩu cũ và mật khẩu mới không được để trống.");
            }
            if (oldPassword == newPassword)
            {
                throw new ArgumentException("Mật khẩu mới không được trùng với mật khẩu cũ.");
            }

            var account = await _accountRepository.GetAccountById(accountId);
            if (account == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy tài khoản với ID {accountId}.");
            }

            if (!BCrypt.Net.BCrypt.Verify(oldPassword, account.Password))
            {
                throw new UnauthorizedAccessException("Mật khẩu cũ không chính xác.");
            }

            account.Password = BCrypt.Net.BCrypt.HashPassword(newPassword, workFactor: 12);

            await _accountRepository.UpdateAccount(account);
        }
    }
}
