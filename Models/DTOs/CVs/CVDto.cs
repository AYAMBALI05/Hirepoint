namespace HirePoint.Models.DTOs.CVs
{
    public class CVDto
    {
        public Guid CVID { get; set; }

        public Guid UserID { get; set; }

        public string FileName { get; set; }

        public string FilePath { get; set; }

        public DateTime UploadDate { get; set; }
    }
}
