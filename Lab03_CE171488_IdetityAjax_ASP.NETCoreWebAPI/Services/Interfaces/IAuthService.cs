using BusinessObjects.Entities;
using Services.DTOs.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IAuthService
    {
        Task<Account> Login(string email, string password);
        Task<Account> Register(RegisterRequest newAccount); 
        Task ChangePassword(int accountId, string oldPassword, string newPassword);
    }
}
