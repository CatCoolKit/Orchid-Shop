namespace Services.DTOs.Request
{
    public class UpdateAccountRequest
    {
        public string AccountName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public int RoleId { get; set; }
    }
}
