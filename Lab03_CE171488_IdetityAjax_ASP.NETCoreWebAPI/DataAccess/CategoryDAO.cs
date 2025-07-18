using BusinessObjects.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess
{
    public class CategoryDAO
    {
        private readonly OrchidShopDbContext _context;

        public CategoryDAO()
        {
            _context = new OrchidShopDbContext();
        }

        public List<Category> GetCategories()
        {
            List<Category> listCategories = new List<Category>();
            try
            {
                listCategories = _context.Categories.ToList();
            }
            catch (Exception e)
            {
                throw new Exception("Error in GetCategories (DAO): " + e.Message);
            }
            return listCategories;
        }

        public Category FindCategoryById(int categoryId)
        {
            Category c = null;
            try
            {
                c = _context.Categories.SingleOrDefault(cat => cat.CategoryId == categoryId);
            }
            catch (Exception e)
            {
                throw new Exception("Error in FindCategoryById (DAO): " + e.Message);
            }
            return c;
        }

        public void SaveCategory(Category c)
        {
            try
            {
                _context.Categories.Add(c);
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception("Error in SaveCategory (DAO): " + e.Message);
            }
        }

        public void UpdateCategory(Category c)
        {
            try
            {
                _context.Entry<Category>(c).State = EntityState.Modified;
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception("Error in UpdateCategory (DAO): " + e.Message);
            }
        }

        public void DeleteCategory(Category c)
        {
            try
            {
                var categoryToDelete = _context.Categories.SingleOrDefault(cat => cat.CategoryId == c.CategoryId);
                if (categoryToDelete == null)
                {
                    throw new Exception("Category not found for deletion (DAO).");
                }
                _context.Categories.Remove(categoryToDelete);
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception("Error in DeleteCategory (DAO): " + e.Message);
            }
        }
    }
}
