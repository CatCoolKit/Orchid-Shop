using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.Request
{
    public class CreateOrderRequest
    {
        [Required(ErrorMessage = "Account ID is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Account ID must be a positive integer.")]
        public int AccountId { get; set; }

        [Required(ErrorMessage = "Order must contain at least one item.")]
        [MinLength(1, ErrorMessage = "Order must contain at least one item.")]
        public List<CreateOrderDetailRequest> OrderDetails { get; set; } = new List<CreateOrderDetailRequest>();
    }

    public class CreateOrderDetailRequest
    {
        [Required(ErrorMessage = "Orchid ID is required for order detail.")]
        [Range(1, int.MaxValue, ErrorMessage = "Orchid ID must be a positive integer.")]
        public int OrchidId { get; set; }

        [Required(ErrorMessage = "Quantity is required for order detail.")]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be a positive integer.")]
        public int Quantity { get; set; }
    }
}
