using Microsoft.AspNetCore.Mvc.Filters;

namespace Joki.WebApi.Filtros
{
    public class Token : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var headers = context.HttpContext.Request.Headers;
            var token = headers["Token"].ToString();

            if (headers.ContainsKey("Authorization"))
            {
                var token1 = headers["Authorization"].ToString();
                Console.WriteLine("Token recibido: " + token1);
            }
        }
    }
}
