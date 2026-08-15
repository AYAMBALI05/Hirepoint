using System.ComponentModel.DataAnnotations;

namespace HirePoint.Models.DTOs.Qualifications
{
    public class UpdateQualificationDto
    {
        [Required]
        [StringLength(100)]
        public string QualificationName { get; set; } = string.Empty;
    }
}
