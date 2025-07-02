using BusinessObjects.Entities;
using Repositories.Interfaces;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Implementations
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IOrchidRepository _orchidRepository; 

        public CategoryService(ICategoryRepository categoryRepository, IOrchidRepository orchidRepository) 
        {
            _categoryRepository = categoryRepository;
            _orchidRepository = orchidRepository; 
        }

        public async Task<IEnumerable<Category>> GetCategories()
        {
            return await _categoryRepository.GetCategories();
        }

        public async Task<Category> GetCategoryById(int id)
        {
            var category = await _categoryRepository.GetCategoryById(id);
            if (category == null)
            {
                throw new KeyNotFoundException($"Category with ID {id} not found.");
            }
            return category;
        }

        public async Task AddCategory(Category category)
        {
            if (string.IsNullOrWhiteSpace(category.CategoryName))
            {
                throw new ArgumentException("Category name cannot be empty.");
            }
            await _categoryRepository.AddCategory(category);
        }

        public async Task UpdateCategory(Category category)
        {
            var existingCategory = await _categoryRepository.GetCategoryById(category.CategoryId);
            if (existingCategory == null)
            {
                throw new KeyNotFoundException($"Category with ID {category.CategoryId} not found for update.");
            }
            if (string.IsNullOrWhiteSpace(category.CategoryName))
            {
                throw new ArgumentException("Category name cannot be empty.");
            }
            await _categoryRepository.UpdateCategory(category);
        }

        public async Task DeleteCategory(int id)
        {
            var categoryToDelete = await _categoryRepository.GetCategoryById(id);
            if (categoryToDelete == null)
            {
                throw new KeyNotFoundException($"Category with ID {id} not found for deletion.");
            }

            var allOrchids = await _orchidRepository.GetOrchids(); 
            if (allOrchids.Any(o => o.CategoryId == id))
            {
                throw new InvalidOperationException($"Cannot delete category '{categoryToDelete.CategoryName}' because it has associated orchids. Please delete or reassign orchids first.");
            }

            await _categoryRepository.DeleteCategory(id);
        }
    }
}
