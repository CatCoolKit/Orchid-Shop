using BusinessObjects.Entities;
using Repositories.Interfaces;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Implementations
{
    public class AccountService : IAccountService
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IOrderRepository _orderRepository; 
        private readonly IRoleRepository _roleRepository; 

        public AccountService(IAccountRepository accountRepository, IOrderRepository orderRepository, IRoleRepository roleRepository) // Dependency Injection
        {
            _accountRepository = accountRepository;
            _orderRepository = orderRepository;
            _roleRepository = roleRepository;
        }

        public async Task AddAccount(Account account)
        {
            if (string.IsNullOrWhiteSpace(account.AccountName))
            {
                throw new ArgumentException("Account name cannot be empty.");
            }
            if (string.IsNullOrWhiteSpace(account.Email))
            {
                throw new ArgumentException("Email cannot be empty.");
            }
            if (string.IsNullOrWhiteSpace(account.Password))
            {
                throw new ArgumentException("Password cannot be empty.");
            }

            var role = await _roleRepository.GetRoleById(account.RoleId);
            if (role == null)
            {
                throw new KeyNotFoundException($"Role with ID {account.RoleId} not found for account creation.");
            }

            var existingAccounts = await _accountRepository.GetAccounts();
            if (existingAccounts.Any(a => a.Email.ToLower().Equals(account.Email.ToLower())))
            {
                throw new ArgumentException($"Email '{account.Email}' already exists.");
            }

            // Trong thực tế, bạn nên hash mật khẩu ở đây trước khi lưu
            // account.Password = HashPassword(account.Password);

            await _accountRepository.AddAccount(account);
        }

        public async Task<IEnumerable<Account>> GetAccounts()
        {
            return await _accountRepository.GetAccounts();
        }

        public async Task<Account> GetAccountById(int id)
        {
            var account = await _accountRepository.GetAccountById(id);
            if (account == null)
            {
                throw new KeyNotFoundException($"Account with ID {id} not found.");
            }
            return account;
        }

        public async Task UpdateAccount(Account account)
        {
            var existingAccount = await _accountRepository.GetAccountById(account.AccountId);
            if (existingAccount == null)
            {
                throw new KeyNotFoundException($"Account with ID {account.AccountId} not found for update.");
            }

            if (string.IsNullOrWhiteSpace(account.AccountName))
            {
                throw new ArgumentException("Account name cannot be empty.");
            }
            if (string.IsNullOrWhiteSpace(account.Email))
            {
                throw new ArgumentException("Email cannot be empty.");
            }
                
            if (!existingAccount.Email.ToLower().Equals(account.Email.ToLower()))
            {
                var accountsWithNewEmail = await _accountRepository.GetAccounts();
                if (accountsWithNewEmail.Any(a => a.Email.ToLower().Equals(account.Email.ToLower()) && a.AccountId != account.AccountId))
                {
                    throw new ArgumentException($"Email '{account.Email}' already exists for another account.");
                }
            }

            var role = await _roleRepository.GetRoleById(account.RoleId);
            if (role == null)
            {
                throw new KeyNotFoundException($"Role with ID {account.RoleId} not found for account update.");
            }

            await _accountRepository.UpdateAccount(account);
        }

        public async Task DeleteAccount(int id)
        {
            var accountToDelete = await _accountRepository.GetAccountById(id);
            if (accountToDelete == null)
            {
                throw new KeyNotFoundException($"Account with ID {id} not found for deletion.");
            }

            if (accountToDelete.Orders != null && accountToDelete.Orders.Any())
            {
                throw new InvalidOperationException($"Cannot delete account '{accountToDelete.AccountName}' because it has associated orders. Please delete or reassign orders first.");
            }

            await _accountRepository.DeleteAccount(id);
        }
    }
}
