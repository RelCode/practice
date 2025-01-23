using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleShopper
{
    public static class Utils
    {
        public static void ClearScreen()
        {
            Console.Clear();
        }

        public static bool IsEmailValid(string email)
        {
            //return char.IsLetter(email[0]) && email.Contains("@") && email.Contains(".") && char.IsLetter(email[email.Length - 1]);
        }
    }
}
