using Application.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class StorageController : BaseApiController
    {
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromForm] IFormFile file)
        {
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);

            var result = await Mediator.Send(
                new Create.Command { FileName = file.FileName, Content = memoryStream.ToArray() }
            );
            return HandleResult(result);
        }

        [HttpDelete("{imageId}")]
        [Authorize]
        public async Task<IActionResult> Delete(Guid imageId)
        {
            var result = await Mediator.Send(new Delete.Command { Id = imageId });
            return HandleResult(result);
        }
    }
}
