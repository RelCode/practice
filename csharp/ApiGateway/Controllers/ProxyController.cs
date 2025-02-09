using Microsoft.AspNetCore.Mvc;
using ApiGateway.Models;

namespace ApiGateway.Controllers
{
    [ApiController]
    [Route("api/proxy")]
    public class ProxyController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public ProxyController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpGet("api/tech")]
        public async Task<ActionResult<TechNews>> GetTechNews()
        {
            var response = await _httpClient.GetAsync("http://localhost:3001/api/tech");
            var content = await response.Content.ReadAsStringAsync();
            return Ok(content);
        }
    }
}
