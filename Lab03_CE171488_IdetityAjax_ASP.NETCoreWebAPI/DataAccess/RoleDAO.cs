using BusinessObjects.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess
{
    public class RoleDAO
    {
        private readonly OrchidShopDbContext _context; 

        public RoleDAO(OrchidShopDbContext context)
        {
            _context = context;
        }

        public List<Role> GetRoles()
        {
            List<Role> listRoles = new List<Role>();
            try
            {
                listRoles = _context.Roles
                                    .ToList();
            }
            catch (Exception e)
            {
                throw new Exception("Error in GetRoles (DAO): " + e.Message);
            }
            return listRoles;
        }

        public Role FindRoleById(int roleId)
        {
            Role role = null;
            try
            {
                role = _context.Roles
                                .SingleOrDefault(r => r.RoleId == roleId);
            }
            catch (Exception e)
            {
                throw new Exception("Error in FindRoleById (DAO): " + e.Message);
            }
            return role;
        }

        public void SaveRole(Role role)
        {
            try
            {
                _context.Roles.Add(role);
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception("Error in SaveRole (DAO): " + e.Message);
            }
        }

        public void UpdateRole(Role role)
        {
            try
            {
                _context.Entry<Role>(role).State = EntityState.Modified;
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception("Error in UpdateRole (DAO): " + e.Message);
            }
        }

        public void DeleteRole(Role role)
        {
            try
            {
                var roleToDelete = _context.Roles.SingleOrDefault(r => r.RoleId == role.RoleId);
                if (roleToDelete == null)
                {
                    throw new Exception("Role not found for deletion (DAO).");
                }
                _context.Roles.Remove(roleToDelete);
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception("Error in DeleteRole (DAO): " + e.Message);
            }
        }
    }
}
