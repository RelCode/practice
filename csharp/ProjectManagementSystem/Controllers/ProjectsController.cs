using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManagementSystem.Data;
using ProjectManagementSystem.Models;

namespace ProjectManagementSystem.Controllers;

[ApiController]
[Route("api/projects")]
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
        var userId = GetUserId();
        var projects = await _context.Projects.Where(p => p.OwnerId == userId).ToListAsync();
        return Ok(projects);
    }

    [HttpGet("{projectId}/tasks")]
    public async Task<IActionResult> GetProjectTasks(int projectId)
    {
        var userId = GetUserId();
        var project = await _context.Projects.FindAsync(projectId);
        if (project == null || project.OwnerId != userId)
            return Unauthorized(new { message = "Project not found for this user" });
        var tasks = await _context.Tasks.Where(t => t.ProjectId == projectId).ToListAsync();
        if (tasks.Count == 0)
            return NotFound(new { message = "No tasks found for this project" });
        return Ok(tasks);
    }

    [HttpPost]
    public async Task<IActionResult> AddProject([FromBody] Project project)
    {
        var userId = GetUserId();
        project.OwnerId = userId;
        _context.Projects.Add(project);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetProjects), new { id = project.ProjectId }, project);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProject(int id, [FromBody] Project project)
    {
        var userId = GetUserId();
        var existingProject = await _context.Projects.FindAsync(id);
        if (existingProject == null)
            return NotFound("Project not found");
        if (existingProject.OwnerId != userId)
            return Unauthorized("You are not authorized to update this project");
        existingProject.Name = project.Name;
        existingProject.Description = project.Description;
        await _context.SaveChangesAsync();
        return Ok("Project updated");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProject(int id)
    {
        var userId = GetUserId();
        var existingProject = await _context.Projects.FindAsync(id);
        if (existingProject == null)
            return NotFound("Project not found");
        if (existingProject.OwnerId != userId)
            return Unauthorized("You are not authorized to delete this project");
        _context.Projects.Remove(existingProject);
        await _context.SaveChangesAsync();
        return Ok("Project Deleted");
    }

    private string GetUserId()
    {
        var userId = _userManager.GetUserId(User);
        if (userId == null)
            throw new UnauthorizedAccessException("You are not authorized to access this resource.");
        return userId;
    }
}