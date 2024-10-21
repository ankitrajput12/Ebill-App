using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EvalApp1
{
    public class City
    {
        public int CityId { get; set; }
        public string CityName { get; set; }
        public decimal TaxRate { get; set; }

        // Navigation Property: One City has many Consumers
        public ICollection<Consumer> Consumers { get; set; }
    }

}
