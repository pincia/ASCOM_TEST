using ASCOM_TEST.DM;
using ASCOM_TEST.Services;
using log4net;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace ASCOM_TEST.Controllers
{
    public class UserController : Controller
    {
        private static readonly ILog Log = LogManager.GetLogger(typeof(UserController));
        private IData _dataservice;

        public UserController(IData dataservice)
        {
            _dataservice = dataservice;
        }

        [Route("Login"), HttpPost]
        public async Task<ActionResult<LoginResponseDTO>> Login([FromBody] LoginRequestDTO request)
        {
            Log.Debug($"[Login] Login start username:{request.Username} password: {request.Password}" );
            try
            {
                ActionResult response;

                if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
                { 
                    return BadRequest();
                    Log.Debug($"Empty username or password");
                }
               
                var token = _dataservice.Login(request.Username, request.Password);

               if (!string.IsNullOrEmpty(token))
                {
                    response = Ok(new LoginResponseDTO() { Token = token });
                    Log.Debug($"[Login] Login OK");
                }
                else
                {
                    response = Unauthorized();
                    Log.Debug($"[Login] Unauthorized");
                }

                Log.Debug($"[Login] Login end");
                return response;
            }
            catch (Exception ex)
            {
                Log.ErrorFormat($"Login error {ex.Message}");
                throw;
            }
        }
    }
}
