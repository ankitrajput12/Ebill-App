using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EvalApp1
{
    public class Consumer
    {
        public int ConsumerId { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }

        // Foreign Keys
        public int CityId { get; set; }
        public int MeterTypeId { get; set; }

        // Navigation Properties
        public City City { get; set; }
        public MeterType MeterType { get; set; }

        // One Consumer has many Consumptions
        public ICollection<Consumption> Consumptions { get; set; }

        // One Consumer has many Invoices
        public ICollection<Invoice> Invoices { get; set; }
    }
}
