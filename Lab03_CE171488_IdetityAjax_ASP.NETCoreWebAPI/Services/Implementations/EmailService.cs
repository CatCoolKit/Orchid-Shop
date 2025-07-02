using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using Services.DTOs;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Implementations
{
    public class EmailService : IEmailService
    {
        private readonly SmtpSettings _smtpSettings;
        private String emailSendFrom = "nam022831@gmail.com";

        public EmailService(IOptions<SmtpSettings> smtpSettings)
        {
            _smtpSettings = smtpSettings.Value;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string message)
        {
            var emailMessage = new MimeMessage();

            emailMessage.From.Add(new MailboxAddress(_smtpSettings.SenderName, emailSendFrom));

            emailMessage.To.Add(new MailboxAddress("", toEmail));
            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart("html") { Text = message };

            using (var client = new SmtpClient())
            {
                try
                {
                    await client.ConnectAsync(_smtpSettings.Server, _smtpSettings.Port, MailKit.Security.SecureSocketOptions.StartTls);

                    await client.AuthenticateAsync(_smtpSettings.Username, _smtpSettings.Password);
                    await client.SendAsync(emailMessage);
                }
                catch (System.Exception ex)
                {
                    Console.WriteLine($"Lỗi gửi email đến {toEmail}: {ex.Message}");
                    throw new System.Exception("Không thể gửi email. Lỗi: " + ex.Message);
                }
                finally
                {
                    await client.DisconnectAsync(true);
                }
            }
        }
    }
}
