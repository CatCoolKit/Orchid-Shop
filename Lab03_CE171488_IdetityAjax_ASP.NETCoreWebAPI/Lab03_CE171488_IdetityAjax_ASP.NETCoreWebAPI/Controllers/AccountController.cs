using Azure.Core;
using BusinessObjects.Entities;
using Services.DTOs.Request;
using Services.DTOs.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using System.Net;

namespace Lab03_CE171488_IdetityAjax_ASP.NETCoreWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        // GET: api/Account
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ResponseObject))]
        public async Task<IActionResult> GetAccounts()
        {
            try
            {
                var accounts = await _accountService.GetAccounts();
                return Ok(new ResponseObject
                {
                    Status = HttpStatusCode.OK,
                    Message = "Accounts retrieved successfully.",
                    Data = accounts
                });
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error in GetAccounts: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, new ResponseObject
                {
                    Status = HttpStatusCode.InternalServerError,
                    Message = "An error occurred while retrieving accounts.",
                    Data = null
                });
            }
        }

        // GET: api/Account/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ResponseObject))]
        public async Task<IActionResult> GetAccountById(int id)
        {
            try
            {
                var account = await _accountService.GetAccountById(id);
                return Ok(new ResponseObject
                {
                    Status = HttpStatusCode.OK,
                    Message = "Account retrieved successfully.",
                    Data = account
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
                Console.WriteLine($"Error in GetAccountById: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, new ResponseObject
                {
                    Status = HttpStatusCode.InternalServerError,
                    Message = "An error occurred while retrieving the account.",
                    Data = null
                });
            }
        }

        // POST: api/Account
        [HttpPost]
        [Authorize(Roles = "Admin")] 
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status409Conflict, Type = typeof(ResponseObject))] 
        [ProducesResponseType(StatusCodes.Status401Unauthorized)] 
        [ProducesResponseType(StatusCodes.Status403Forbidden)] 
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ResponseObject))]
        public async Task<IActionResult> AddAccount([FromBody] CreateAccountRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ResponseObject
                {
                    Status = HttpStatusCode.BadRequest,
                    Message = "Invalid account data.",
                    Data = ModelState 
                });
            }

            // Map DTO to Entity
            var account = new Account
            {
                AccountName = request.AccountName,
                Email = request.Email,
                Password = request.Password,
                RoleId = request.RoleId
            };

            try
            {
                await _accountService.AddAccount(account);
                return CreatedAtAction(nameof(GetAccountById), new { id = account.AccountId }, new ResponseObject
                {
                    Status = HttpStatusCode.Created,
                    Message = "Account added successfully.",
                    Data = account
                });
            }
            catch (ArgumentException ex)
            {
                return Conflict(new ResponseObject
                {
                    Status = HttpStatusCode.Conflict,
                    Message = ex.Message,
                    Data = null
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
            catch (Exception ex)
            {
                Console.WriteLine($"Error in AddAccount: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, new ResponseObject
                {
                    Status = HttpStatusCode.InternalServerError,
                    Message = "An error occurred while adding the account.",
                    Data = null
                });
            }
        }

        // PUT: api/Account/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")] 
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status409Conflict, Type = typeof(ResponseObject))] 
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ResponseObject))]
        public async Task<IActionResult> UpdateAccount(int id, [FromBody] UpdateAccountRequest request)
        {
            var existingAccount = await _accountService.GetAccountById(id);
            if (existingAccount == null)
            {
                return NotFound(new ResponseObject
                {
                    Status = HttpStatusCode.NotFound,
                    Message = $"Account with ID {id} not found for update.",
                    Data = null
                });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new ResponseObject
                {
                    Status = HttpStatusCode.BadRequest,
                    Message = "Invalid account data.",
                    Data = ModelState
                });
            }

            existingAccount.AccountName = request.AccountName;
            existingAccount.Email = request.Email;
            existingAccount.RoleId = request.RoleId;

            try
            {
                await _accountService.UpdateAccount(existingAccount);
                return Ok(new ResponseObject
                {
                    Status = HttpStatusCode.OK,
                    Message = "Account updated successfully.",
                    Data = existingAccount 
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
            catch (ArgumentException ex) 
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
                Console.WriteLine($"Error in UpdateAccount: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, new ResponseObject
                {
                    Status = HttpStatusCode.InternalServerError,
                    Message = "An error occurred while updating the account.",
                    Data = null
                });
            }
        }

        // DELETE: api/Account/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] 
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status409Conflict, Type = typeof(ResponseObject))] 
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ResponseObject))]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            try
            {
                await _accountService.DeleteAccount(id);
                return Ok(new ResponseObject
                {
                    Status = HttpStatusCode.OK,
                    Message = $"Account with ID {id} deleted successfully.",
                    Data = null
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
                Console.WriteLine($"Error in DeleteAccount: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, new ResponseObject
                {
                    Status = HttpStatusCode.InternalServerError,
                    Message = "An error occurred while deleting the account.",
                    Data = null
                });
            }
        }
    }
}
