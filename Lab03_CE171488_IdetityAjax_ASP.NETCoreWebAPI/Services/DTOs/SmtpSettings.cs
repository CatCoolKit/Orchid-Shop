using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.DTOs
{
    public class SmtpSettings
    {
        public string Server { get; set; } = null!;
        public int Port { get; set; }
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public bool EnableSsl { get; set; }
        public string SenderName { get; set; } = null!;
    }
}
