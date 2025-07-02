namespace Services.DTOs.Request
{
    public class CreateOrchidRequest
    {
        public bool IsNatural { get; set; }
        public string? OrchidDescription { get; set; }
        public string OrchidName { get; set; } = null!;
        public string? OrchidUrl { get; set; }
        public decimal Price { get; set; }
        public int CategoryId { get; set; }
    }
}
