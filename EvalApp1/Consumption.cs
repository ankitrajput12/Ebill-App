using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EvalApp1
{
    public class Consumption
    {
        public int ConsumptionId { get; set; }
        public int ConsumerId { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public decimal UnitsConsumed { get; set; }

        // Navigation Property: Many Consumptions belong to one Consumer
        public Consumer Consumer { get; set; }
    }
}
