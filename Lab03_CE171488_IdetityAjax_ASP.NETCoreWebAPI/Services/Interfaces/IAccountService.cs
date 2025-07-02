using BusinessObjects.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IAccountService
    {
        Task AddAccount(Account account); 
        Task<IEnumerable<Account>> GetAccounts(); 
        Task<Account> GetAccountById(int id);
        Task UpdateAccount(Account account); 
        Task DeleteAccount(int id); 
    }
}
