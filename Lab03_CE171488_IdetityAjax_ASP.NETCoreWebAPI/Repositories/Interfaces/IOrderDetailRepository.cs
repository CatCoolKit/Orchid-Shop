using BusinessObjects.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interfaces
{
    public interface IOrderDetailRepository
    {
        Task AddOrderDetail(OrderDetail detail); 
        Task<IEnumerable<OrderDetail>> GetOrderDetails(); 
        Task<OrderDetail> GetOrderDetailById(int id); 
        Task UpdateOrderDetail(OrderDetail detail);
        Task DeleteOrderDetail(int id); 
        Task<IEnumerable<OrderDetail>> GetOrderDetailsByOrderId(int orderId);
        Task<IEnumerable<OrderDetail>> GetOrderDetailsByOrchidId(int orchidId);
    }
}
