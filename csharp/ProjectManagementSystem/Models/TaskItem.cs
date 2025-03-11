using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ProjectManagementSystem.Models
{
    public enum TaskStatus { Ready, InProgress, Completed, OnHold }
    public class TaskItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TaskItemId { get; set; }

        [Required]
        public string Title { get; set; }

        public string Description { get; set; }

        public DateTime DueDate { get; set; }

        public TaskStatus Status { get; set; } = TaskStatus.Ready;

        [Required]
        [ForeignKey("Project")]
        public int ProjectId { get; set; } // Every task belongs to a project

        public Project Project { get; set; } // Navigation Property

        public ICollection<AssignTask> Assignments { get; set; } = new List<AssignTask>(); // One-to-Many with AssignTask
    }
}
