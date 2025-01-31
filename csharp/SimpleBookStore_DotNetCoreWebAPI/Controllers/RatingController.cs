using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleBookStore_DotNetCoreWebAPI.Data;
using SimpleBookStore_DotNetCoreWebAPI.Models;

namespace SimpleBookStore_DotNetCoreWebAPI.Controllers
{
    [ApiController]
    [Route("api/ratings")]
    public class RatingController
    {
        private readonly BookStoreContext _context;
        public RatingController(BookStoreContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Rating>>> GetAllRatings()
        {
            return await _context.Ratings.Include(r => r.Book).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Rating>> AddRating(Rating rating)
        {
            _context.Ratings.Add(rating);
            await _context.SaveChangesAsync();
            return new OkResult();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRating(int id, Rating updatedRating)
        {
            if (id != updatedRating.Id)
            {
                return new BadRequestResult();
            }
            _context.Entry(updatedRating).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return new NoContentResult();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRating(int id)
        {
            var rating = await _context.Ratings.FindAsync(id);
            if (rating == null)
            {
                return new NotFoundResult();
            }
            _context.Ratings.Remove(rating);
            await _context.SaveChangesAsync();
            return new OkResult();
        }
    }
}
