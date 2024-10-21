using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EvalApp1
{
    public class MeterType
    {
        public int MeterTypeId { get; set; }
        public string MeterTypeName { get; set; } // Residential, Commercial

        // Navigation Property: One MeterType has many Consumers
        public ICollection<Consumer> Consumers { get; set; }

        // Navigation Property: One MeterType has many Rates
        public ICollection<Rate> Rates { get; set; }
    }
}
