using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EvalApp1
{
    public class Rate
    {
        public int RateId { get; set; }
        public int MeterTypeId { get; set; }
        public decimal TierStart { get; set; }
        public decimal TierEnd { get; set; }
        public decimal RatePerUnit { get; set; }

        // Navigation Property: Many Rates belong to one MeterType
        public MeterType MeterType { get; set; }
    }
}
