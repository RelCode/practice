﻿using Microsoft.EntityFrameworkCore;
using SimpleBookStore_DotNetCoreWebAPI.Models;

namespace SimpleBookStore_DotNetCoreWebAPI.Data
{
    public class BookStoreContext : DbContext
    {
        public BookStoreContext(DbContextOptions<BookStoreContext> options) : base(options)
        {
        }

        public DbSet<Book> Books { get; set; }
        public DbSet<Rating> Ratings { get; set; }
    }
}
