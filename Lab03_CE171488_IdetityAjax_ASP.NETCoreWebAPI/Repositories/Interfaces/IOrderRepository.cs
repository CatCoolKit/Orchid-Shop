using BusinessObjects.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interfaces
{
    public interface IOrderRepository
    {
        Task AddOrder(Order order); 
        Task<IEnumerable<Order>> GetOrders(); 
        Task<Order> GetOrderById(int id); 
        Task UpdateOrder(Order order); 
        Task DeleteOrder(int id);
        Task<IEnumerable<Order>> FindOrdersByAccountId(int accountId);
    }
}
