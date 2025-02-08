using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Net.Http.Json;
using System.Linq;
using System.Threading.Tasks;

namespace ApiGateway.Controllers
{
    [ApiController]
    [Route("api/proxy")]
    public class ProxyController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public ProxyController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpGet("fetch-data")]
        public async Task<IActionResult> GetData()
        {
            var response = await _httpClient.GetAsync("https://jsonplaceholder.typicode.com/posts");
            var data = response.Content.ReadFromJsonAsync<object>();
            return Ok(data);
        }
    }
}
