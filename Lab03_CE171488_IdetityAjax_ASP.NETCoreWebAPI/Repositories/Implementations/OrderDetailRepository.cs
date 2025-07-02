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
    public class OrderDetailRepository : IOrderDetailRepository
    {
        private readonly OrderDetailDAO _orderDetailDAO; 

        public OrderDetailRepository(OrderDetailDAO orderDetailDAO) 
        {
            _orderDetailDAO = orderDetailDAO;
        }

        public async Task AddOrderDetail(OrderDetail detail)
        {
            await Task.Run(() => _orderDetailDAO.SaveOrderDetail(detail));
        }

        public async Task<IEnumerable<OrderDetail>> GetOrderDetails()
        {
            return await Task.FromResult(_orderDetailDAO.GetOrderDetails());
        }

        public async Task<OrderDetail> GetOrderDetailById(int id)
        {
            return await Task.FromResult(_orderDetailDAO.FindOrderDetailById(id));
        }

        public async Task UpdateOrderDetail(OrderDetail detail)
        {
            await Task.Run(() => _orderDetailDAO.UpdateOrderDetail(detail));
        }

        public async Task DeleteOrderDetail(int id)
        {
            var detailToDelete = await GetOrderDetailById(id);
            if (detailToDelete == null)
            {
                throw new KeyNotFoundException($"OrderDetail with ID {id} not found in repository for deletion.");
            }
            await Task.Run(() => _orderDetailDAO.DeleteOrderDetail(detailToDelete));
        }

        public async Task<IEnumerable<OrderDetail>> GetOrderDetailsByOrderId(int orderId)
        {
            return await Task.FromResult(_orderDetailDAO.GetOrderDetailsByOrderId(orderId));
        }

        public async Task<IEnumerable<OrderDetail>> GetOrderDetailsByOrchidId(int orchidId)
        {
            return await Task.FromResult(_orderDetailDAO.GetOrderDetailsByOrchidId(orchidId));
        }
    }
}
