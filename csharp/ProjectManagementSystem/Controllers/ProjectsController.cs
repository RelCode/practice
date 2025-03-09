using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManagementSystem.Data;
using ProjectManagementSystem.Models;
using System.Security.Claims;

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

    [HttpGet("{projectId}")]
    public async Task<IActionResult> GetProject(int projectId)
    {
        var userId = GetUserId();
        var project = await _context.Projects.FindAsync(projectId);
        if (project == null)
            return Unauthorized(new { message = "No Project Found with Matching ID" });
        if (project.OwnerId != userId)
            return Unauthorized(new { message = "You are unauthorized to view this project" });
        return Ok(project);
    }

    [HttpPost]
    public async Task<IActionResult> AddProject([FromBody] Project project)
    {
        
        var userId = GetUserId();
        var sameName = await _context.Projects.Where(p => p.Name.Equals(project.Name) && p.OwnerId.Equals(userId)).ToListAsync();
        if (sameName.Count > 0)
            return Unauthorized(new { message = $"Project Titled: {project.Name} Already Exists" });
        project.OwnerId = userId;
        _context.Projects.Add(project);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetProjects), new { id = project.ProjectId }, new { project = project, projectId = project.ProjectId });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProject(int id, [FromBody] Project project)
    {
        // Assuming this is in a controller with User property
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get user ID from claims

        var existingProject = await _context.Projects.FindAsync(id);
        if (existingProject == null)
            return NotFound("Project not found");

        if (existingProject.OwnerId != userId)
            return Unauthorized("You are not authorized to update this project");

        // Update basic properties
        existingProject.Name = project.Name;
        existingProject.Description = project.Description;

        // Handle task associations if needed
        if (project.Tasks != null)
        {
            // Clear existing associations and add new ones
            var projectTasks = await _context.Tasks.Where(pt => pt.ProjectId == id).ToListAsync();
            _context.Tasks.RemoveRange(projectTasks);

            foreach (var task in project.Tasks)
            {
                _context.Tasks.Add(new TaskItem { ProjectId = id, TaskItemId = task.TaskItemId });
            }
        }

        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetProjects), new { id = project.ProjectId }, new { project = project, projectId = project.ProjectId });
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