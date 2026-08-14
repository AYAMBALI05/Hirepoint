using Microsoft.Identity.Client;

namespace HirePoint.Models.Entities
{
    public class Qualification
    {
        public int QualificationID {  get; set; }
        public string QualificationName { get; set; }
        // Navigation Property - accesses all jobs that require this qualification

    }
}
