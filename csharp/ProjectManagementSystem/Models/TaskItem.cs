using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ProjectManagementSystem.Models
{
    public class TaskStatus
    {
        public const string Ready = "Ready";
        public const string InProgress = "In Progress";
        public const string Completed = "Completed";
        public const string OnHold = "On Hold";
    }
    public class TaskItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TaskItemId { get; set; }

        [Required]
        public string Title { get; set; }

        public string Description { get; set; }

        public DateTime DueDate { get; set; }

        public string Status { get; set; } = TaskStatus.Ready;

        [Required]
        [ForeignKey("Project")]
        public int ProjectId { get; set; } // Every task belongs to a project
    }
}
