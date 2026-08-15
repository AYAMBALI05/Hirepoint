using HirePoint.Data;
using HirePoint.Models.DTOs.Notifications;
using HirePoint.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            var userGuid = Guid.Parse(userId);

            var notifications = await _context.Notifications
                .Include(n => n.User)
                .Where(n => n.UserID == userGuid)
                .OrderByDescending(n => n.DateCreated)
                .ToListAsync();

            var notificationDtos = notifications.Select(n => new NotificationDto
            {
                NotificationID = n.NotificationID,

                UserID = n.UserID,

                UserName = n.User == null
                    ? null
                    : $"{n.User.FirstName} {n.User.LastName}",

                Message = n.Message,

                DateCreated = n.DateCreated,

                IsRead = n.IsRead
            }).ToList();

            return Ok(notificationDtos);
        }

        [Authorize]
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

            var userId = User.FindFirstValue(
                ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            if (notification.UserID != Guid.Parse(userId))
            {
                return Forbid();
            }

            var notificationDto = new NotificationDto
            {
                NotificationID = notification.NotificationID,

                UserID = notification.UserID,

                UserName = notification.User == null
                    ? null
                    : $"{notification.User.FirstName} {notification.User.LastName}",

                Message = notification.Message,

                DateCreated = notification.DateCreated,

                IsRead = notification.IsRead
            };

            return Ok(notificationDto);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateNotification(CreateNotificationDto createNotificationDto)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check that the user receiving the notification actually exists.
            var userExists = await _context.Users
                .AnyAsync(u => u.UserID == createNotificationDto.UserID);

            if (!userExists)
            {
                return BadRequest("User does not exist.");
            }

            /* The client does NOT provide NotificationID, DateCreated
                 or IsRead. The server controls these values.*/
            var notification = new Notification
            {
                // Generate a unique ID for the notification.
                NotificationID = Guid.NewGuid(),

                // Store the user who should receive the notification.
                UserID = createNotificationDto.UserID,

                // Store the notification message.
                Message = createNotificationDto.Message,

                // Record when the notification was created.
                DateCreated = DateTime.Now,

                // New notifications are unread by default.
                IsRead = false
            };


            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();

            var createdNotification = await _context.Notifications
                .Include(n => n.User)
                .FirstOrDefaultAsync(
                    n => n.NotificationID == notification.NotificationID);

            var notificationDto = new NotificationDto
            {
                NotificationID = createdNotification!.NotificationID,

                UserID = createdNotification.UserID,

                UserName = createdNotification.User == null
                   ? null
                   : $"{createdNotification.User.FirstName} " +
                     $"{createdNotification.User.LastName}",

                Message = createdNotification.Message,

                DateCreated = createdNotification.DateCreated,

                IsRead = createdNotification.IsRead
            };


            return CreatedAtAction(
                nameof(GetNotificationById),
                new { id = notification.NotificationID },
                notification);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> MarkNotificationAsRead(Guid id)
        {
            var notification = await _context.Notifications
        .FindAsync(id);

            if (notification == null)
            {
                return NotFound("Notification not found.");
            }

            var userId = User.FindFirstValue(
                ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            if (notification.UserID != Guid.Parse(userId))
            {
                return Forbid();
            }

            notification.IsRead = true;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(Guid id)
        {
            var notification = await _context.Notifications
                                            .FindAsync(id);

            if (notification == null)
            {
                return NotFound("Notification not found.");
            }

            var userId = User.FindFirstValue(
                ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            if (notification.UserID != Guid.Parse(userId))
            {
                return Forbid();
            }

            _context.Notifications.Remove(notification);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize]
        // GET: api/Notifications/User/{userId}
        // Retrieves all notifications belonging to a specific user
        [HttpGet("User/{userId}")]
        public async Task<IActionResult> GetNotificationsByUser(Guid userId)
        {
            var loggedInUserId = User.FindFirstValue(
        ClaimTypes.NameIdentifier);

            if (loggedInUserId == null)
            {
                return Unauthorized();
            }

            if (userId != Guid.Parse(loggedInUserId))
            {
                return Forbid();
            }

            var userExists = await _context.Users
                .AnyAsync(u => u.UserID == userId);

            if (!userExists)
            {
                return NotFound("User not found.");
            }

            var notifications = await _context.Notifications
                .Include(n => n.User)
                .Where(n => n.UserID == userId)
                .OrderByDescending(n => n.DateCreated)
                .ToListAsync();

            var notificationDtos = notifications.Select(n => new NotificationDto
            {
                NotificationID = n.NotificationID,

                UserID = n.UserID,

                UserName = n.User == null
                    ? null
                    : $"{n.User.FirstName} {n.User.LastName}",

                Message = n.Message,

                DateCreated = n.DateCreated,

                IsRead = n.IsRead
            }).ToList();

            return Ok(notificationDtos);
        }


        [Authorize]
        // GET: api/Notifications/User/{userId}/Unread
        // Retrieves only unread notifications for a specific user.
        [HttpGet("User/{userId}/Unread")]
        public async Task<IActionResult> GetUnreadNotifications(Guid userId)
        {
            var loggedInUserId = User.FindFirstValue(
        ClaimTypes.NameIdentifier);

            if (loggedInUserId == null)
            {
                return Unauthorized();
            }

            if (userId != Guid.Parse(loggedInUserId))
            {
                return Forbid();
            }

            var userExists = await _context.Users
                .AnyAsync(u => u.UserID == userId);

            if (!userExists)
            {
                return NotFound("User not found.");
            }

            var notifications = await _context.Notifications
                .Include(n => n.User)
                .Where(n => n.UserID == userId && !n.IsRead)
                .OrderByDescending(n => n.DateCreated)
                .ToListAsync();

            var notificationDtos = notifications.Select(n => new NotificationDto
            {
                NotificationID = n.NotificationID,

                UserID = n.UserID,

                UserName = n.User == null
                    ? null
                    : $"{n.User.FirstName} {n.User.LastName}",

                Message = n.Message,

                DateCreated = n.DateCreated,

                IsRead = n.IsRead
            }).ToList();

            return Ok(notificationDtos);
        }

    }
}
