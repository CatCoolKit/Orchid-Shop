using BusinessObjects.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess
{
    public class OrderDAO
    {
        private readonly OrchidShopDbContext _context; 

        public OrderDAO(OrchidShopDbContext context)
        {
            _context = context;
        }

        public void SaveOrder(Order order)
        {
            try
            {
                _context.Orders.Add(order);
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception("Error in SaveOrder (DAO): " + e.Message);
            }
        }

        public List<Order> GetOrders()
        {
            List<Order> listOrders = new List<Order>();
            try
            {
                listOrders = _context.Orders
                                    .Include(o => o.OrderDetails)
                                    .ThenInclude(od => od.Orchid)
                                    .ToList();
            }
            catch (Exception e)
            {
                throw new Exception("Error in GetOrders (DAO): " + e.Message);
            }
            return listOrders;
        }

        public Order FindOrderById(int orderId)
        {
            Order order = null;
            try
            {
                order = _context.Orders
                                .Include(o => o.OrderDetails)
                                .ThenInclude(od => od.Orchid)
                                .SingleOrDefault(o => o.Id == orderId);
            }
            catch (Exception e)
            {
                throw new Exception("Error in FindOrderById (DAO): " + e.Message);
            }
            return order;
        }

        public void UpdateOrder(Order order)
        {
            try
            {
                _context.Orders.Update(order);
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception("Error in UpdateOrder (DAO): " + e.Message);
            }
        }

        public void DeleteOrder(Order order)
        {
            try
            {
                var orderToDelete = _context.Orders.SingleOrDefault(o => o.Id == order.Id);
                if (orderToDelete == null)
                {
                    throw new Exception("Order not found for deletion (DAO).");
                }
                _context.Orders.Remove(orderToDelete);
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception("Error in DeleteOrder (DAO): " + e.Message);
            }
        }

        public List<Order> GetOrdersByAccountId(int accountId)
        {
            List<Order> listOrders = new List<Order>();
            try
            {
                listOrders = _context.Orders
                                    .Where(o => o.AccountId == accountId)
                                    .Include(o => o.OrderDetails) 
                                    .ThenInclude(od => od.Orchid)
                                    .ToList();
            }
            catch (Exception e)
            {
                throw new Exception("Lỗi khi lấy đơn hàng theo Account ID (DAO): " + e.Message);
            }
            return listOrders;
        }
    }
}
