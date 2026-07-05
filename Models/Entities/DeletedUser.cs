namespace HirePoint.Models.Entities
{
    public class DeletedUser
    {
        public int DeletedUserID { get; set; }
        public int UserID { get; set; }
        public string UserName { get; set; }
        public string UserEmail { get; set; }
        public DateTime DeletedDate { get; set; }
    }
}
