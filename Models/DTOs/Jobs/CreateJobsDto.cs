using System.ComponentModel.DataAnnotations;

namespace HirePoint.Models.DTOs.Jobs
{
    public class CreateJobsDto
    {
        [Required]
        public Guid CompanyID { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;
        [Required]
        [StringLength(100)]
        public string QualificationRequired { get; set; } = string.Empty;

        [Required]
        [Range(0, double.MaxValue)]
        public float Salary { get; set; }

        [Required]
        public string ExperienceRequired { get; set; } = string.Empty;

        [Required]
        public string EmploymentType { get; set; } = string.Empty;

        [Required]
        [Range(1, 1000)]
        public int AvailableVacancies { get; set; }

        [Required]
        public int CityID { get; set; }

        [Required]
        public DateTime ClosingDate { get; set; }
    }
}
