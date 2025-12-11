using Backend.Models;
using Npgsql;
using System.Data;

namespace Backend.Repositories;
public class CommentRepository : ICommentRepository
{
    // private readonly Dictionary<int, Comment> _comments = new();
    private string _initString;
    public CommentRepository(string p_initString)
    {
        _initString = p_initString;
        InitializeDatabase();
    }

    private void InitializeDatabase()
    {
        using var connection = new NpgsqlConnection(_initString);
        connection.Open();

        var createTableSql = @"
            CREATE TABLE IF NOT EXISTS comments (
                Id SERIAL PRIMARY KEY,
                PostId INTEGER NOT NULL,
                Name VARCHAR(255) NOT NULL,
                Email VARCHAR(255) NOT NULL,
                Body TEXT NOT NULL
            )";

        using var command = new NpgsqlCommand(createTableSql, connection);
        command.ExecuteNonQuery();
    }
    // private int _nextId = 1;

    // public IEnumerable<Comment> GetAll() => _comments.Values;
    public IEnumerable<Comment> GetAll()
    {
        var comments = new List<Comment>();

        using (var connection = new NpgsqlConnection(_initString))
        {
            connection.Open();
            var sqlAllSelection = "SELECT * FROM comments";
            using var command = new NpgsqlCommand(sqlAllSelection, connection);
            using var reader = command.ExecuteReader();

            while (reader.Read())
            {
                comments.Add(new Comment
                {
                    Id = reader.GetInt32("Id"),
                    PostId = reader.GetInt32("PostId"),
                    Name = reader.GetString("Name"),
                    Email = reader.GetString("Email"),
                    Body = reader.GetString("Body")
                });
            }
        }
        return comments;
    }

    // public Comment? GetById(int id) => _comments.TryGetValue(id, out var comment) ? comment : null;
    public Comment? GetById(int id)
    {
        using var connection = new NpgsqlConnection(_initString);
        connection.Open();
        var sqlSelection = @"SELECT * FROM comments WHERE Id = @id";
        using var command = new NpgsqlCommand(sqlSelection, connection);
        command.Parameters.AddWithValue("@Id", id);
        using var reader = command.ExecuteReader();

        if (reader.Read())
        {
            return new Comment
            {
                Id = reader.GetInt32("Id"),
                PostId = reader.GetInt32("PostId"),
                Name = reader.GetString("Name"),
                Email = reader.GetString("Email"),
                Body = reader.GetString("Body")
            };
        }
        else
        {
            return null;
        }
    }

    // public Comment Add(Comment comment)
    // {
    //     comment.Id = _nextId++;
    //     _comments[comment.Id] = comment;
    //     return comment;
    // }

    public Comment Add(Comment comment)
    {
        using var connection = new NpgsqlConnection(_initString);
        connection.Open();

        var sqlAddition = @"
        INSERT INTO comments (PostId, Name, Email, Body)
        VALUES (@PostId, @Name, @Email, @Body)
        RETURNING Id";

        using var command = new NpgsqlCommand(sqlAddition, connection);
        command.Parameters.AddWithValue("@PostId", comment.PostId);
        command.Parameters.AddWithValue("@Name", comment.Name);
        command.Parameters.AddWithValue("@Email", comment.Email);
        command.Parameters.AddWithValue("@Body", comment.Body);

        var newId = (int)command.ExecuteScalar();
        comment.Id = newId;

        return comment;
    }

    // public Comment? Update(int id, Comment comment)
    // {
    //     if (!_comments.ContainsKey(id)) return null;

    //     comment.Id = id;
    //     _comments[id] = comment;
    //     return comment;
    // }

    public Comment? Update(int id, Comment comment)
    {
        using var connection = new NpgsqlConnection(_initString);
        connection.Open();
        var sqlUpdating = @"
        UPDATE comments
        SET PostId = @PostId,
            Name = @Name,
            Email = @Email,
            Body = @Body
        WHERE Id = @id";
        using var command = new NpgsqlCommand(sqlUpdating, connection);
        command.Parameters.AddWithValue("@Id", id);
        command.Parameters.AddWithValue("@PostId", comment.PostId);
        command.Parameters.AddWithValue("@Name", comment.Name);
        command.Parameters.AddWithValue("@Email", comment.Email);
        command.Parameters.AddWithValue("@Body", comment.Body);

        var rowsAffected = command.ExecuteNonQuery();
        if (rowsAffected == 0) return null;

        comment.Id = id;
        return comment;
    }

    // public bool Delete(int id) => _comments.Remove(id);
    public bool Delete(int id)
    {
        using var connection = new NpgsqlConnection(_initString);
        connection.Open();
        var sqlDeleting = @"DELETE FROM comments WHERE Id = @id";
        using var command = new NpgsqlCommand(sqlDeleting, connection);
        command.Parameters.AddWithValue("@Id", id);

        return command.ExecuteNonQuery() > 0;
    }
}