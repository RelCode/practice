using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManagementSystem.Data;
using ProjectManagementSystem.Models;

namespace ProjectManagementSystem.Controllers;

[ApiController]
[Route("api/assignTasks")]
[Authorize]
public class AssignTasksController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public AssignTasksController(AppDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetAssignTasks()
    {
        var userId = GetUserId();
        var assignments = await _context.AssignTasks.Where(a => a.CurrentAssigneeStatus == CurrentAssigneeStatus.Yes).ToListAsync();
        if (assignments.Count == 0)
            return NotFound("There are no assigned tasks.");
        var assigner = assignments.Where(a => a.AssignerId == userId).ToList();
        var assignee = assignments.Where(a => a.AssigneeIds.Contains(userId) && a.AssignerId != userId).ToList();
        return Ok(new { assigner = assigner, assignee = assignee });
    }

    [HttpPost("{currentAssignmentId}")]
    public async Task<IActionResult> AssignTask(int currentAssignmentId, [FromBody] AssignTask assignTask)
    {
        var userId = GetUserId();
        if (currentAssignmentId > 0) // means we are updating an existing assignment list
        {
            var currentAssignment = await _context.AssignTasks.FindAsync(currentAssignmentId);
            if (currentAssignment == null)
                return NotFound("Current Task Assignment Does Not Exist");
            currentAssignment.CurrentAssigneeStatus = CurrentAssigneeStatus.No; // flag this as an older assignmnet
        }

        assignTask.CurrentAssigneeStatus = CurrentAssigneeStatus.Yes;
        assignTask.AssignerId = userId;
        assignTask.DateAssigned = DateTime.UtcNow;
        _context.AssignTasks.Add(assignTask);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAssignTasks), new { assignTaskId = assignTask.AssignerId }, assignTask);
    }

    [HttpGet("{taskItemId}")]
    public async Task<IActionResult> GetAssignmentHistory(int id)
    {
        var userId = GetUserId();
        var assignments = await _context.AssignTasks.Where(a => a.TaskItemId == id && a.AssignerId == userId).ToListAsync();
        return Ok(assignments);
    }

    private string GetUserId()
    {
        var userId = _userManager.GetUserId(User);
        if (userId == null)
            throw new UnauthorizedAccessException("You are not authorized to access this resource.");
        return userId;
    }
}