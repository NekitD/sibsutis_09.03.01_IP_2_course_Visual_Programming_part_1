public class ReviewRequest
{
    public int      Id           { get; set; }
    public int      ArticleId    { get; set; }
    public int      ReviewerId   { get; set; }
    public DateTime? DueDate     { get; set; }
    public string   ExpectedTime { get; set; }
    public int?     Pages        { get; set; }

    // статусы: New, Accepted, Declined, Submitted
    public string   Status       { get; set; } = "New";
    public DateTime CreatedAt    { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt   { get; set; }

    // Навигационные свойства
    public virtual Article Article     { get; set; }    // сюда EF подхватит статью
    public virtual User    Reviewer    { get; set; }    // и ревьюера, если нужно
}