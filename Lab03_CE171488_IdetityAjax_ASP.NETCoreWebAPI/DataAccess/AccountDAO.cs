using BusinessObjects.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess
{
    public class AccountDAO
    {
        private readonly OrchidShopDbContext _context; 

        public AccountDAO()
        {
            _context = new OrchidShopDbContext(); 
        }

        public Account FindAccountByEmail(string email)
        {
            Account account = null;
            try
            {
                account = _context.Accounts
                                 .Include(a => a.Role)
                                 .SingleOrDefault(a => a.Email.ToLower().Equals(email.ToLower()));
            }
            catch (Exception e)
            {
                throw new Exception("Error in FindAccountByEmail (DAO): " + e.Message);
            }
            return account;
        }

        public List<Account> GetAccounts()
        {
            List<Account> listAccounts = new List<Account>();
            try
            {
                listAccounts = _context.Accounts
                                     .Include(a => a.Role)
                                     .ToList();
            }
            catch (Exception e)
            {
                throw new Exception("Error in GetAccounts (DAO): " + e.Message);
            }
            return listAccounts;
        }

        public Account FindAccountById(int accountId)
        {
            Account account = null;
            try
            {
                 account = _context.Accounts
                                 .Include(a => a.Role)
                                 .SingleOrDefault(a => a.AccountId == accountId);
            }
            catch (Exception e)
            {
                throw new Exception("Error in FindAccountById (DAO): " + e.Message);
            }
            return account;
        }

        public void SaveAccount(Account account)
        {
            try
            {
                _context.Accounts.Add(account);
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception("Error in SaveAccount (DAO): " + e.Message);
            }
        }

        public void UpdateAccount(Account account)
        {
            try
            {
                _context.Entry<Account>(account).State = EntityState.Modified;
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception("Error in UpdateAccount (DAO): " + e.Message);
            }
        }

        public void DeleteAccount(Account account)
        {
            try
            {
                var accountToDelete = _context.Accounts.SingleOrDefault(a => a.AccountId == account.AccountId);
                if (accountToDelete == null)
                {
                    throw new Exception("Account not found for deletion (DAO).");
                }
                _context.Accounts.Remove(accountToDelete);
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception("Error in DeleteAccount (DAO): " + e.Message);
            }
        }
    }
}
