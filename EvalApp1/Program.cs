using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using CsvHelper;

namespace EvalApp1
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            using (var dbContext = new ElectricityDbContext())
            {
                // Ensure database is created
                await dbContext.Database.EnsureCreatedAsync();

                // Populate database with JSON data
                await PopulateDatabaseFromJson(dbContext);

                // Generate invoices for the current month
                await GenerateMonthlyInvoices(dbContext);

                // Generate reports
                await GenerateReports(dbContext);
            }
        }

        private static async Task PopulateDatabaseFromJson(ElectricityDbContext dbContext)
        {
            var cities = LoadJsonFromFile<List<City>>("cities.json");
            var meterTypes = LoadJsonFromFile<List<MeterType>>("meterType.json");
            var rates = LoadJsonFromFile<List<Rate>>("rate.json");
            var consumers = LoadJsonFromFile<List<Consumer>>("consumers.json");
            var consumptions = LoadJsonFromFile<List<Consumption>>("consumption.json");

            dbContext.Cities.AddRange(cities);
            dbContext.MeterTypes.AddRange(meterTypes);
            dbContext.Rates.AddRange(rates);
            dbContext.Consumers.AddRange(consumers);
            dbContext.Consumptions.AddRange(consumptions);

            await dbContext.SaveChangesAsync();
        }

        private static List<T> LoadJsonFromFile<T>(string filePath)
        {
            var json = File.ReadAllText(filePath);
            return JsonConvert.DeserializeObject<List<T>>(json);
        }

        private static async Task GenerateMonthlyInvoices(ElectricityDbContext dbContext)
        {
            var consumers = await dbContext.Consumers
                .Include(c => c.City)
                .Include(c => c.MeterType)
                .ToListAsync();

            var invoices = new List<Invoice>();

            foreach (var consumer in consumers)
            {
                var consumptions = await dbContext.Consumptions
                    .Where(c => c.ConsumerId == consumer.ConsumerId)
                    .ToListAsync();

                foreach (var consumption in consumptions)
                {
                    var rate = await dbContext.Rates
                        .Where(r => r.MeterTypeId == consumer.MeterTypeId &&
                                    consumption.UnitsConsumed >= r.TierStart &&
                                    consumption.UnitsConsumed <= r.TierEnd)
                        .OrderByDescending(r => r.TierStart)
                        .FirstOrDefaultAsync();

                    var amount = rate?.RatePerUnit * consumption.UnitsConsumed ?? 0;
                    var invoice = new Invoice
                    {
                        ConsumerId = consumer.ConsumerId,
                        Month = DateTime.Now.Month,
                        Year = DateTime.Now.Year,
                        UnitsConsumed = consumption.UnitsConsumed,
                        Amount = amount + consumer.City.TaxRate * amount,
                        DueDate = DateTime.Now.AddDays(30)
                    };

                    invoices.Add(invoice);
                }
            }

            await dbContext.Invoices.AddRangeAsync(invoices);
            await dbContext.SaveChangesAsync();

            SaveInvoicesToCsv(invoices);
        }

        private static void SaveInvoicesToCsv(IEnumerable<Invoice> invoices, string fileName = "invoices.csv")
        {
            try
            {
                using (var writer = new StreamWriter(fileName, false, Encoding.UTF8))
                using (var csv = new CsvWriter(writer, new CsvHelper.Configuration.CsvConfiguration(CultureInfo.InvariantCulture)))
                {
                    csv.WriteRecords(invoices);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while writing the CSV file: {ex.Message}");
            }
        }

        private static async Task GenerateReports(ElectricityDbContext dbContext)
        {
            await GenerateLast3MonthsInvoicesReport(dbContext);
            await GenerateCityWiseMonthlyBifurcationReport(dbContext);
            await GenerateTop5ConsumersReport(dbContext);
            await GenerateBottom5ConsumersReport(dbContext);
        }

        private static async Task GenerateLast3MonthsInvoicesReport(ElectricityDbContext dbContext)
        {
            var invoices = await dbContext.Invoices
                .Where(i => i.DueDate >= DateTime.Now.AddMonths(-3))
                .ToListAsync();

            SaveInvoicesToCsv(invoices, "last_3_months_invoices.csv");
        }

        private static async Task GenerateCityWiseMonthlyBifurcationReport(ElectricityDbContext dbContext)
        {
            var invoices = await dbContext.Invoices
                .GroupBy(i => new { i.Month, i.Year, City = i.Consumer.City.CityName, MeterType = i.Consumer.MeterType.MeterTypeName })
                .Select(g => new
                {
                    g.Key.City,
                    g.Key.MeterType,
                    g.Key.Month,
                    g.Key.Year,
                    TotalAmount = g.Sum(i => i.Amount)
                })
                .ToListAsync();

            SaveCityWiseBifurcationToCsv(invoices, "city_wise_monthly_bifurcation.csv");
        }

        private static async Task GenerateTop5ConsumersReport(ElectricityDbContext dbContext)
        {
            var top5Consumers = await dbContext.Invoices
                .GroupBy(i => i.ConsumerId)
                .Select(g => new
                {
                    Consumer = g.Key,
                    TotalConsumption = g.Sum(i => i.UnitsConsumed)
                })
                .OrderByDescending(c => c.TotalConsumption)
                .Take(5)
                .ToListAsync();

            SaveTopBottomConsumersToCsv(top5Consumers, "top_5_consumers.csv");
        }

        private static async Task GenerateBottom5ConsumersReport(ElectricityDbContext dbContext)
        {
            var bottom5Consumers = await dbContext.Invoices
                .GroupBy(i => i.ConsumerId)
                .Select(g => new
                {
                    Consumer = g.Key,
                    TotalConsumption = g.Sum(i => i.UnitsConsumed)
                })
                .OrderBy(c => c.TotalConsumption)
                .Take(5)
                .ToListAsync();

            SaveTopBottomConsumersToCsv(bottom5Consumers, "bottom_5_consumers.csv");
        }

        private static void SaveCityWiseBifurcationToCsv(IEnumerable<object> records, string fileName)
        {
            using (var writer = new StreamWriter(fileName))
            using (var csv = new CsvWriter(writer, new CsvHelper.Configuration.CsvConfiguration(CultureInfo.InvariantCulture)))
            {
                csv.WriteRecords(records);
            }
        }

        private static void SaveTopBottomConsumersToCsv(IEnumerable<object> records, string fileName)
        {
            using (var writer = new StreamWriter(fileName))
            using (var csv = new CsvWriter(writer, new CsvHelper.Configuration.CsvConfiguration(CultureInfo.InvariantCulture)))
            {
                csv.WriteRecords(records);
            }
        }
    }
}
