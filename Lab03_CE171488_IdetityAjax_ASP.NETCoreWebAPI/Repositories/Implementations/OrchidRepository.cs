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
    public class OrchidRepository : IOrchidRepository
    {
        private readonly OrchidDAO _orchidDAO; 

        public OrchidRepository(OrchidDAO orchidDAO)
        {
            _orchidDAO = orchidDAO;
        }

        public async Task DeleteOrchid(int id)
        {
            var orchidToDelete = await GetOrchidById(id);
            if (orchidToDelete == null)
            {
                throw new KeyNotFoundException($"Orchid with ID {id} not found in repository for deletion.");
            }
            await Task.Run(() => _orchidDAO.DeleteOrchid(orchidToDelete)); 
        }

        public async Task<Orchid> GetOrchidById(int id)
        {
            return await Task.FromResult(_orchidDAO.FindOrchidById(id));
        }

        public async Task<IEnumerable<Orchid>> GetOrchids()
        {
            return await Task.FromResult(_orchidDAO.GetOrchids());
        }

        public async Task SaveOrchid(Orchid o)
        {
            await Task.Run(() => _orchidDAO.SaveOrchid(o)); 
        }

        public async Task UpdateOrchid(Orchid o)
        {
            await Task.Run(() => _orchidDAO.UpdateOrchid(o)); 
        }
    }
}
