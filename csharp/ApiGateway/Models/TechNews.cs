namespace ApiGateway.Models
{
    public class TechNews
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Summary { get; set; }
        public DateTime Published_At { get; set; }
        public string Source { get; set; }
        public string Url { get; set; }
    }
}
