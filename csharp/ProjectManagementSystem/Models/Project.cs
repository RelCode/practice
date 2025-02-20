﻿using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ProjectManagementSystem.Models
{
    public class Project
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ProjectId { get; set; }

        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        [Required]
        [ForeignKey("Owner")]
        public string OwnerId { get; set; } // User who owns the project

        public ApplicationUser Owner { get; set; } // Navigation property

        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>(); // One-to-Many Relationship
    }
}
