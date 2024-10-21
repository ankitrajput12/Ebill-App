using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EvalApp1
{
    public class Invoice
    {
        public int InvoiceId { get; set; }
        public int ConsumerId { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public decimal UnitsConsumed { get; set; }
        public decimal Amount { get; set; }
        public DateTime DueDate { get; set; }

        // Navigation Property: Many Invoices belong to one Consumer
        public Consumer Consumer { get; set; }
    }
}
