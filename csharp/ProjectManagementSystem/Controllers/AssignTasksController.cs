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

    [HttpPost("{assignmentAction}")]
    public async Task<IActionResult> AssignTask(string assignmentAction, [FromBody] AssignTask assignTask)
    {
        var userID = _userManager.GetUserId(User);
        if (assignmentAction == "Assign")
        {
            assignTask.AssignerId = userID;
            assignTask.DateAssigned = DateTime.UtcNow;
            _context.AssignTasks.Add(assignTask);
            await _context.SaveChangesAsync();
            return Ok();
        }
        else if (assignmentAction == "Unassign")
        {
            var assignment = await _context.AssignTasks.Where(a => a.AssignerId == userID && a.TaskItemId == assignTask.TaskItemId && a.Assignee == assignTask.Assignee).FirstOrDefaultAsync();
            if (assignment == null)
                return NotFound(new { message = "Assign task not found." });
            _context.AssignTasks.Remove(assignment);
            await _context.SaveChangesAsync();
            return Ok();
        }
        else
        {
            return BadRequest("Invalid assignment action");
        }
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