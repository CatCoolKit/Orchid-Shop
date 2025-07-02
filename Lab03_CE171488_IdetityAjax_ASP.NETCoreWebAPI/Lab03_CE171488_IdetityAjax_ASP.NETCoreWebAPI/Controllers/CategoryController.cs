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
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // GET: api/Category
        [HttpGet]
        [AllowAnonymous] 
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ResponseObject))]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                var categories = await _categoryService.GetCategories();
                return Ok(new ResponseObject
                {
                    Status = HttpStatusCode.OK,
                    Message = "Categories retrieved successfully.",
                    Data = categories
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ResponseObject
                {
                    Status = HttpStatusCode.InternalServerError,
                    Message = "An error occurred while retrieving categories.",
                    Data = null
                });
            }
        }

        // GET: api/Category/5
        [HttpGet("{id}")]
        [AllowAnonymous] 
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ResponseObject))]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            try
            {
                var category = await _categoryService.GetCategoryById(id);
                return Ok(new ResponseObject
                {
                    Status = HttpStatusCode.OK,
                    Message = "Category retrieved successfully.",
                    Data = category
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
                    Message = "An error occurred while retrieving the category.",
                    Data = null
                });
            }
        }

        // POST: api/Category
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)] 
        [ProducesResponseType(StatusCodes.Status403Forbidden)] 
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ResponseObject))]
        public async Task<IActionResult> AddCategory([FromBody] CreateCategoryRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ResponseObject
                {
                    Status = HttpStatusCode.BadRequest,
                    Message = "Invalid category data.",
                    Data = ModelState
                });
            }

            var category = new Category
            {
                CategoryName = request.CategoryName
            };

            try
            {
                await _categoryService.AddCategory(category);
                return CreatedAtAction(nameof(GetCategoryById), new { id = category.CategoryId }, new ResponseObject
                {
                    Status = HttpStatusCode.Created,
                    Message = "Category added successfully.",
                    Data = category
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
                    Message = "An error occurred while adding the category.",
                    Data = null
                });
            }
        }

        // PUT: api/Category/5
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ResponseObject))]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] UpdateCategoryRequest request)
        {
            var existingCategory = await _categoryService.GetCategoryById(id);
            if (existingCategory == null)
            {
                return NotFound(new ResponseObject
                {
                    Status = HttpStatusCode.NotFound,
                    Message = $"Category with ID {id} not found for update.",
                    Data = null
                });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new ResponseObject
                {
                    Status = HttpStatusCode.BadRequest,
                    Message = "Invalid category data.",
                    Data = ModelState
                });
            }

            existingCategory.CategoryName = request.CategoryName;
            existingCategory.CategoryId = id; 

            try
            {
                await _categoryService.UpdateCategory(existingCategory);
                return Ok(new ResponseObject
                {
                    Status = HttpStatusCode.OK,
                    Message = "Category updated successfully.",
                    Data = existingCategory
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
                    Message = "An error occurred while updating the category.",
                    Data = null
                });
            }
        }

        // DELETE: api/Category/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(ResponseObject))]
        [ProducesResponseType(StatusCodes.Status409Conflict, Type = typeof(ResponseObject))] 
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(ResponseObject))]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                await _categoryService.DeleteCategory(id);
                return Ok(new ResponseObject
                {
                    Status = HttpStatusCode.OK,
                    Message = $"Category with ID {id} deleted successfully.",
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
                    Message = "An error occurred while deleting the category.",
                    Data = null
                });
            }
        }
    }
}
