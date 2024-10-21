using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;
using Microsoft.SqlServer;
using Microsoft.EntityFrameworkCore;

namespace EvalApp1
{
    public class ElectricityDbContext : DbContext
    {
        public DbSet<City> Cities { get; set; }
        public DbSet<MeterType> MeterTypes { get; set; }
        public DbSet<Consumer> Consumers { get; set; }
        public DbSet<Rate> Rates { get; set; }
        public DbSet<Consumption> Consumptions { get; set; }
        public DbSet<Invoice> Invoices { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<City>()
                .HasMany(c => c.Consumers)
                .WithOne(c => c.City)
                .HasForeignKey(c => c.CityId);

            modelBuilder.Entity<MeterType>()
                .HasMany(m => m.Consumers)
                .WithOne(c => c.MeterType)
                .HasForeignKey(c => c.MeterTypeId);

            modelBuilder.Entity<MeterType>()
                .HasMany(m => m.Rates)
                .WithOne(r => r.MeterType)
                .HasForeignKey(r => r.MeterTypeId);

            modelBuilder.Entity<Consumer>()
                .HasMany(c => c.Consumptions)
                .WithOne(c => c.Consumer)
                .HasForeignKey(c => c.ConsumerId);

            modelBuilder.Entity<Consumer>()
                .HasMany(c => c.Invoices)
                .WithOne(i => i.Consumer)
                .HasForeignKey(i => i.ConsumerId);

            base.OnModelCreating(modelBuilder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=ANKIT_RAJPUT\SQLEXPRESS;Database=ElectricityDB;Integrated Security=True;TrustServerCertificate=True;") ;
        }
    }

}
