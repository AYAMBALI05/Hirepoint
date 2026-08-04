using HirePoint.Data;
using HirePoint.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HirePoint.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        // Database context used to access HirePoint tables
        private readonly ApplicationDbContext _context;

        public NotificationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Notifications
        // Retrieves all notifications together with the related user
        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            var notifications = await _context.Notifications
                .Include(n => n.User)
                .ToListAsync();

            return Ok(notifications);
        }

        // GET: api/Notifications/{id}
        // Retrieves a specific notification
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNotificationById(Guid id)
        {
            var notification = await _context.Notifications
                .Include(n => n.User)
                .FirstOrDefaultAsync(n => n.NotificationID == id);

            if (notification == null)
            {
                return NotFound("Notification not found.");
            }

            return Ok(notification);
        }

        // POST: api/Notifications
        // Creates a new notification
        [HttpPost]
        public async Task<IActionResult> CreateNotification(Notification notification)
        {
            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetNotificationById),
                new { id = notification.NotificationID },
                notification);
        }

        // PUT: api/Notifications/{id}
        // Marks a notification as read
        [HttpPut("{id}")]
        public async Task<IActionResult> MarkNotificationAsRead(Guid id)
        {
            var notification = await _context.Notifications.FindAsync(id);

            if (notification == null)
            {
                return NotFound("Notification not found.");
            }

            notification.IsRead = true;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Notifications/{id}
        // Permanently removes a notification
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(Guid id)
        {
            var notification = await _context.Notifications.FindAsync(id);

            if (notification == null)
            {
                return NotFound("Notification not found.");
            }

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Notifications/User/{userId}
        // Retrieves all notifications belonging to a specific user
        [HttpGet("User/{userId}")]
        public async Task<IActionResult> GetNotificationsByUser(Guid userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserID == userId) //Where the ID matches the one passed in the URL
                .OrderByDescending(n => n.DateCreated) //from newest to oldest
                .ToListAsync();

            return Ok(notifications);
        }

        // GET: api/Notifications/User/{userId}/Unread
        // Retrieves only unread notifications for a specific user
        [HttpGet("User/{userId}/Unread")]
        public async Task<IActionResult> GetUnreadNotifications(Guid userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserID == userId && !n.IsRead)
                .OrderByDescending(n => n.DateCreated)
                .ToListAsync();

            return Ok(notifications);
        }
    }
}
