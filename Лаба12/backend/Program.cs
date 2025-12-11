using Backend.Models;
using Backend.Repositories;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;


var builder = WebApplication.CreateBuilder(args);

// builder.Services.AddSingleton<ICommentRepository, CommentRepository>();
builder.Services.AddScoped<CommentService>();
builder.Services.AddScoped<ICommentRepository>(provider =>
    new CommentRepository("Host=localhost;Port=5432;Database=Comments;Username=postgres;Password=postgres"));

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

app.MapGet("/comments", ([FromServices] CommentService service) => service.GetAll());
app.MapGet("/comments/{id}", ([FromServices] CommentService service, int id) =>
    service.GetById(id) is { } comment ? Results.Ok(comment) : Results.NotFound());

app.MapPost("/comments", ([FromServices] CommentService service, [FromBody] Comment comment) =>
{
    var createdComment = service.Add(comment);
    return Results.Created($"/comments/{createdComment.Id}", createdComment);
});

app.MapPatch("/comments/{id}", ([FromServices] CommentService service, int id, [FromBody] Comment comment) =>
    service.Update(id, comment) is { } updated
        ? Results.Ok(updated)
        : Results.NotFound());

app.MapDelete("/comments/{id}", ([FromServices] CommentService service, int id) =>
    service.Delete(id) ? Results.NoContent() : Results.NotFound());

app.Run();