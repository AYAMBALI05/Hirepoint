using System.Diagnostics.Contracts;

namespace HirePoint.Models.Entities
{
    public class Notifications
    {
        //Add table on the DB
        public int NotificationID { get; set; }
        public int UserID { get; set; }
        public string Message { get; set; }
        public DateTime DateCreated { get; set; }
        public bool IsRead { get; set; }
    }
}
