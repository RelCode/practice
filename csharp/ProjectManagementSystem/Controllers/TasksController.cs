using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManagementSystem.Data;
using ProjectManagementSystem.Models;
using TaskStatus = ProjectManagementSystem.Models.TaskStatus;

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
    public async Task<IActionResult> GetTasksInProject(int projectId)
    {
        var userId = GetUserId();
        var project = await _context.Projects.FindAsync(projectId);
        if (project == null)
            return NotFound(new { message = "Project not found" });
        if (project.OwnerId != userId)
            return Unauthorized(new { message = "You are not allowed to perform action" });
        var tasks = await _context.Tasks.Where(t => t.ProjectId == projectId).ToListAsync();
        if (tasks == null)
            return NotFound(new { message = "Tasks not found" });
        return Ok(tasks);
    }

    [HttpGet("{taskId}/assignees")]
    public async Task<IActionResult> GetAssignedUsers(int taskId)
    {
        var users = await _context.AssignTasks.Where(a => a.TaskItemId == taskId).ToListAsync();
        if (users.Count == 0)
            return NotFound(new { message = "Task not found" });
        return Ok(users);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] TaskItem taskitem)
    {
        var userId = GetUserId();
        var project = await _context.Projects.FindAsync(taskitem.ProjectId);
        if (project == null)
            return NotFound(new { message = "Project not found" });
        if (project.OwnerId != userId)
            return Unauthorized(new { message = "You are not authorized to perform this action" });
        Console.WriteLine("Status: " + taskitem.Status);
        taskitem.Status = TaskStatus.Ready;
        taskitem.Project = project;
        _context.Tasks.Add(taskitem);
        await _context.SaveChangesAsync();
        return Ok(new { status = "success" });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskItem taskItem)
    {
        var userId = GetUserId();
        var existingItem = await _context.Tasks.FindAsync(id);
        if (existingItem == null)
            return NotFound(new { message = "Task not found" });
        var project = await _context.Projects.FindAsync(existingItem.ProjectId);
        if (project == null)
            return NotFound(new { message = "Project not found" });
        if (project.OwnerId != userId)
            return Unauthorized(new { message = "You are not authorized to perform this action" });
        existingItem.Title = taskItem.Title;
        existingItem.Description = taskItem.Description;
        existingItem.DueDate = taskItem.DueDate;
        existingItem.Status = taskItem.Status;
        existingItem.ProjectId = taskItem.ProjectId;
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var userId = GetUserId();
        var existingItem = await _context.Tasks.FindAsync(id);
        if (existingItem == null)
            return NotFound(new { message = "Task not found" });
        var project = await _context.Projects.FindAsync(existingItem.ProjectId);
        if (project == null)
            return NotFound(new { message = "Project not found" });
        if (project.OwnerId != userId)
            return Unauthorized(new { message = "You are not authorized to perform this action" });
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