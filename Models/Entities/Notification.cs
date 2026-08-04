using System.Diagnostics.Contracts;

namespace HirePoint.Models.Entities
{
    public class Notification
    {
        //Add table on the DB
        // Primary Key - uniquely identifies each notification
        public Guid NotificationID { get; set; }

        // Foreign Key - identifies the user receiving the notification
        public Guid UserID { get; set; }

        // Navigation Property - accesses the related User
        public User User { get; set; }

        // Stores the notification message
        public string Message { get; set; }

        // Stores when the notification was created
        public DateTime DateCreated { get; set; } = DateTime.Now;

        // Indicates whether the user has read the notification
        public bool IsRead { get; set; } = false;
    }
}
