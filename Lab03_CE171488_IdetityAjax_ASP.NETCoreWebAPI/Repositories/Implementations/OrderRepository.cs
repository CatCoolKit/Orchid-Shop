using BusinessObjects.Entities;
using DataAccess;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Implementations
{
    public class OrderRepository : IOrderRepository
    {
        private readonly OrderDAO _orderDAO;

        public OrderRepository(OrderDAO orderDAO) 
        {
            _orderDAO = orderDAO; 
        }

        public async Task AddOrder(Order order)
        {
            await Task.Run(() => _orderDAO.SaveOrder(order)); 
        }

        public async Task<IEnumerable<Order>> GetOrders()
        {
            return await Task.FromResult(_orderDAO.GetOrders()); 
        }

        public async Task<Order> GetOrderById(int id)
        {
            return await Task.FromResult(_orderDAO.FindOrderById(id)); 
        }

        public async Task UpdateOrder(Order order)
        {
            await Task.Run(() => _orderDAO.UpdateOrder(order)); 
        }

        public async Task DeleteOrder(int id)
        {
            var orderToDelete = await GetOrderById(id);
            if (orderToDelete == null)
            {
                throw new KeyNotFoundException($"Order with ID {id} not found in repository for deletion.");
            }
            await Task.Run(() => _orderDAO.DeleteOrder(orderToDelete)); 
        }

        public async Task<IEnumerable<Order>> FindOrdersByAccountId(int accountId)
        {
            return await Task.FromResult(_orderDAO.GetOrdersByAccountId(accountId));
        }
    }
}
