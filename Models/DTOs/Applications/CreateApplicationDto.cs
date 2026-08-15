using System.ComponentModel.DataAnnotations;

namespace HirePoint.Models.DTOs.Applications
{
    public class CreateApplicationDto
    {
        public Guid UserID { get; set; }

        public Guid JobID { get; set; }

      
        // Used when the applicant chooses an existing CV.
        public Guid? CVID { get; set; }

        // Used when the applicant chooses to upload a new CV.
        public IFormFile? CVFile { get; set; }
    }
}
