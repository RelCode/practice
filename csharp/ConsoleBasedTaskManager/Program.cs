namespace ConsoleBasedTaskManager
{
    internal class Program
    {
        static List<Task> tasks = new List<Task>();
        static void Main(string[] args)
        {
            bool exitApp = false;
            do
            {
                AppMenu();
                Console.ReadLine();
            } while (!exitApp);
        }

        static void AppMenu()
        {
            Console.WriteLine("============================= MAIN MENU =================================");
            Console.WriteLine("1. Add Task");
            Console.WriteLine("2. List Tasks");
            Console.WriteLine("3. Exit");
        }
    }
}
