using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectManagementSystem.Models;

public class TaskItem
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    [Required]
    [MaxLength(200)]
    public string Title { get; set; }
    public string Description { get; set; }
    [Required]
    public bool IsCompleted { get; set; }

    public DateTime DueDate { get; set; }
    [Required]
    [ForeignKey("Project")]
    public int ProjectId { get; set; }
}