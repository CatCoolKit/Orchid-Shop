using BusinessObjects.Entities;
using Repositories.Interfaces;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IOrchidRepository _orchidRepository;
        private readonly IEmailService _emailService;
        private readonly IAccountRepository _accountRepository;

        public OrderService(IOrderRepository orderRepository, IOrchidRepository orchidRepository, IEmailService emailService, IAccountRepository accountRepository)
        {
            _orderRepository = orderRepository;
            _orchidRepository = orchidRepository;
            _emailService = emailService;
            _accountRepository = accountRepository;
        }

        public async Task<Order> CreateOrder(Order order)
        {
            if (order.OrderDetails == null || !order.OrderDetails.Any())
            {
                throw new ArgumentException("Order must contain at least one item.");
            }
            if (order.AccountId <= 0)
            {
                throw new ArgumentException("Invalid Account ID for the order.");
            }

            decimal calculatedTotalAmount = 0;

            foreach (var detail in order.OrderDetails)
            {
                var orchid = await _orchidRepository.GetOrchidById(detail.OrchidId);
                if (orchid == null)
                {
                    throw new KeyNotFoundException($"Orchid with ID {detail.OrchidId} not found. Cannot create order.");
                }
                if (detail.Quantity <= 0)
                {
                    throw new ArgumentException($"Quantity for Orchid '{orchid.OrchidName}' must be positive.");
                }

                detail.Price = orchid.Price;
                calculatedTotalAmount += detail.Price * detail.Quantity;

                //await _orchidRepository.UpdateOrchid(orchid);
            }

            order.OrderDate = DateTime.Now;
            order.OrderStatus = "Pending";
            order.TotalAmount = calculatedTotalAmount;

            await _orderRepository.AddOrder(order);

            try
            {
                var account = await _accountRepository.GetAccountById(order.AccountId);
                if (account != null)
                {
                    var subject = $"Xác nhận đơn hàng #{order.Id} từ Orchid Shop - Cảm ơn bạn đã mua sắm!";

                    var body = $@"
                    <div style=""font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);"">
                        <div style=""text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee;"">
                            <h1 style=""color: #0056b3; font-size: 28px; margin: 0; padding: 0;"">Orchid Shop</h1>
                            <p style=""color: #666; font-size: 14px;"">Vẻ đẹp từ thiên nhiên, gửi gắm yêu thương</p>
                        </div>
                        
                        <h2 style=""color: #004085; font-size: 22px; margin-bottom: 15px;"">Xác Nhận Đặt Hàng Thành Công!</h2>
                        <p>Kính gửi <strong style=""color: #0056b3;"">{account.AccountName}</strong>,</p>
                        <p>Cảm ơn bạn đã tin tưởng và đặt hàng tại Orchid Shop! Đơn hàng của bạn <strong style=""color: #28a745;"">#{order.Id}</strong> đã được đặt thành công và đang chờ xử lý.</p>
                        
                        <div style=""background-color: #f8f9fa; border-left: 5px solid #007bff; padding: 15px; margin: 20px 0; border-radius: 5px;"">
                            <p style=""margin: 5px 0;""><strong>Mã đơn hàng:</strong> <span style=""color: #007bff;"">#{order.Id}</span></p>
                            <p style=""margin: 5px 0;""><strong>Ngày đặt hàng:</strong> {order.OrderDate.ToString("dd/MM/yyyy HH:mm")}</p>
                            <p style=""margin: 5px 0;""><strong>Tổng cộng:</strong> <strong style=""color: #28a745; font-size: 18px;"">{order.TotalAmount.ToString("N0")} VNĐ</strong></p>
                            <p style=""margin: 5px 0;""><strong>Trạng thái:</strong> <span style=""color: #ffc107; font-weight: bold;"">{order.OrderStatus}</span></p>
                        </div>
                        
                        <h3 style=""color: #004085; font-size: 18px; margin-top: 25px; margin-bottom: 10px;"">Chi tiết sản phẩm:</h3>
                        <table border='0' style=""width:100%; border-collapse: collapse; margin-bottom: 20px;"">
                            <thead>
                                <tr style=""background-color: #e9ecef; color: #495057;"">
                                    <th style=""padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;"">Sản phẩm</th>
                                    <th style=""padding: 12px; text-align: center; border-bottom: 1px solid #dee2e6;"">Số lượng</th>
                                    <th style=""padding: 12px; text-align: right; border-bottom: 1px solid #dee2e6;"">Giá/sp</th>
                                    <th style=""padding: 12px; text-align: right; border-bottom: 1px solid #dee2e6;"">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>";
                    foreach (var detail in order.OrderDetails)
                    {
                        var orchidName = detail.Orchid?.OrchidName ?? "Không xác định";
                        body += $@"
                                <tr>
                                    <td style=""padding: 12px; text-align: left; border-bottom: 1px solid #f2f2f2;"">{orchidName}</td>
                                    <td style=""padding: 12px; text-align: center; border-bottom: 1px solid #f2f2f2;"">{detail.Quantity}</td>
                                    <td style=""padding: 12px; text-align: right; border-bottom: 1px solid #f2f2f2;"">{detail.Price.ToString("N0")} VNĐ</td>
                                    <td style=""padding: 12px; text-align: right; border-bottom: 1px solid #f2f2f2; font-weight: bold;"">{(detail.Quantity * detail.Price).ToString("N0")} VNĐ</td>
                                </tr>";
                    }
                    body += $@"
                            </tbody>
                        </table>
                        
                        <p style=""font-size: 15px;"">Chúng tôi sẽ sớm xử lý đơn hàng của bạn và thông báo khi có bất kỳ cập nhật nào về trạng thái đơn hàng.</p>
                        <p style=""font-size: 15px;"">Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi qua email hoặc số điện thoại hỗ trợ.</p>
                        
                        <div style=""text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee;"">
                            <p style=""color: #888; font-size: 13px; margin: 5px 0;"">Trân trọng,</p>
                            <p style=""color: #0056b3; font-size: 16px; font-weight: bold; margin: 0;"">Đội ngũ Orchid Shop</p>
                            <p style=""color: #888; font-size: 12px; margin: 5px 0;"">Email: support@orchidshop.com | Điện thoại: 0123 456 789</p>
                        </div>
                    </div>";

                    await _emailService.SendEmailAsync(account.Email, subject, body);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Không thể gửi email xác nhận đơn hàng {order.Id}: {ex.Message}");
            }

            return order;
        }

        public async Task<IEnumerable<Order>> GetOrders()
        {
            return await _orderRepository.GetOrders();
        }

        public async Task<Order> GetOrderById(int id)
        {
            var order = await _orderRepository.GetOrderById(id);
            if (order == null)
            {
                throw new KeyNotFoundException($"Order with ID {id} not found.");
            }
            return order;
        }

        public async Task UpdateOrder(Order order)
        {
            var existingOrder = await _orderRepository.GetOrderById(order.Id);
            if (existingOrder == null)
            {
                throw new KeyNotFoundException($"Order with ID {order.Id} not found for update.");
            }
            // Logic cập nhật phức tạp hơn cho TotalAmount hoặc OrderDetails sẽ cần được thêm ở đây
            // Ví dụ: nếu OrderDetails thay đổi, cần recalculate TotalAmount và cập nhật stock
            // Đối với mục đích của bài lab, chúng ta chỉ gọi repository update đơn giản
            await _orderRepository.UpdateOrder(order);
        }

        public async Task CancelOrder(int id)
        {
            var orderToCancel = await _orderRepository.GetOrderById(id);
            if (orderToCancel == null)
            {
                throw new KeyNotFoundException($"Order with ID {id} not found for cancellation.");
            }
            if (orderToCancel.OrderStatus == "Delivered" || orderToCancel.OrderStatus == "Cancelled")
            {
                throw new InvalidOperationException($"Order {id} cannot be cancelled as its status is '{orderToCancel.OrderStatus}'.");
            }

            orderToCancel.OrderStatus = "Cancelled";
            await _orderRepository.UpdateOrder(orderToCancel);
        }

        public async Task<IEnumerable<Order>> GetOrdersByAccountId(int accountId)
        {
            return await _orderRepository.FindOrdersByAccountId(accountId);
        }
    }
}
