using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleShopper
{
    public enum Role
    {
        Admin,
        Cashier,
        Customer
    }
    public class User
    {
        private string? fullName;
        private string? email;
        private string? password;
        private string? role;
    }


    public class ManageUsers
    {
        
    }
}
