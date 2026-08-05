namespace HirePoint.Models.DTOs.Notifications
{
    public class CreateNotificationDto
    {
        public Guid UserID { get; set; }

        public string Message { get; set; }
    }
}
