using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleShopper
{
    public class Startup
    {
        public static void Run()
        {
            bool isAuth = false;
            ManageUsers mu = new ManageUsers();
            while (!isAuth) { 
                Console.Write("Enter your email: ");
                string? email = Console.ReadLine();
                if(email.Equals(string.Empty) || !Utils.IsEmailValid(email))
                {
                    Console.WriteLine("Provide a Valid Email to Login!");
                    continue;
                }
                do
                {
                    Console.Write("Enter your password: ");
                    string? password = Console.ReadLine();
                    if (password.Equals(string.Empty))
                    {
                        Console.WriteLine("Provide a Valid Password to Login!");
                        continue;
                    }
                    //isAuth = mu.Authenticate(email, password);
                    if (!isAuth)
                    {
                        Console.WriteLine("Invalid Credentials! Try Again");
                    }
                } while (!isAuth);
            }
            Console.WriteLine("Welcome to Console Shopper");
        }
    }
}
