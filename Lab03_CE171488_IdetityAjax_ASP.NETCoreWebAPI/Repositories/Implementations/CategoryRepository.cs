using BusinessObjects.Entities;
using DataAccess;
using Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Implementations
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly CategoryDAO _categoryDAO;

        public CategoryRepository(CategoryDAO categoryDAO) 
        {
            _categoryDAO = categoryDAO; 
        }

        public async Task<IEnumerable<Category>> GetCategories()
        {
            return await Task.FromResult(_categoryDAO.GetCategories()); 
        }

        public async Task<Category> GetCategoryById(int id)
        {
            return await Task.FromResult(_categoryDAO.FindCategoryById(id));
        }

        public async Task AddCategory(Category category)
        {
            await Task.Run(() => _categoryDAO.SaveCategory(category)); 
        }

        public async Task UpdateCategory(Category category)
        {
            await Task.Run(() => _categoryDAO.UpdateCategory(category)); 
        }

        public async Task DeleteCategory(int id)
        {
            var categoryToDelete = await GetCategoryById(id);
            if (categoryToDelete == null)
            {
                throw new KeyNotFoundException($"Category with ID {id} not found in repository for deletion.");
            }
            await Task.Run(() => _categoryDAO.DeleteCategory(categoryToDelete)); 
        }
    }
}
