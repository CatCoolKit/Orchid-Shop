namespace Services.DTOs.Request
{
    public class CreateAccountRequest
    {
        public string AccountName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public int RoleId { get; set; }
    }
}
