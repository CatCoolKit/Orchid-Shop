using BusinessObjects.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interfaces
{
    public interface IRoleRepository
    {
        Task AddRole(Role role); 
        Task<IEnumerable<Role>> GetRoles(); 
        Task<Role> GetRoleById(int id); 
        Task UpdateRole(Role role); 
        Task DeleteRole(int id); 
    }
}
