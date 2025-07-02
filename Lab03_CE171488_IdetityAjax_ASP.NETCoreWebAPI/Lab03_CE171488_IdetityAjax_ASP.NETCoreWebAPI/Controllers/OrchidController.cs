using BusinessObjects.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.Request;
using Services.DTOs.Response;
using Services.Interfaces;
using System.Net;

namespace Lab03_CE171488_IdetityAjax_ASP.NETCoreWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrchidController : ControllerBase
    {
        private readonly IOrchidService _orchidService;
        private readonly ICategoryService _categoryService; 

        public OrchidController(IOrchidService orchidService, ICategoryService categoryService)
        {
            _orchidService = orchidService;
            _categoryService = categoryService;
        }

        // GET: api/Orchid
        [HttpGet]
        [AllowAnonymous] // Allow anyone to view orchids
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ResponseObject))]
        public async Task<IActionResult> GetOrchids()
        {
            try
            {
                var orchids = await _orchidService.GetOrchids();
                return Ok(new ResponseObject
                {
                    Status = HttpStatusCode.OK,
                    Message = "Orchids retrieved successfully.",
                    Data = orchids
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ResponseObject
                {
                    Status = HttpStatusCode.InternalServerError,
                    Message = "An error occurred while retrieving orchids.",
                    Data = null
                });
            }
        }

        // GET: api/Orchid/5
        [HttpGet("{id}")]
        [AllowAnonymous] 
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ResponseObject))]
        public async Task<IActionResult> GetOrchidById(int id)
        {
            try
            {
                var orchid = await _orchidService.GetOrchidById(id);
                return Ok(new ResponseObject
                {
                    Status = HttpStatusCode.OK,
                    Message = "Orchid retrieved successfully.",
                    Data = orchid
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
                    Message = "An error occurred while retrieving the orchid.",
                    Data = null
                });
            }
        }

        // POST: api/Orchid
        [HttpPost]
        [Authorize(Roles = "Admin")] 
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ResponseObject))]
        public async Task<IActionResult> AddOrchid([FromBody] CreateOrchidRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ResponseObject
                {
                    Status = HttpStatusCode.BadRequest,
                    Message = "Invalid orchid data.",
                    Data = ModelState
                });
            }

            try
            {
                var category = await _categoryService.GetCategoryById(request.CategoryId);
                if (category == null) 
                {
                    return BadRequest(new ResponseObject
                    {
                        Status = HttpStatusCode.BadRequest,
                        Message = $"Category with ID {request.CategoryId} not found.",
                        Data = null
                    });
                }

                var orchid = new Orchid
                {
                    IsNatural = request.IsNatural,
                    OrchidDescription = request.OrchidDescription,
                    OrchidName = request.OrchidName,
                    OrchidUrl = request.OrchidUrl,
                    Price = request.Price,
                    CategoryId = request.CategoryId
                };

                await _orchidService.AddOrchid(orchid);
                return CreatedAtAction(nameof(GetOrchidById), new { id = orchid.OrchidId }, new ResponseObject
                {
                    Status = HttpStatusCode.Created,
                    Message = "Orchid added successfully.",
                    Data = orchid
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
                    Message = "An error occurred while adding the orchid.",
                    Data = null
                });
            }
        }

        // PUT: api/Orchid/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")] 
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ResponseObject))]
        public async Task<IActionResult> UpdateOrchid(int id, [FromBody] UpdateOrchidRequest request)
        {
            var existingOrchid = await _orchidService.GetOrchidById(id);
            if (existingOrchid == null)
            {
                return NotFound(new ResponseObject
                {
                    Status = HttpStatusCode.NotFound,
                    Message = $"Orchid with ID {id} not found for update.",
                    Data = null
                });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new ResponseObject
                {
                    Status = HttpStatusCode.BadRequest,
                    Message = "Invalid orchid data.",
                    Data = ModelState
                });
            }

            try
            {
                var category = await _categoryService.GetCategoryById(request.CategoryId);
                if (category == null)
                {
                    return BadRequest(new ResponseObject
                    {
                        Status = HttpStatusCode.BadRequest,
                        Message = $"Category with ID {request.CategoryId} not found.",
                        Data = null
                    });
                }

                var orchidToUpdate = new Orchid
                {
                    OrchidId = id,
                    IsNatural = request.IsNatural,
                    OrchidDescription = request.OrchidDescription,
                    OrchidName = request.OrchidName,
                    OrchidUrl = request.OrchidUrl,
                    Price = request.Price,
                    CategoryId = request.CategoryId
                };

                await _orchidService.UpdateOrchid(id, orchidToUpdate);
                return Ok(new ResponseObject
                {
                    Status = HttpStatusCode.OK,
                    Message = "Orchid updated successfully.",
                    Data = existingOrchid
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
                    Message = "An error occurred while updating the orchid.",
                    Data = null
                });
            }
        }

        // DELETE: api/Orchid/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] 
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status409Conflict, Type = typeof(ResponseObject))] 
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ResponseObject))]
        public async Task<IActionResult> DeleteOrchid(int id)
        {
            try
            {
                await _orchidService.DeleteOrchid(id);
                return Ok(new ResponseObject
                {
                    Status = HttpStatusCode.OK,
                    Message = $"Orchid with ID {id} deleted successfully.",
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
                    Message = "An error occurred while deleting the orchid.",
                    Data = null
                });
            }
        }
    }
}
