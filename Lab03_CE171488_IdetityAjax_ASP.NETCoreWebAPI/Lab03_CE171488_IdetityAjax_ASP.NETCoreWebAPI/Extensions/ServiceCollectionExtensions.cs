using DataAccess;
using Repositories.Implementations;
using Repositories.Interfaces;
using Services.DTOs;
using Services.Implementations;
using Services.Interfaces;

namespace Lab03_CE171488_IdetityAjax_ASP.NETCoreWebAPI.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddOptions<SmtpSettings>()
                    .Configure<IConfiguration>((settings, configuration) =>
                    {
                        configuration.GetSection("SmtpSettings").Bind(settings);
                    });

            services.AddScoped<IEmailService, EmailService>();

            services.AddScoped<AccountDAO>();
            services.AddScoped<CategoryDAO>(); 
            services.AddScoped<OrchidDAO>();
            services.AddScoped<OrderDAO>();
            services.AddScoped<OrderDetailDAO>();
            services.AddScoped<RoleDAO>();

            // 1. Đăng ký Repositories
            services.AddScoped<IOrchidRepository, OrchidRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IOrderRepository, OrderRepository>();
            services.AddScoped<IOrderDetailRepository, OrderDetailRepository>();
            services.AddScoped<IRoleRepository, RoleRepository>();
            services.AddScoped<IAccountRepository, AccountRepository>();
            services.AddScoped<IManageJwt, ManageJwt>(); 


            // 2. Đăng ký Services (sử dụng lambda để truyền các dependency vào constructor)
            // OrderService
            services.AddScoped<IOrderService, OrderService>(provider =>
                new OrderService(
                    provider.GetRequiredService<IOrderRepository>(),
                    provider.GetRequiredService<IOrchidRepository>(),
                    provider.GetRequiredService<IEmailService>(),
                    provider.GetRequiredService<IAccountRepository>()
                )
            );

            // OrchidService
            services.AddScoped<IOrchidService, OrchidService>(provider =>
                new OrchidService(
                    provider.GetRequiredService<IOrchidRepository>(),
                    provider.GetRequiredService<IOrderDetailRepository>()
                )
            );

            // CategoryService
            services.AddScoped<ICategoryService, CategoryService>(provider =>
                new CategoryService(
                    provider.GetRequiredService<ICategoryRepository>(),
                    provider.GetRequiredService<IOrchidRepository>()
                )
            );

            // AuthService
            services.AddScoped<IAuthService, AuthService>(provider =>
                new AuthService(
                    provider.GetRequiredService<IAccountRepository>(),
                    provider.GetRequiredService<IRoleRepository>(),
                    provider.GetRequiredService<IEmailService>()
                )
            );

            // AccountService
            services.AddScoped<IAccountService, AccountService>(provider =>
                new AccountService(
                    provider.GetRequiredService<IAccountRepository>(),
                    provider.GetRequiredService<IOrderRepository>(),
                    provider.GetRequiredService<IRoleRepository>()
                )
            );

            // RoleService
            services.AddScoped<IRoleService, RoleService>(provider =>
                new RoleService(
                    provider.GetRequiredService<IRoleRepository>(),
                    provider.GetRequiredService<IAccountRepository>() 
                )
            );

            return services;
        }
    }
}
