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
    [Authorize(Roles = "Admin")]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        // GET: api/Role
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ResponseObject))]
        public async Task<IActionResult> GetRoles()
        {
            try
            {
                var roles = await _roleService.GetRoles();
                return Ok(new ResponseObject
                {
                    Status = HttpStatusCode.OK,
                    Message = "Roles retrieved successfully.",
                    Data = roles
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ResponseObject
                {
                    Status = HttpStatusCode.InternalServerError,
                    Message = "An error occurred while retrieving roles.",
                    Data = null
                });
            }
        }

        // GET: api/Role/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ResponseObject))]
        public async Task<IActionResult> GetRoleById(int id)
        {
            try
            {
                var role = await _roleService.GetRoleById(id);
                return Ok(new ResponseObject
                {
                    Status = HttpStatusCode.OK,
                    Message = "Role retrieved successfully.",
                    Data = role
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
                return StatusCode(StatusCodes.Status500InternalServerError, new ResponseObject
                {
                    Status = HttpStatusCode.InternalServerError,
                    Message = "An error occurred while retrieving the role.",
                    Data = null
                });
            }
        }

        // POST: api/Role
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ResponseObject))]
        public async Task<IActionResult> AddRole([FromBody] CreateRoleRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ResponseObject
                {
                    Status = HttpStatusCode.BadRequest,
                    Message = "Invalid role data.",
                    Data = ModelState
                });
            }

            var role = new Role
            {
                RoleName = request.RoleName
            };

            try
            {
                await _roleService.AddRole(role);
                return CreatedAtAction(nameof(GetRoleById), new { id = role.RoleId }, new ResponseObject
                {
                    Status = HttpStatusCode.Created,
                    Message = "Role added successfully.",
                    Data = role
                });
            }
            catch (ArgumentException ex) 
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
                return StatusCode(StatusCodes.Status500InternalServerError, new ResponseObject
                {
                    Status = HttpStatusCode.InternalServerError,
                    Message = "An error occurred while adding the role.",
                    Data = null
                });
            }
        }

        // PUT: api/Role/5
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ResponseObject))]
        public async Task<IActionResult> UpdateRole(int id, [FromBody] UpdateRoleRequest request)
        {
            var existingRole = await _roleService.GetRoleById(id);
            if (existingRole == null)
            {
                return NotFound(new ResponseObject
                {
                    Status = HttpStatusCode.NotFound,
                    Message = $"Role with ID {id} not found for update.",
                    Data = null
                });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new ResponseObject
                {
                    Status = HttpStatusCode.BadRequest,
                    Message = "Invalid role data.",
                    Data = ModelState
                });
            }

            existingRole.RoleName = request.RoleName;

            try
            {
                await _roleService.UpdateRole(existingRole);
                return Ok(new ResponseObject
                {
                    Status = HttpStatusCode.OK,
                    Message = "Role updated successfully.",
                    Data = existingRole
                });
            }
            catch (ArgumentException ex) 
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
                return StatusCode(StatusCodes.Status500InternalServerError, new ResponseObject
                {
                    Status = HttpStatusCode.InternalServerError,
                    Message = "An error occurred while updating the role.",
                    Data = null
                });
            }
        }

        // DELETE: api/Role/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status409Conflict, Type = typeof(ResponseObject))] 
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ResponseObject))]
        public async Task<IActionResult> DeleteRole(int id)
        {
            try
            {
                await _roleService.DeleteRole(id);
                return Ok(new ResponseObject
                {
                    Status = HttpStatusCode.OK,
                    Message = $"Role with ID {id} deleted successfully.",
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
                return StatusCode(StatusCodes.Status500InternalServerError, new ResponseObject
                {
                    Status = HttpStatusCode.InternalServerError,
                    Message = "An error occurred while deleting the role.",
                    Data = null
                });
            }
        }
    }
}
