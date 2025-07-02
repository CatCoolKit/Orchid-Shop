using Azure.Core;
using BusinessObjects.Entities;
using Repositories.Interfaces;
using Services.DTOs.Request;
using Services.DTOs.Response;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Implementations
{
    public class OrchidService : IOrchidService
    {
        private readonly IOrchidRepository _orchidRepository;
        private readonly IOrderDetailRepository _orderDetailRepository; 

        public OrchidService(IOrchidRepository orchidRepository, IOrderDetailRepository orderDetailRepository) 
        {
            _orchidRepository = orchidRepository;
            _orderDetailRepository = orderDetailRepository;
        }

        public async Task<IEnumerable<OrchidResponse>> GetOrchids()
        {
            var orchids = await _orchidRepository.GetOrchids();
            return orchids.Select(o => new OrchidResponse
            {
                OrchidId = o.OrchidId,
                IsNatural = o.IsNatural,
                OrchidDescription = o.OrchidDescription,
                OrchidName = o.OrchidName,
                OrchidUrl = o.OrchidUrl,
                Price = o.Price,
                CategoryId = o.CategoryId,
                CategoryName = o.Category?.CategoryName ?? "Không xác định"
            }).ToList();
        }

        public async Task<OrchidResponse> GetOrchidById(int id)
        {
            var orchid = await _orchidRepository.GetOrchidById(id); 
            if (orchid == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy hoa lan với ID {id}.");
            }
            return new OrchidResponse
            {
                OrchidId = orchid.OrchidId,
                IsNatural = orchid.IsNatural,
                OrchidDescription = orchid.OrchidDescription,
                OrchidName = orchid.OrchidName,
                OrchidUrl = orchid.OrchidUrl,
                Price = orchid.Price,
                CategoryId = orchid.CategoryId,
                CategoryName = orchid.Category?.CategoryName ?? "Không xác định"
            };
        }

        public async Task AddOrchid(Orchid orchid)
        {
            if (string.IsNullOrWhiteSpace(orchid.OrchidName))
            {
                throw new ArgumentException("Orchid name cannot be empty.");
            }
            if (orchid.Price <= 0)
            {
                throw new ArgumentException("Unit price must be positive.");
            }
            await _orchidRepository.SaveOrchid(orchid);
        }

        public async Task UpdateOrchid(int id, Orchid request)
        {
            var existingOrchid = await _orchidRepository.GetOrchidById(id);
            if (existingOrchid == null)
            {
                throw new KeyNotFoundException($"Orchid with ID {id} not found for update.");
            }
            if (string.IsNullOrWhiteSpace(request.OrchidName))
            {
                throw new ArgumentException("Orchid name cannot be empty.");
            }
            if (request.Price <= 0)
            {
                throw new ArgumentException("Unit price must be positive.");
            }

            existingOrchid.IsNatural = request.IsNatural;
            existingOrchid.OrchidDescription = request.OrchidDescription;
            existingOrchid.OrchidName = request.OrchidName;
            existingOrchid.OrchidUrl = request.OrchidUrl;
            existingOrchid.Price = request.Price;
            existingOrchid.CategoryId = request.CategoryId;

            await _orchidRepository.UpdateOrchid(existingOrchid);
        }

        public async Task DeleteOrchid(int id)
        {
            var orchidToDelete = await _orchidRepository.GetOrchidById(id);
            if (orchidToDelete == null)
            {
                throw new KeyNotFoundException($"Orchid with ID {id} not found for deletion.");
            }

            var relatedOrderDetails = await _orderDetailRepository.GetOrderDetailsByOrchidId(id);

            if (relatedOrderDetails != null && relatedOrderDetails.Any())
            {
                throw new InvalidOperationException($"Cannot delete orchid '{orchidToDelete.OrchidName}' because it has existing order details. Please remove associated order details first.");
            }

            await _orchidRepository.DeleteOrchid(id);
        }
    }
}
