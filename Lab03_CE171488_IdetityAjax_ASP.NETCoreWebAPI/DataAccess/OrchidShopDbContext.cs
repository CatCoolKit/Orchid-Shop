using BusinessObjects.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;

namespace DataAccess;

public partial class OrchidShopDbContext : DbContext
{
    public OrchidShopDbContext()
    {
    }

    public OrchidShopDbContext(DbContextOptions<OrchidShopDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Account> Accounts { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Orchid> Orchids { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderDetail> OrderDetails { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
       => optionsBuilder.UseSqlServer(GetConnectionString());

    private string GetConnectionString()
    {
        IConfiguration config = new ConfigurationBuilder()
             .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json", true, true)
                    .Build();
        var strConn = config["ConnectionStrings:DefaultConnectionStringDB"];

        return strConn;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.AccountId).HasName("PK__accounts__46A222CD146D402C");

            entity.ToTable("accounts");

            entity.HasIndex(e => e.Email, "UQ__accounts__AB6E6164BC0BA93F").IsUnique();

            entity.Property(e => e.AccountId).HasColumnName("account_id");
            entity.Property(e => e.AccountName)
                .HasMaxLength(100)
                .HasColumnName("account_name");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .HasColumnName("password");
            entity.Property(e => e.RoleId).HasColumnName("role_id");

            entity.HasOne(d => d.Role).WithMany(p => p.Accounts)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_accounts_roles");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__categori__D54EE9B4E4158300");

            entity.ToTable("categories");

            entity.HasIndex(e => e.CategoryName, "UQ__categori__5189E25590EBAFF6").IsUnique();

            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.CategoryName)
                .HasMaxLength(100)
                .HasColumnName("category_name");
        });

        modelBuilder.Entity<Orchid>(entity =>
        {
            entity.HasKey(e => e.OrchidId).HasName("PK__orchids__2ADAF3616A6E5CA0");

            entity.ToTable("orchids");

            entity.HasIndex(e => e.OrchidName, "UQ__orchids__3B7DDBFC25684F30").IsUnique();

            entity.Property(e => e.OrchidId).HasColumnName("orchid_id");
            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.IsNatural).HasColumnName("is_natural");
            entity.Property(e => e.OrchidDescription).HasColumnName("orchid_description");
            entity.Property(e => e.OrchidName)
                .HasMaxLength(200)
                .HasColumnName("orchid_name");
            entity.Property(e => e.OrchidUrl)
                .HasMaxLength(500)
                .HasColumnName("orchid_url");
            entity.Property(e => e.Price)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("price");

            entity.HasOne(d => d.Category).WithMany(p => p.Orchids)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_orchids_categories");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__orders__3213E83FDE1B3D85");

            entity.ToTable("orders");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AccountId).HasColumnName("account_id");
            entity.Property(e => e.OrderDate)
                .HasColumnType("datetime")
                .HasColumnName("order_date");
            entity.Property(e => e.OrderStatus)
                .HasMaxLength(50)
                .HasDefaultValue("Pending")
                .HasColumnName("order_status");
            entity.Property(e => e.TotalAmount)
                .HasColumnType("decimal(12, 2)")
                .HasColumnName("total_amount");

            entity.HasOne(d => d.Account).WithMany(p => p.Orders)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_orders_accounts");
        });

        modelBuilder.Entity<OrderDetail>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__order_de__3213E83FADC017E4");

            entity.ToTable("order_details");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.OrchidId).HasColumnName("orchid_id");
            entity.Property(e => e.OrderId).HasColumnName("order_id");
            entity.Property(e => e.Price)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("price");
            entity.Property(e => e.Quantity).HasColumnName("quantity");

            entity.HasOne(d => d.Orchid).WithMany(p => p.OrderDetails)
                .HasForeignKey(d => d.OrchidId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_order_details_orchids");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderDetails)
                .HasForeignKey(d => d.OrderId)
                .HasConstraintName("fk_order_details_orders");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__roles__760965CC678B099C");

            entity.ToTable("roles");

            entity.HasIndex(e => e.RoleName, "UQ__roles__783254B1221575E8").IsUnique();

            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.RoleName)
                .HasMaxLength(50)
                .HasColumnName("role_name");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
