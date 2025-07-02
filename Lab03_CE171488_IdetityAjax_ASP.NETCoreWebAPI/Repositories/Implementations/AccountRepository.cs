using BusinessObjects.Entities;
using DataAccess;
using Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Implementations
{
    public class AccountRepository : IAccountRepository
    {
        private readonly AccountDAO _accountDAO;

        public AccountRepository(AccountDAO accountDAO)
        {
            _accountDAO = accountDAO;
        }

        public async Task AddAccount(Account account)
        {
            await Task.Run(() => _accountDAO.SaveAccount(account));
        }

        public async Task<IEnumerable<Account>> GetAccounts()
        {
            return await Task.FromResult(_accountDAO.GetAccounts());
        }

        public async Task<Account> GetAccountById(int id)
        {
            return await Task.FromResult(_accountDAO.FindAccountById(id)); 
        }

        public async Task UpdateAccount(Account account)
        {
            await Task.Run(() => _accountDAO.UpdateAccount(account)); 
        }

        public async Task DeleteAccount(int id)
        {
            var accountToDelete = await GetAccountById(id);
            if (accountToDelete == null)
            {
                throw new KeyNotFoundException($"Account with ID {id} not found in repository for deletion.");
            }
            await Task.Run(() => _accountDAO.DeleteAccount(accountToDelete));
        }

        public async Task<Account> FindAccountByEmail(string email)
        {
            return await Task.FromResult(_accountDAO.FindAccountByEmail(email)); 
        }
    }
}
