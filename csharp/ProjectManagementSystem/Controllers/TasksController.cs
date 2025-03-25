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

    [HttpGet("{projectId}/{taskId}/task")]
    public async Task<IActionResult> GetTask(int projectId, int taskId)
    {
        var userId = GetUserId();
        var project = await _context.Projects.FindAsync(projectId);
        if (project == null)
            return NotFound(new { message = "Project not found!" });
        var task = await _context.Tasks.Where(t => t.TaskItemId == taskId && t.ProjectId == projectId).FirstAsync();
        if (task == null)
            return NotFound(new { message = "Task Item not found" });
        return Ok(task);
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
        var project = await _context.Projects.Where(p => p.ProjectId == taskitem.ProjectId && p.OwnerId == userId).FirstAsync();
        if (project == null)
            return NotFound(new { message = "Project not found" });
        if (project.OwnerId != userId)
            return Unauthorized(new { message = "You are not authorized to perform this action" });
        taskitem.Status = GetTaskStatus(taskitem.Status);
        _context.Tasks.Add(taskitem);
        await _context.SaveChangesAsync();
        return Ok(new { status = "success" });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskItem taskItem)
    {
        Console.WriteLine("Updating Task: " + id);
        var userId = GetUserId();
        var project = await _context.Projects.Where(p => p.OwnerId == userId && p.ProjectId == taskItem.ProjectId).FirstAsync();
        if (project == null)
            return NotFound(new { message = "Project not found!" });
        var existingItem = await _context.Tasks.Where(t => t.ProjectId == project.ProjectId && t.TaskItemId == id).FirstAsync();
        if (existingItem == null)
            return NotFound(new { message = "Task not found" });
        existingItem.Title = taskItem.Title;
        existingItem.Description = taskItem.Description;
        existingItem.DueDate = taskItem.DueDate;
        existingItem.Status = GetTaskStatus(taskItem.Status);
        existingItem.ProjectId = taskItem.ProjectId;
        await _context.SaveChangesAsync();
        return Ok(new { status = "success" });
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

    private string GetTaskStatus(string status)
    {
        if (status == "Ready")
            return TaskStatus.Ready;
        if (status == "InProgress")
            return TaskStatus.InProgress;
        if (status == "Completed")
            return TaskStatus.Completed;
        if (status == "OnHold")
            return TaskStatus.OnHold;
        else
        {
            return "";
        }
    }
}