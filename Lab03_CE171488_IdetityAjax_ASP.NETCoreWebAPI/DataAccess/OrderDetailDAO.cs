using BusinessObjects.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess
{
    public class OrderDetailDAO
    {
        private readonly OrchidShopDbContext _context;

        public OrderDetailDAO(OrchidShopDbContext context)
        {
            _context = context; 
        }

        public void SaveOrderDetail(OrderDetail detail)
        {
            try
            {
                _context.OrderDetails.Add(detail);
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception("Error in SaveOrderDetail (DAO): " + e.Message);
            }
        }

        public List<OrderDetail> GetOrderDetails()
        {
            List<OrderDetail> listDetails = new List<OrderDetail>();
            try
            {
                listDetails = _context.OrderDetails
                                    .Include(od => od.Orchid)
                                    .ToList();
            }
            catch (Exception e)
            {
                throw new Exception("Error in GetOrderDetails (DAO): " + e.Message);
            }
            return listDetails;
        }

        public OrderDetail FindOrderDetailById(int detailId)
        {
            OrderDetail detail = null;
            try
            {
                detail = _context.OrderDetails
                                .Include(od => od.Orchid)
                                .SingleOrDefault(d => d.Id == detailId);
            }
            catch (Exception e)
            {
                throw new Exception("Error in FindOrderDetailById (DAO): " + e.Message);
            }
            return detail;
        }

        public void UpdateOrderDetail(OrderDetail detail)
        {
            try
            {
                _context.Entry<OrderDetail>(detail).State = EntityState.Modified;
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception("Error in UpdateOrderDetail (DAO): " + e.Message);
            }
        }

        public void DeleteOrderDetail(OrderDetail detail)
        {
            try
            {
                var detailToDelete = _context.OrderDetails.SingleOrDefault(d => d.Id == detail.Id);
                if (detailToDelete == null)
                {
                    throw new Exception("OrderDetail not found for deletion (DAO).");
                }
                _context.OrderDetails.Remove(detailToDelete);
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception("Error in DeleteOrderDetail (DAO): " + e.Message);
            }
        }

        public List<OrderDetail> GetOrderDetailsByOrderId(int orderId)
        {
            List<OrderDetail> listDetails = new List<OrderDetail>();
            try
            {
                listDetails = _context.OrderDetails
                                    .Where(od => od.OrderId == orderId)
                                    .Include(od => od.Orchid)
                                    .ToList();
            }
            catch (Exception e)
            {
                throw new Exception("Error in GetOrderDetailsByOrderId (DAO): " + e.Message);
            }
            return listDetails;
        }

        public List<OrderDetail> GetOrderDetailsByOrchidId(int orchidId)
        {
            List<OrderDetail> listDetails = new List<OrderDetail>();
            try
            {
                listDetails = _context.OrderDetails
                                    .Where(od => od.OrchidId == orchidId)
                                    .ToList();
            }
            catch (Exception e)
            {
                throw new Exception("Error in GetOrderDetailsByOrchidId (DAO): " + e.Message);
            }
            return listDetails;
        }
    }
}
