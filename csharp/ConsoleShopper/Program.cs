namespace ConsoleShopper
{
    internal class Program
    {
        static void Main(string[] args)
        {
            WelcomeMessage(); // Call the WelcomeMessage method
            Thread.Sleep(3000); // Wait for 3 seconds
            Utils.ClearScreen(); // Call the ClearScreen method in Utils.cs
            Startup.Run(); // Call the Run method in Startup.cs
        }

        static void WelcomeMessage()
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("Welcome to Console Shopper");
            Console.ResetColor();
        }
    }
}
