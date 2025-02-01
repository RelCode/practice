namespace SimpleBookStore_DotNetCoreWebAPI.Models
{
    public class Rating
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public string Reviewer { get; set; }
        public int Rate { get; set; }
        public string Comment { get; set; }
        public DateTime DateRated { get; set; }
    }
}
