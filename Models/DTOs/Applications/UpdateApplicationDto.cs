using HirePoint.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace HirePoint.Models.DTOs.Applications
{
    public class UpdateApplicationDto
    {
        [Required]
        public ApplicationStatus Status { get; set; } 

     //   public string? Feedback { get; set; } removed because AI will generate the message
    }
}
