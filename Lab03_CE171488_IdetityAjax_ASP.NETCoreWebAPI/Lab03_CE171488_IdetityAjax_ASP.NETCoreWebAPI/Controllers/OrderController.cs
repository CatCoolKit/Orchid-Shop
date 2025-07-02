using BusinessObjects.Entities;
using Services.DTOs.Request;
using Services.DTOs.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using System.Net;
using System.Security.Claims;

namespace Lab03_CE171488_IdetityAjax_ASP.NETCoreWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IAccountService _accountService;

        public OrderController(IOrderService orderService, IAccountService accountService)
        {
            _orderService = orderService;
            _accountService = accountService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ResponseObject))]
        public async Task<IActionResult> GetOrders()
        {
            try
            {
                var orders = await _orderService.GetOrders();
                return Ok(new ResponseObject
                {
                    Status = HttpStatusCode.OK,
                    Message = "Orders retrieved successfully.",
                    Data = orders
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ResponseObject
                {
                    Status = HttpStatusCode.InternalServerError,
                    Message = "An error occurred while retrieving orders.",
                    Data = null
                });
            }
        }

        // GET: api/Order/5 - Get a specific order by ID (Admin or owner of the order)
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ResponseObject))]
        public async Task<IActionResult> GetOrderById(int id)
        {
            try
            {
                var order = await _orderService.GetOrderById(id);

                var accountIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (accountIdClaim == null || !int.TryParse(accountIdClaim.Value, out int currentAccountId))
                {
                    return Unauthorized(new ResponseObject { Status = HttpStatusCode.Unauthorized, Message = "User ID not found in token.", Data = null });
                }

                if (!User.IsInRole("Admin") && order.AccountId != currentAccountId)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new ResponseObject { Status = HttpStatusCode.Forbidden, Message = "You do not have permission to access this order.", Data = null }); // FIXED
                }

                return Ok(new ResponseObject
                {
                    Status = HttpStatusCode.OK,
                    Message = "Order retrieved successfully.",
                    Data = order
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ResponseObject
                {
                    Status = HttpStatusCode.NotFound,
                    Message = ex.Message,
                    Data = null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ResponseObject
                {
                    Status = HttpStatusCode.InternalServerError,
                    Message = "An error occurred while retrieving the order.",
                    Data = null
                });
            }
        }

        [HttpGet("my-details")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ResponseObject))]
        public async Task<IActionResult> GetMyOrderDetails()
        {
            var accountIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (accountIdClaim == null || !int.TryParse(accountIdClaim.Value, out int currentAccountId))
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new ResponseObject { Status = HttpStatusCode.Unauthorized, Message = "Không tìm thấy ID người dùng trong token.", Data = null });
            }

            try
            {
                var orderDetails = await _orderService.GetOrdersByAccountId(currentAccountId);
                if (orderDetails == null || !orderDetails.Any())
                {
                    return Ok(new ResponseObject
                    {
                        Status = HttpStatusCode.OK,
                        Message = "Bạn chưa có chi tiết đơn hàng nào.",
                        Data = new List<OrderDetail>()
                    });
                }
                return Ok(new ResponseObject
                {
                    Status = HttpStatusCode.OK,
                    Message = "Tất cả chi tiết đơn hàng của bạn đã được lấy thành công.",
                    Data = orderDetails
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ResponseObject
                {
                    Status = HttpStatusCode.InternalServerError,
                    Message = "Đã xảy ra lỗi khi lấy chi tiết đơn hàng của bạn.",
                    Data = null
                });
            }
        }

        // POST: api/Order - Create a new order (User or Admin)
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ResponseObject))]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ResponseObject
                {
                    Status = HttpStatusCode.BadRequest,
                    Message = "Invalid order data.",
                    Data = ModelState
                });
            }

            var accountIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (accountIdClaim == null || !int.TryParse(accountIdClaim.Value, out int currentAccountId))
            {
                return Unauthorized(new ResponseObject { Status = HttpStatusCode.Unauthorized, Message = "User ID not found in token.", Data = null });
            }
            if (request.AccountId != currentAccountId && !User.IsInRole("Admin"))
            {
                return StatusCode(StatusCodes.Status403Forbidden, new ResponseObject { Status = HttpStatusCode.Forbidden, Message = "You do not have permission to access this order.", Data = null }); // FIXED
            }

            try
            {
                var account = await _accountService.GetAccountById(request.AccountId);
                if (account == null)
                {
                    return BadRequest(new ResponseObject
                    {
                        Status = HttpStatusCode.BadRequest,
                        Message = $"Account with ID {request.AccountId} not found.",
                        Data = null
                    });
                }

                var newOrder = new Order
                {
                    AccountId = request.AccountId,
                    OrderDetails = request.OrderDetails.Select(od => new OrderDetail
                    {
                        OrchidId = od.OrchidId,
                        Quantity = od.Quantity
                    }).ToList()
                };

                var createdOrder = await _orderService.CreateOrder(newOrder);

                return CreatedAtAction(nameof(GetOrderById), new { id = createdOrder.Id }, new ResponseObject
                {
                    Status = HttpStatusCode.Created,
                    Message = "Order created successfully.",
                    Data = createdOrder
                });
            }
            catch (KeyNotFoundException ex)
            {
                return BadRequest(new ResponseObject
                {
                    Status = HttpStatusCode.BadRequest,
                    Message = ex.Message,
                    Data = null
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ResponseObject
                {
                    Status = HttpStatusCode.BadRequest,
                    Message = ex.Message,
                    Data = null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ResponseObject
                {
                    Status = HttpStatusCode.InternalServerError,
                    Message = "An error occurred while creating the order.",
                    Data = null
                });
            }
        }

        // PUT: api/Order/5 - Update an existing order (Admin or owner of the order for status changes)
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ResponseObject))]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] UpdateOrderRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ResponseObject
                {
                    Status = HttpStatusCode.BadRequest,
                    Message = "Invalid order update data.",
                    Data = ModelState
                });
            }

            var existingOrder = await _orderService.GetOrderById(id);
            if (existingOrder == null)
            {
                return NotFound(new ResponseObject
                {
                    Status = HttpStatusCode.NotFound,
                    Message = $"Order with ID {id} not found for update.",
                    Data = null
                });
            }

            var accountIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (accountIdClaim == null || !int.TryParse(accountIdClaim.Value, out int currentAccountId))
            {
                return Unauthorized(new ResponseObject { Status = HttpStatusCode.Unauthorized, Message = "User ID not found in token.", Data = null });
            }

            if (!User.IsInRole("Admin") && existingOrder.AccountId != currentAccountId)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new ResponseObject { Status = HttpStatusCode.Forbidden, Message = "You do not have permission to update this order.", Data = null }); // FIXED
            }

            existingOrder.OrderStatus = request.OrderStatus;

            try
            {
                await _orderService.UpdateOrder(existingOrder);
                return Ok(new ResponseObject
                {
                    Status = HttpStatusCode.OK,
                    Message = "Order updated successfully.",
                    Data = existingOrder
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ResponseObject
                {
                    Status = HttpStatusCode.BadRequest,
                    Message = ex.Message,
                    Data = null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ResponseObject
                {
                    Status = HttpStatusCode.InternalServerError,
                    Message = "An error occurred while updating the order.",
                    Data = null
                });
            }
        }

        // PUT: api/Order/cancel/5 - Cancel an order (Admin or owner of the order)
        [HttpPut("cancel/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status409Conflict, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ResponseObject))]
        public async Task<IActionResult> CancelOrder(int id)
        {
            var existingOrder = await _orderService.GetOrderById(id);
            if (existingOrder == null)
            {
                return NotFound(new ResponseObject
                {
                    Status = HttpStatusCode.NotFound,
                    Message = $"Order with ID {id} not found for cancellation.",
                    Data = null
                });
            }

            var accountIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (accountIdClaim == null || !int.TryParse(accountIdClaim.Value, out int currentAccountId))
            {
                return Unauthorized(new ResponseObject { Status = HttpStatusCode.Unauthorized, Message = "User ID not found in token.", Data = null });
            }

            if (!User.IsInRole("Admin") && existingOrder.AccountId != currentAccountId)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new ResponseObject { Status = HttpStatusCode.Forbidden, Message = "You do not have permission to cancel this order.", Data = null }); // FIXED
            }

            try
            {
                await _orderService.CancelOrder(id);
                return Ok(new ResponseObject
                {
                    Status = HttpStatusCode.OK,
                    Message = $"Order {id} cancelled successfully.",
                    Data = null
                });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new ResponseObject
                {
                    Status = HttpStatusCode.Conflict,
                    Message = ex.Message,
                    Data = null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ResponseObject
                {
                    Status = HttpStatusCode.InternalServerError,
                    Message = "An error occurred while cancelling the order.",
                    Data = null
                });
            }
        }
    }
}
