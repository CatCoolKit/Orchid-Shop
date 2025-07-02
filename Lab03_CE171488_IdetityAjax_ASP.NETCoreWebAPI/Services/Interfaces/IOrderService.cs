using BusinessObjects.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IOrderService
    {
        Task<Order> CreateOrder(Order order); 
        Task<IEnumerable<Order>> GetOrders();
        Task<Order> GetOrderById(int id);
        Task UpdateOrder(Order order);
        Task CancelOrder(int id);
        Task<IEnumerable<Order>> GetOrdersByAccountId(int accountId);
    }
}
