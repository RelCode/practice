using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManagementSystem.Data;
using ProjectManagementSystem.Models;

namespace ProjectManagementSystem.Controllers;

[ApiController]
[Route("api/tasks")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public TasksController(AppDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet("{projectId}")]
    public async Task<IActionResult> GetTasks(int projectId)
    {
        var userId = GetUserId();
        var project = await _context.Projects.FindAsync(projectId);
        if (project == null)
        {
            return NotFound("Project not found");
        }
        var tasks = await _context.Tasks.Where(t => t.ProjectId == projectId).ToListAsync();
        return Ok(tasks);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] TaskItem taskitem)
    {
        var userId = GetUserId();
        var project = await _context.Projects.FindAsync(taskitem.ProjectId);
        if (project == null)
            return NotFound("Project not found");
        if (project.OwnerId != userId)
        {
            return Unauthorized("You are not authorized to perform this action");
        }
        taskitem.IsCompleted = false;
        _context.Tasks.Add(taskitem);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetTasks), new { projectId = taskitem.ProjectId }, taskitem);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskItem taskItem)
    {
        var userId = GetUserId();
        var existingItem = await _context.Tasks.FindAsync(id);
        if (existingItem == null)
            return NotFound("Task not found");
        var project  = await _context.Projects.FindAsync(existingItem.ProjectId);
        if (project == null)
            return NotFound("Project not found");
        if (project.OwnerId != userId)
            return Unauthorized("You are not authorized to perform this action");
        existingItem.Title = taskItem.Title;
        existingItem.Description = taskItem.Description;
        existingItem.DueDate = taskItem.DueDate;
        existingItem.IsCompleted = taskItem.IsCompleted;
        existingItem.ProjectId = taskItem.ProjectId;
        await _context.SaveChangesAsync();
        return Ok("Task updated");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var userId = GetUserId();
        var existingItem = await _context.Tasks.FindAsync(id);
        if (existingItem == null)
        {
            return NotFound("Task not found");
        }
        var project = await _context.Projects.FindAsync(existingItem.ProjectId);
        if (project == null)
            return NotFound("Project not found");
        if (project.OwnerId != userId)
            return Unauthorized("You are not authorized to perform this action");
        _context.Tasks.Remove(existingItem);
        await _context.SaveChangesAsync();
        return Ok("Task deleted");
    }

    private string GetUserId()
    {
        var userId = _userManager.GetUserId(User);
        if (userId == null)
            throw new UnauthorizedAccessException("You are not authorized to access this resource.");
        return userId;
    }
}