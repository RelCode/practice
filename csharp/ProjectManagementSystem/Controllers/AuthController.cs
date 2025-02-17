using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ProjectManagementSystem.Models;

namespace ProjectManagementSystem.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;

        public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            var user = new ApplicationUser { FirstName = model.FirstName, LastName = model.LastName, UserName = model.Email, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
                return BadRequest(new { message = "Error", errors = result.Errors });

            return Ok(new { success = true });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return Unauthorized(new { message = "Invalid User Details" });
            var res = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (!res.Succeeded)
            {
                return Unauthorized(new { message = "Invalid User Details"});
            }

            var token = GenerateJwtToken(user);
            return Ok(new { token = token, userId = user.Id, userName = $"{user.FirstName} {user.LastName}" });
        }

        private string GenerateJwtToken(ApplicationUser user)
        {
            var secret = _configuration.GetValue<string>("JwtAuth:Key");
            if (secret == null)
                throw new ApplicationException("Secret not found");
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));    
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);    
    

            //claim is used to add identity to JWT token
            var claims = new[] {    
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),    
                new Claim(JwtRegisteredClaimNames.Email, user.Email),    
                new Claim("Date", DateTime.Now.ToString("yyyy-MM-dd")),    
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())    
            };    
            

            var token = new JwtSecurityToken(_configuration.GetValue<string>("JwtAuth:Issuer"),    
                _configuration.GetValue<string>("JwtAuth:Issuer"),    
                claims,    
                expires: DateTime.Now.AddMinutes(120),    
                signingCredentials: credentials);    
    
            return new JwtSecurityTokenHandler().WriteToken(token);  
        }
    }
}
