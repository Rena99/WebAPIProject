using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BrixAPIPractice
{
    public class Patient
    {
        public int ID { get; set; }
        public Path[] Paths { get; set; }
        public Patient(int length)
        {
            Paths=new Path[length];
        }
    }
}
