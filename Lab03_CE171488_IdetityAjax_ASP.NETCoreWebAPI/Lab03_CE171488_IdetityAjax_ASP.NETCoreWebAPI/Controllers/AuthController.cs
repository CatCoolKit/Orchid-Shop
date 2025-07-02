using BusinessObjects.Entities;
using Services.DTOs.Request;
using Services.DTOs.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using System.Security.Claims;

namespace Lab03_CE171488_IdetityAjax_ASP.NETCoreWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IManageJwt _manageJwt;
        private readonly IAccountService _accountService;

        public AuthController(IAuthService authService, IManageJwt manageJwt, IAccountService accountService)
        {
            _authService = authService;
            _manageJwt = manageJwt;
            _accountService = accountService;
        }

        [HttpPost("login")]
        [AllowAnonymous] 
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(AuthResponse))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var account = await _authService.Login(request.Email, request.Password);

                if (account == null)
                {
                    return Unauthorized(new { Message = "Invalid email or password." });
                }

                var token = _manageJwt.GenerateToken(account);

                var response = new AuthResponse
                {
                    AccountId = account.AccountId,
                    AccountName = account.AccountName,
                    Email = account.Email,
                    Role = account.Role.RoleName, 
                    Token = token
                };

                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during login: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "An error occurred during login." });
            }
        }

        [HttpPost("register")]
        [AllowAnonymous] 
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(AuthResponse))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)] 
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var registeredAccount = await _authService.Register(request);

                var accountWithRole = await _accountService.GetAccountById(registeredAccount.AccountId);
                if (accountWithRole == null || accountWithRole.Role == null)
                {
                    throw new Exception("Registered account or its role could not be retrieved.");
                }

                var token = _manageJwt.GenerateToken(accountWithRole);

                var response = new AuthResponse
                {
                    AccountId = registeredAccount.AccountId,
                    AccountName = registeredAccount.AccountName,
                    Email = registeredAccount.Email,
                    Role = accountWithRole.Role.RoleName,
                    Token = token
                };

                return CreatedAtAction(nameof(Login), response);
            }
            catch (ArgumentException ex) 
            {
                return Conflict(new { Message = ex.Message }); 
            }
            catch (KeyNotFoundException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during registration: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "An error occurred during registration." });
            }
        }

        [HttpPut("change-password")]
        [Authorize] 
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)] 
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var accountIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (accountIdClaim == null || !int.TryParse(accountIdClaim.Value, out int accountId))
            {
                return Unauthorized(new { Message = "User ID not found in token." });
            }

            try
            {
                await _authService.ChangePassword(accountId, request.OldPassword, request.NewPassword);
                return Ok(new { Message = "Password changed successfully." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { Message = ex.Message });
            }
            catch (ArgumentException ex) 
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during password change: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "An error occurred during password change." });
            }
        }
    }
}
