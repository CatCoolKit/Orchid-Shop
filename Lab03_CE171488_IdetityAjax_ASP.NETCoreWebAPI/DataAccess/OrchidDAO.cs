using BusinessObjects.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess
{
    public class OrchidDAO
    {
        private readonly OrchidShopDbContext _context; 

        public OrchidDAO(OrchidShopDbContext context)
        {
            _context = context; 
        }

        public List<Orchid> GetOrchids()
        {
            List<Orchid> listOrchids = new List<Orchid>(); 
            try
            {
                listOrchids = _context.Orchids
                                        .Include(o => o.Category) 
                                        .ToList();
            }
            catch (Exception e)
            {
                throw new Exception("Error in GetOrchids (DAO): " + e.Message); 
            }
            return listOrchids;
        }

        public Orchid FindOrchidById(int orchidId)
        {
            Orchid o = null; 
            try
            {
                o = _context.Orchids
                    .Include(o => o.Category)
                                .SingleOrDefault(c => c.OrchidId == orchidId);
            }
            catch (Exception e)
            {
                throw new Exception("Error in FindOrchidById (DAO): " + e.Message); 
            }
            return o;
        }

        public void SaveOrchid(Orchid o) 
        {
            try
            {
                _context.Orchids.Add(o);
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception("Error in SaveOrchid (DAO): " + e.Message);
            }
        }

        public void UpdateOrchid(Orchid o)
        {
            try
            {
                _context.Entry<Orchid>(o).State = EntityState.Modified;
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception("Error in UpdateOrchid (DAO): " + e.Message); 
            }
        }

        public void DeleteOrchid(Orchid o)
        {
            try
            {
                var orchidToDelete = _context.Orchids.SingleOrDefault(c => c.OrchidId == o.OrchidId);
                if (orchidToDelete == null)
                {
                    throw new Exception("Orchid not found for deletion (DAO)."); 
                }
                _context.Orchids.Remove(orchidToDelete);
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception("Error in DeleteOrchid (DAO): " + e.Message);
            }
        }
    }
}
