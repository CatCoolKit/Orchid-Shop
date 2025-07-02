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
    public class RoleService : IRoleService
    {
        private readonly IRoleRepository _roleRepository;
        private readonly IAccountRepository _accountRepository; 

        public RoleService(IRoleRepository roleRepository, IAccountRepository accountRepository)
        {
            _roleRepository = roleRepository;
            _accountRepository = accountRepository;
        }

        public async Task AddRole(Role role)
        {
            if (string.IsNullOrWhiteSpace(role.RoleName))
            {
                throw new ArgumentException("Role name cannot be empty.");
            }
            // Optional: Check for duplicate role names if required
            var existingRoles = await _roleRepository.GetRoles();
            if (existingRoles.Any(r => r.RoleName.ToLower().Equals(role.RoleName.ToLower())))
            {
                throw new ArgumentException($"Role name '{role.RoleName}' already exists.");
            }

            await _roleRepository.AddRole(role);
        }

        public async Task<IEnumerable<Role>> GetRoles()
        {
            return await _roleRepository.GetRoles();
        }

        public async Task<Role> GetRoleById(int id)
        {
            var role = await _roleRepository.GetRoleById(id);
            if (role == null)
            {
                throw new KeyNotFoundException($"Role with ID {id} not found.");
            }
            return role;
        }

        public async Task UpdateRole(Role role)
        {
            var existingRole = await _roleRepository.GetRoleById(role.RoleId);
            if (existingRole == null)
            {
                throw new KeyNotFoundException($"Role with ID {role.RoleId} not found for update.");
            }
            if (string.IsNullOrWhiteSpace(role.RoleName))
            {
                throw new ArgumentException("Role name cannot be empty.");
            }
            // Optional: Check for duplicate role names during update, excluding itself
            var allRoles = await _roleRepository.GetRoles();
            if (allRoles.Any(r => r.RoleName.ToLower().Equals(role.RoleName.ToLower()) && r.RoleId != role.RoleId))
            {
                throw new ArgumentException($"Role name '{role.RoleName}' already exists for another role.");
            }

            await _roleRepository.UpdateRole(role);
        }

        public async Task DeleteRole(int id)
        {
            var roleToDelete = await _roleRepository.GetRoleById(id);
            if (roleToDelete == null)
            {
                throw new KeyNotFoundException($"Role with ID {id} not found for deletion.");
            }

            var accountsWithRole = await _accountRepository.GetAccounts();
            if (accountsWithRole.Any(a => a.RoleId == id))
            {
                throw new InvalidOperationException($"Cannot delete role '{roleToDelete.RoleName}' because it has associated accounts. Please reassign or delete accounts first.");
            }

            await _roleRepository.DeleteRole(id);
        }
    }
}
