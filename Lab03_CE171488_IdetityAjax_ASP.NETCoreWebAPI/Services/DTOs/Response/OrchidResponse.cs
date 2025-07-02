namespace Services.DTOs.Response
{
    public class OrchidResponse
    {
        public int OrchidId { get; set; }
        public bool IsNatural { get; set; }
        public string? OrchidDescription { get; set; }
        public string OrchidName { get; set; } = null!;
        public string? OrchidUrl { get; set; }
        public decimal Price { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = null!; 
    }
}
