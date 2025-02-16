using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectManagementSystem.Models;

public enum CurrentAssigneeStatus { Yes, No }

public class AssignTask
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int AssignTaskId { get; set; }
    [Required]
    [ForeignKey("TaskItem")]
    public int TaskItemId { get; set; }
    [Required]
    public string AssignerId { get; set; } // person who assigned the task
    public List<string> AssigneeIds { get; set; } // an array of assined users (1 element if assigned to 1 person)
    public CurrentAssigneeStatus CurrentAssigneeStatus { get; set; } // latest team assignment status for history tracking
    public DateTime DateAssigned { get; set; }
}