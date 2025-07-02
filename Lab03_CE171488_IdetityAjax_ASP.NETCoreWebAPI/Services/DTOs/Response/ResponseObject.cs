using System.Net;

namespace Services.DTOs.Response
{
    public class ResponseObject
    {
        public HttpStatusCode Status { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
    }
}
