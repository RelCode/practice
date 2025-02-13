using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManagementSystem.Data;
using ProjectManagementSystem.Models;

namespace ProjectManagementSystem.Controllers;

[Route("api/projects")]
[ApiController]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public ProjectsController(AppDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetProjects()
    {
        var userId = _userManager.GetUserId(User);
        var projects = await _context.Projects.Where(p => p.OwnerId == userId).ToListAsync();
        return Ok(projects);
    }

    [HttpPost]
    public async Task<IActionResult> CreateProject([FromBody] Project project)
    {
        var userId = _userManager.GetUserId(User);
        project.OwnerId = userId;

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetProjects), new { id = project.Id }, project);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProject(int id, [FromBody] Project project)
    {
        var userId = _userManager.GetUserId(User);
        var projectFromDb = await _context.Projects.FindAsync(id);
        if (projectFromDb == null)
            return NotFound("Project not found");
        
        projectFromDb.Name = project.Name;
        projectFromDb.Description = project.Description;
        await _context.SaveChangesAsync();
        return Ok("Project updated");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProject(int Id)
    {
        var userId = _userManager.GetUserId(User);
        var project = await _context.Projects.FindAsync(Id);
        if (project == null)
            return NotFound("Project not found");
        if (project.OwnerId != userId)
            return Unauthorized("You are not authorized to delete this project");
        _context.Projects.Remove(project);
        return Ok("Project deleted");
    }
}