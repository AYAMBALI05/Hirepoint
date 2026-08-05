namespace HirePoint.Models.DTOs.Notifications
{
    public class NotificationDto
    {
        public Guid NotificationID { get; set; }

        public Guid UserID { get; set; }

        public string Message { get; set; }

        public DateTime DateCreated { get; set; }

        public bool IsRead { get; set; }
    }
}
