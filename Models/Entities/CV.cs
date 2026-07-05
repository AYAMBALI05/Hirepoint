namespace HirePoint.Models.Entities
{
    public class CV
    {
        public int CVID { get; set; }
        public int UserID { get; set; }
        public string FileName{ get; set; }
        public string FilePath { get; set; } //Location of CVs on the server
        public DateTime UploadDate { get; set; }

    }
}
