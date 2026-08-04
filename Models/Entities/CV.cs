namespace HirePoint.Models.Entities
{
    public class CV
    {
        public Guid CVID { get; set; }
        public Guid UserID { get; set; }
        public User User { get; set; }

       
        public string FileName { get; set; }

        // Stores the location of the file on the server
        // Example: /Uploads/CVs/Ayanda_Maseko_CV.pdf
        public string FilePath { get; set; }

        public DateTime UploadDate { get; set; } = DateTime.Now;
        // Navigation Property - accesses all job applications submitted using this CV
        public ICollection<Application> Applications { get; set; } = new List<Application>();
    }
}
