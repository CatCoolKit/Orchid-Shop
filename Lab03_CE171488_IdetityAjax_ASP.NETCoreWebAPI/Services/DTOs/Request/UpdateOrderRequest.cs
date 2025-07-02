using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.Request
{
    public class UpdateOrderRequest
    {
        [Required(ErrorMessage = "Order Status is required.")]
        [StringLength(50, ErrorMessage = "Order Status cannot exceed 50 characters.")]
        public string OrderStatus { get; set; } = null!;
    }
}
