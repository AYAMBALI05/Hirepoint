using Microsoft.AspNetCore.Identity;

namespace HirePoint.Services
{
    public class PasswordService
    {
        //Using ASP.NET Core's built-in password hasher rather than creating our own encryption system.

        // Used to securely hash passwords
        private readonly PasswordHasher<string> _passwordHasher;

        public PasswordService()
        {
            _passwordHasher = new PasswordHasher<string>();
        }

        // Converts the user's password into a secure hashed password
        public string HashPassword(string password)
        {
            return _passwordHasher.HashPassword(null, password);
        }

        // Checks whether the entered password matches the stored password
        public bool VerifyPassword(string password, string hashedPassword)
        {
            var result = _passwordHasher.VerifyHashedPassword(
                null,
                hashedPassword,
                password);

            return result == PasswordVerificationResult.Success;
        }

        //Password property will contain the hashed password, not the user's original password.
    }

}
