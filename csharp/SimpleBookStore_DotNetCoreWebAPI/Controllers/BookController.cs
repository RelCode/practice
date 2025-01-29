using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using SimpleBookStore_DotNetCoreWebAPI.Models;
using System.Collections.Generic;
using System.Linq;


namespace SimpleBookStore_DotNetCoreWebAPI.Controllers
{
    [ApiController]
    [Route("api/books")]
    public class BookController
    {
        private static List<Book> books = new List<Book>
        {
            new Book { Id = 1, Title = "The Great Gatsby", Author = "F. Scott Fitzgerald", Price = 7.43, Stock = 3 },
            new Book { Id = 2, Title = "To Kill a Mockingbird", Author = "Harper Lee", Price = 6.99, Stock = 5 },
            new Book { Id = 3, Title = "1984", Author = "George Orwell", Price = 6.99, Stock = 2 },
            new Book { Id = 4, Title = "Harry Potter and the Sorcerer's Stone", Author = "J.K. Rowling", Price = 7.99, Stock = 0 },
            new Book { Id = 5, Title = "The Catcher in the Rye", Author = "J.D. Salinger", Price = 6.99, Stock = 1 }
        };

        [HttpGet]
        public ActionResult<IEnumerable<Book>> GetAllBooks()
        {
            return books;
        }

        [HttpGet("{id}")]
        public ActionResult<Book> GetBookById(int id)
        {
            var book = books.FirstOrDefault(b => b.Id == id);
            if (book == null)
            {
                return new NotFoundResult();
            }
            return book;
        }

        [HttpPost]
        public ActionResult<Book> AddBook(Book newBook)
        {
            int newId = books.Max(b => b.Id) + 1;
            newBook.Id = newId;
            books.Add(newBook);
            return new CreatedResult("api/books/" + newId, newBook);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateBook(int id, Book updatedBook)
        {
            var book = books.FirstOrDefault(b => b.Id == id);
            if (book == null)
            {
                return new NotFoundResult();
            }
            book.Title = updatedBook.Title;
            book.Author = updatedBook.Author;
            book.Price = updatedBook.Price;
            book.Stock = updatedBook.Stock;
            return new OkResult();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteBook(int id)
        {
            var newBooks = books.Where(b => b.Id != id).ToList();
            if (newBooks.Count == books.Count)
            {
                return new NotFoundResult();
            }
            books = newBooks;
            return new OkResult();
        }
    }
}
