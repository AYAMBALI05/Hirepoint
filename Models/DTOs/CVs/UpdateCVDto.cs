using System.ComponentModel.DataAnnotations;

namespace HirePoint.Models.DTOs.CVs
{
    public class UpdateCVDto
    {

        [Required]
        public IFormFile CVFile { get; set; } = null!;

        /*
         IFormFile is an ASP.NET Core type that represents a file uploaded by the client.
         When a user uploads a file through the "Choose file" option they will then click apply to submit their application. 
        The application will receive the file as an IFormFile.
        The CVFile property will contain the uploaded file.
        The property will contain things like File Name, Content Type, Length, etc.
        We can access these things like, CVFile.FileName
         */
    }
}
