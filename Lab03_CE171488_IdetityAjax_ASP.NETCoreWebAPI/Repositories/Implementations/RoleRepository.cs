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
    public class RoleRepository : IRoleRepository
    {
        private readonly RoleDAO _roleDAO;

        public RoleRepository(RoleDAO roleDAO)
        {
            _roleDAO = roleDAO; 
        }

        public async Task AddRole(Role role)
        {
            await Task.Run(() => _roleDAO.SaveRole(role)); 
        }

        public async Task<IEnumerable<Role>> GetRoles()
        {
            return await Task.FromResult(_roleDAO.GetRoles());
        }

        public async Task<Role> GetRoleById(int id)
        {
            return await Task.FromResult(_roleDAO.FindRoleById(id));
        }

        public async Task UpdateRole(Role role)
        {
            await Task.Run(() => _roleDAO.UpdateRole(role)); 
        }

        public async Task DeleteRole(int id)
        {
            var roleToDelete = await GetRoleById(id);
            if (roleToDelete == null)
            {
                throw new KeyNotFoundException($"Role with ID {id} not found in repository for deletion.");
            }
            await Task.Run(() => _roleDAO.DeleteRole(roleToDelete)); 
        }
    }
}
