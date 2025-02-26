using Microsoft.AspNetCore.Mvc;
using RestSharp;
using AiNewsSummarizer.Models;

[ApiController]
[Route("api/summarize")]

public class SummarizeController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<SummarizeController> _logger;

    public SummarizeController(IConfiguration config, ILogger<SummarizeController> logger)
    {
        _configuration = config;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> SummarizeNews([FromBody] NewsRequest newsRequest)
    {
        string apiKey = _configuration["Api_Keys:OPENAI_KEY"];
        if (string.IsNullOrEmpty(apiKey))
        {
            _logger.LogError("API Key is missing");
            return BadRequest("API Key is missing");
        }

        var client = new RestClient("https://api.openai.com");
        var requestObj = new RestRequest("/v1/chat/completions",Method.Post)
            .AddHeader("Content-Type", "application/json")
            .AddHeader("Accept", "application/json")
            .AddHeader("Authorization", $"Bearer {apiKey}")
            .AddJsonBody(new
            {
                model = "gpt-4",
                messages = new[] { new { role = "user", content = $"Summarize: {newsRequest.text}" } }
             });

        var response = await client.ExecuteAsync(requestObj);
        if (response.IsSuccessful && response.Content != null)
        {
            return Ok(response.Content);
        }
        return NoContent();
    }
}