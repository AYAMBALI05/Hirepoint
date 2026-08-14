namespace HirePoint.Models.DTOs.CVs
{
    public class CVDto
    {
        public Guid CVID { get; set; }
        public Guid UserID { get; set; }
        public string? ApplicantName { get; set; }
        public string? FileName { get; set; } = string.Empty;
        public string? FilePath { get; set; } = string.Empty;
        public DateTime UploadDate { get; set; }
    }
}
