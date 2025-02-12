using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ProjectManagementSystem.Data;

public class AppDbContext: IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}
    
    // public DbSet<Project> Projects { get; set; }
    // public DbSet<TaskItem> Tasks { get; set; }
}

public class ApplicationUser : IdentityUser {}