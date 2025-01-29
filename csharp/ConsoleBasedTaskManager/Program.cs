namespace ConsoleBasedTaskManager
{
    internal class Program
    {
        static void Main(string[] args)
        {
            List<string> tasks = new List<string>();
            bool exitApp = false;
            do
            {
                AppMenu();
                string? input = Console.ReadLine();
                if (String.IsNullOrEmpty(input) || !int.TryParse(input, out int choice) || (choice < 1 || choice > 3))
                {
                    Console.Clear();
                    Console.WriteLine("Invalid input. Please try again.");
                    continue;
                }

                switch (choice)
                {
                    case 1:
                        Console.Clear();
                        string task = AddTask();
                        if (!String.IsNullOrEmpty(task))
                        {
                            tasks.Add(task);
                        }
                        break;
                    case 2:
                        Console.Clear();
                        if (tasks.Count > 0)
                        {
                            foreach (string t in tasks)
                            {
                                Console.WriteLine(":: " + t);
                            }
                        }
                        else
                        {
                            Console.WriteLine("No Tasks Found!");
                        }
                        break;
                    case 3:
                        Console.Clear();
                        exitApp = true;
                        break;
                }
            } while (!exitApp);
        }

        static void AppMenu()
        {
            Console.WriteLine("============================= MAIN MENU =================================");
            Console.WriteLine("1. Add Task");
            Console.WriteLine("2. List Tasks");
            Console.WriteLine("3. Exit");
            Console.Write("Select an option: ");
        }

        static string AddTask()
        {
            Console.Write("Enter Task Name (or Press Enter to Cancel): ");
            string? taskName = Console.ReadLine();
            if (String.IsNullOrEmpty(taskName))
            {
                Console.Clear();
                Console.WriteLine("Task creation cancelled.");
                return "";
            }
            return taskName;
        }
    }
}
