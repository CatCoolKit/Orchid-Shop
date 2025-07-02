using System.ComponentModel.DataAnnotations;

namespace Services.DTOs.Request
{
    public class RegisterRequest
    {
        [Required(ErrorMessage = "Account name is required.")]
        public string AccountName { get; set; } = null!;
        [Required(ErrorMessage = "Email is required.")]
        public string Email { get; set; } = null!;
        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; } = null!;
    }
}
