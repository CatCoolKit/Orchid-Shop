using BusinessObjects.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interfaces
{
    public interface IOrchidRepository 
    {
        Task SaveOrchid(Orchid o); 
        Task<Orchid> GetOrchidById(int id); 
        Task DeleteOrchid(int id); 
        Task UpdateOrchid(Orchid o); 
        Task<IEnumerable<Orchid>> GetOrchids();
    }
}
