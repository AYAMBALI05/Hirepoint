namespace HirePoint.Models.DTOs.Notifications
{
    public class NotificationDto
    {
        public Guid NotificationID { get; set; }

        public Guid UserID { get; set; }

        // Instead of returning the entire User entity,
        // return the user's name.
        public string? UserName { get; set; }

        public string Message { get; set; }

        public DateTime DateCreated { get; set; }

        public bool IsRead { get; set; }
    }
}
