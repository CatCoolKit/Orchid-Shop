namespace Services.DTOs.Response
{
    public class AuthResponse
    {
        public int AccountId { get; set; }
        public string AccountName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Role { get; set; } = null!;
        public string Token { get; set; } = null!;
    }
}
