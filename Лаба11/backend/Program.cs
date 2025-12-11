using Backend;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<ICommentRepository, CommentRepository>();
builder.Services.AddScoped<CommentService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

app.UseCors("ReactApp");
app.UseCors("ReactFrontend");

app.MapGet("/comments", (CommentService service) => service.GetAll());
app.MapGet("/comments/{id}", (CommentService service, int id) =>
    service.GetById(id) is { } comment ? Results.Ok(comment) : Results.NotFound());

app.MapPost("/comments", (CommentService service, Comment comment) =>
{
    var createdComment = service.Add(comment);
    return Results.Created($"/comments/{createdComment.Id}", createdComment);
});

app.MapPatch("/comments/{id}", (CommentService service, int id, Comment comment) =>
    service.Update(id, comment) is { } updated
        ? Results.Ok(updated)
        : Results.NotFound());

app.MapDelete("/comments/{id}", (CommentService service, int id) =>
    service.Delete(id) ? Results.NoContent() : Results.NotFound());

app.Run();