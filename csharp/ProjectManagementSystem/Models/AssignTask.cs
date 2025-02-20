using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ProjectManagementSystem.Models
{
    public class AssignTask
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AssignTaskId { get; set; }

        [Required]
        [ForeignKey("TaskItem")]
        public int TaskItemId { get; set; } // Task being assigned

        public TaskItem TaskItem { get; set; } // Navigation Property

        [Required]
        [ForeignKey("Assigner")]
        public string AssignerId { get; set; } // Who assigned the task

        public ApplicationUser Assigner { get; set; } // Navigation Property

        [Required]
        [ForeignKey("Assignee")]
        public string AssigneeId { get; set; } // Assigned user

        public ApplicationUser Assignee { get; set; } // Navigation Property

        public DateTime DateAssigned { get; set; } = DateTime.UtcNow;
    }
}
