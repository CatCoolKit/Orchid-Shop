using BusinessObjects.Entities;
using Services.DTOs.Request;
using Services.DTOs.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IOrchidService
    {
        Task<IEnumerable<OrchidResponse>> GetOrchids();
        Task<OrchidResponse> GetOrchidById(int id);
        Task AddOrchid(Orchid orchid);
        Task UpdateOrchid(int id, Orchid orchid);
        Task DeleteOrchid(int id);
    }
}
