using ArticleReviewSystem.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


var builder = WebApplication.CreateBuilder(args);


builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddAntiforgery();
builder.Services.AddIdentity<User, IdentityRole<int>>(opts =>
    {

    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();


builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(o => o.AddPolicy("AllowAll",
    p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

var app = builder.Build();


app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();


static string GenerateJwtToken(User user, IConfiguration cfg)
{
    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email,          user.Email),
        new Claim(ClaimTypes.Role,           user.Role)
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(cfg["Jwt:Key"]));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    var days = Convert.ToDouble(cfg["Jwt:ExpireDays"]);
    var token = new JwtSecurityToken(
        issuer: cfg["Jwt:Issuer"],
        audience: cfg["Jwt:Issuer"],
        claims: claims,
        expires: DateTime.UtcNow.AddDays(days),
        signingCredentials: creds
    );
    return new JwtSecurityTokenHandler().WriteToken(token);
}


var auth = app.MapGroup("/api/auth");


auth.MapPost("register", async (
        RegisterDto dto,
        UserManager<User> userManager) =>
{
    var user = new User
    {
        UserName = dto.Email,
        Email = dto.Email,
        FirstName = dto.FirstName,
        LastName = dto.LastName,
        Role = dto.Role,
        Bio = dto.Bio,
        Location = dto.Location,
        Institution = dto.Institution,
        SocialLinks = dto.SocialLinks,
        Specialization = dto.Specialization
    };

    var result = await userManager.CreateAsync(user, dto.Password);
    if (!result.Succeeded)
        return Results.BadRequest(result.Errors);

    return Results.Ok(new { Message = "User registered successfully" });
});

auth.MapPost("login", async (
        LoginDto dto,
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        IConfiguration cfg) =>
{
    var user = await userManager.FindByEmailAsync(dto.Email);
    if (user == null)
        return Results.Unauthorized();

    var chk = await signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
    if (!chk.Succeeded)
        return Results.Unauthorized();

    var token = GenerateJwtToken(user, cfg);
    return Results.Ok(new { Token = token, User = new { user.Id, user.Email, user.Role } });
});

auth.MapGet("profile", async (
        HttpContext http,
        UserManager<User> userManager) =>
{
    var uid = http.User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrEmpty(uid))
        return Results.Unauthorized();

    var user = await userManager.FindByIdAsync(uid);
    if (user == null)
        return Results.NotFound();

    var dto = new ProfileDto
    {
        FirstName = user.FirstName,
        LastName = user.LastName,
        Email = user.Email,
        Role = user.Role,
        Specialization = user.Specialization,
        Institution = user.Institution,
        Bio = user.Bio,
        Location = user.Location,
        SocialLinks = user.SocialLinks
    };
    return Results.Ok(dto);
})
.RequireAuthorization();

auth.MapPut("profile", async (
        UpdateProfileDto dto,
        HttpContext http,
        UserManager<User> userManager) =>
{
    var uid = http.User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrEmpty(uid))
        return Results.Unauthorized();

    var user = await userManager.FindByIdAsync(uid);
    if (user == null)
        return Results.NotFound();

    user.FirstName = dto.FirstName ?? user.FirstName;
    user.LastName = dto.LastName ?? user.LastName;
    user.Bio = dto.Bio ?? user.Bio;
    user.Location = dto.Location ?? user.Location;
    user.Institution = dto.Institution ?? user.Institution;
    user.Specialization = dto.Specialization ?? user.Specialization;
    user.SocialLinks = dto.SocialLinks ?? user.SocialLinks;

    var res = await userManager.UpdateAsync(user);
    if (!res.Succeeded)
        return Results.BadRequest(res.Errors);

    return Results.Ok(new { Message = "Profile updated successfully" });
})
.RequireAuthorization();

var admin = app.MapGroup("/api/admin")
    .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });

admin.MapGet("users", async (UserManager<User> userManager) =>
{
    var list = await userManager.Users.ToListAsync();
    return Results.Ok(list);
});

admin.MapPost("users", async (
    AdminCreateUserDto dto,
    UserManager<User> userManager) =>
{
    var user = new User
    {
        UserName = dto.Email,
        Email = dto.Email,
        FirstName = dto.FirstName,
        LastName = dto.LastName,
        Role = dto.Role,
        Specialization = dto.Specialization,
        Institution = dto.Institution,
        Bio = dto.Bio,
        Location = dto.Location,
        SocialLinks = dto.SocialLinks
    };

    var cr = await userManager.CreateAsync(user, dto.Password);
    if (!cr.Succeeded)
        return Results.BadRequest(cr.Errors);
    return Results.Ok(user);
});

admin.MapDelete("users/{id:int}", async (
        int id,
        AppDbContext db) =>
{
    var u = await db.Users.FindAsync(id);
    if (u == null)
        return Results.NotFound(new { error = "User not found." });

    db.Users.Remove(u);
    await db.SaveChangesAsync();
    return Results.Ok(new { message = "User deleted successfully." });
});

admin.MapPut("users/{id:int}/block", async (
        int id,
        UserManager<User> userManager) =>
{
    var u = await userManager.FindByIdAsync(id.ToString());
    if (u == null)
        return Results.NotFound();

    u.Status = "Blocked";
    await userManager.UpdateAsync(u);
    return Results.Ok(u);
});

admin.MapDelete("reviews/{id:int}", async (
        int id,
        AppDbContext db) =>
{
    var r = await db.Reviews.FindAsync(id);
    if (r == null)
        return Results.NotFound(new { error = "Review not found." });

    var art = await db.Articles.FindAsync(r.ArticleId);
    if (art != null)
    {
        art.Status = "Pending";
        db.Articles.Update(art);
    }

    db.Reviews.Remove(r);
    await db.SaveChangesAsync();
    return Results.Ok(new { message = "Review deleted successfully." });
});

admin.MapGet("articles", async (AppDbContext db) =>
{
    var a = await db.Articles.ToListAsync();
    return Results.Ok(a);
});

admin.MapPost("reviewrequests", async (
    AdminReviewRequestDto dto,
    AppDbContext db) =>
{
    var req = new ReviewRequest
    {
        ArticleId = dto.ArticleId,
        ReviewerId = dto.ReviewerId
                       ?? throw new ArgumentNullException(nameof(dto.ReviewerId)),
        DueDate = dto.DueDate?.ToUniversalTime(),
        ExpectedTime = dto.ExpectedTime,
        Pages = dto.Pages,
        Status = "New",
        CreatedAt = DateTime.UtcNow
    };

    db.ReviewRequests.Add(req);
    await db.SaveChangesAsync();
    return Results.Ok(req);
});

admin.MapGet("reviews/completed", async (AppDbContext db) =>
{
    var list = await db.Reviews
        .Select(r => new
        {
            r.Id,
            r.ArticleId,
            r.ReviewerId,
            r.Rating,
            r.Recommendation,
            r.TechnicalMerit,
            r.Originality,
            r.PresentationQuality,
            r.CommentsToAuthors,
            r.ConfidentialComments,
            r.Status,
            r.CreatedAt
        })
        .ToListAsync();
    return Results.Ok(list);
});

admin.MapDelete("article/{id:int}", async (
        int id,
        AppDbContext db) =>
{
    var a = await db.Articles.FindAsync(id);
    if (a == null)
        return Results.NotFound(new { error = "Article not found." });

    db.Articles.Remove(a);
    await db.SaveChangesAsync();
    return Results.Ok(new { message = "Article deleted successfully." });
});

var reviewer = app.MapGroup("/api/reviewrequests")
    .RequireAuthorization(new AuthorizeAttribute { Roles = "Reviewer" });


reviewer.MapGet("my", async (
        HttpContext http,
        AppDbContext db) =>
{
    var uid = http.User.FindFirstValue(ClaimTypes.NameIdentifier);
    int reviewerId = int.Parse(uid);

    var inv = await db.ReviewRequests
        .Where(r => r.Status == "New")
        .Include(r => r.Article)
        .Select(r => new
        {
            r.Id,
            r.ArticleId,
            ArticleTitle = r.Article.Title,
            r.DueDate,
            r.ExpectedTime,
            r.Pages
        })
        .ToListAsync();

    return Results.Ok(inv);
});


reviewer.MapGet("accepted", async (
        HttpContext http,
        AppDbContext db) =>
{
    var uid = http.User.FindFirstValue(ClaimTypes.NameIdentifier);
    int reviewerId = int.Parse(uid);

    var list = await db.ReviewRequests
        .Where(r => r.ReviewerId == reviewerId && r.Status == "Accepted")
        .Include(r => r.Article)
        .Select(r => new
        {
            r.Id,
            r.ArticleId,
            ArticleTitle = r.Article.Title,
            r.DueDate,
            r.ExpectedTime,
            r.Pages
        })
        .ToListAsync();

    return Results.Ok(list);
});


var arts = app.MapGroup("/api/articles")
    .RequireAuthorization();


arts.MapGet("my", async (
        HttpContext http,
        AppDbContext db) =>
{
    var uid = http.User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (!int.TryParse(uid, out var id))
        return Results.BadRequest();

    var list = await db.Articles.Where(a => a.AuthorId == id).ToListAsync();
    return Results.Ok(list);
});

arts.MapGet("{id:int}", async (
        int id,
        AppDbContext db) =>
{
    var a = await db.Articles
        .Include(x => x.Author)
        .FirstOrDefaultAsync(x => x.Id == id);
    if (a == null)
        return Results.NotFound();
    return Results.Ok(a);
});

arts.MapPost("",
        async (
            HttpContext http,
            [FromForm] ArticleDto dto,
            AppDbContext db
        ) =>
        {
            if (dto.File == null || dto.File.Length == 0)
                return Results.BadRequest(new { error = "No file uploaded." });

            var uploadFolder = Path.Combine("wwwroot", "articles");
            Directory.CreateDirectory(uploadFolder);

            var fileName = Guid.NewGuid() + Path.GetExtension(dto.File.FileName);
            var filePath = Path.Combine(uploadFolder, fileName);

            await using var fs = new FileStream(filePath, FileMode.Create);
            await dto.File.CopyToAsync(fs);

            var uid = http.User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            int authorId = int.Parse(uid);

            var art = new Article
            {
                Title = dto.Title,
                Category = dto.Category,
                Tags = dto.Tags,
                Status = "Draft",
                AuthorId = authorId,
                FilePath = filePath
            };

            db.Articles.Add(art);
            await db.SaveChangesAsync();

            var reviewRequest = new ReviewRequest
            {
                ArticleId = art.Id,
                ReviewerId = 2,
                DueDate = DateTime.UtcNow.AddDays(7),
                ExpectedTime = "1 week",
                Pages = 1,
                Status = "New"
            };

            db.ReviewRequests.Add(reviewRequest);
            await db.SaveChangesAsync();

            var dtob
                = new
                {
                    art.Id,
                    art.Title,
                    art.Category,
                    art.Tags,
                    art.Status,
                    art.AuthorId,
                    art.FilePath
                };
            return Results.Created($"/api/articles/{art.Id}", dtob);
        })
    .DisableAntiforgery()
    .Accepts<ArticleDto>("multipart/form-data")
    .Produces(StatusCodes.Status201Created)
    .Produces(StatusCodes.Status400BadRequest);

arts.MapPut("{id:int}/submit", async (
        int id,
        HttpContext http,
        AppDbContext db) =>
{
    var uid = http.User.FindFirstValue(ClaimTypes.NameIdentifier);
    int authorId = int.Parse(uid);

    var art = await db.Articles.FirstOrDefaultAsync(a => a.Id == id && a.AuthorId == authorId);
    if (art == null)
        return Results.NotFound();

    art.Status = "Pending";
    art.SubmittedDate = DateTime.UtcNow;
    db.Articles.Update(art);
    await db.SaveChangesAsync();
    return Results.Ok(art);
});

arts.MapDelete("{id:int}", async (
        int id,
        HttpContext http,
        AppDbContext db) =>
{
    var uid = http.User.FindFirstValue(ClaimTypes.NameIdentifier);
    int authorId = int.Parse(uid);

    var art = await db.Articles.FirstOrDefaultAsync(a => a.Id == id && a.AuthorId == authorId);
    if (art == null)
        return Results.NotFound();

    db.Articles.Remove(art);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

arts.MapGet("{id:int}/download", async (
        int id,
        AppDbContext db) =>
{
    var art = await db.Articles.FindAsync(id);
    if (art == null || !File.Exists(art.FilePath))
        return Results.NotFound(new { error = "Article not found or file missing." });

    var stream = new FileStream(art.FilePath, FileMode.Open, FileAccess.Read);
    return Results.File(stream, "application/pdf", Path.GetFileName(art.FilePath));
});

var rr = app.MapGroup("/api/reviewrequests")
    .RequireAuthorization(new AuthorizeAttribute { Roles = "Reviewer,Admin" });

rr.MapGet("new", async (AppDbContext db) =>
{
    var list = await db.Articles
        .Where(a => a.Status == "Pending" || a.Status == "Draft")
        .Select(a => new
        {
            a.Id,
            a.Title,
            a.Category,
            a.SubmittedDate,
            a.AuthorId
        })
        .ToListAsync();
    return Results.Ok(list);
});

rr.MapGet("pending-articles", async (AppDbContext db) =>
{
    var list = await db.Articles
        .Where(a => a.Status == "Pending" || a.Status == "Draft")
        .Select(a => new
        {
            a.Id,
            a.Title,
            a.Category,
            a.SubmittedDate,
            a.AuthorId
        })
        .ToListAsync();
    return Results.Ok(list);
});

rr.MapGet("inprogress", async (AppDbContext db) =>
{
    var list = await db.Articles
        .Where(a => a.Status == "Accepted")
        .Select(a => new
        {
            a.Id,
            a.Title,
            a.Category,
            a.SubmittedDate,
            a.AuthorId
        })
        .ToListAsync();
    return Results.Ok(list);
});
rr.MapPut("{id:int}/accept", async (
    int id,
    HttpContext http,
    AppDbContext db) =>
{
    var uid = http.User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (uid is null)
        return Results.Unauthorized();
    int reviewerId = int.Parse(uid);

    var req = await db.ReviewRequests.FindAsync(id);
    if (req == null)
        return Results.NotFound(new { error = "Review request not found." });

    if (req.Status != "New")
        return Results.BadRequest(new { error = "Request is not in New state." });

    req.ReviewerId = reviewerId;
    req.Status = "Accepted";
    req.UpdatedAt = DateTime.UtcNow;

    await db.SaveChangesAsync();

    return Results.Ok(new { message = "Invitation accepted." });
});

rr.MapPut("{id:int}/decline", async (
    int id,
    HttpContext http,
    AppDbContext db) =>
{
    var uid = http.User.FindFirstValue(ClaimTypes.NameIdentifier);
    int reviewerId = int.Parse(uid);

    var req = await db.ReviewRequests.FindAsync(id);
    if (req == null)
        return Results.NotFound();

    if (req.Status != "New")
        return Results.BadRequest(new { error = "Request is not in New state." });

    req.Status = "Declined";
    req.UpdatedAt = DateTime.UtcNow;
    db.ReviewRequests.Update(req);
    await db.SaveChangesAsync();

    return Results.Ok(new { message = "Invitation declined." });
});


var rev = app.MapGroup("/api/reviews")
    .RequireAuthorization(new AuthorizeAttribute { Roles = "Author,Reviewer,Admin" });

rev.MapGet("completed", async (
        HttpContext http,
        AppDbContext db) =>
{
    var uid = http.User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (!int.TryParse(uid, out var reviewerId))
        return Results.BadRequest(new { error = "Invalid user ID." });

    var list = await db.Reviews
        .Where(r => r.ReviewerId == reviewerId)
        .Join(db.Articles,
              r => r.ArticleId,
              a => a.Id,
              (r, a) => new { r, a.Title, a.AuthorId })
        .Join(db.Users,
              x => x.AuthorId,
              u => u.Id,
              (x, u) => new CompletedReviewResponseDto
              {
                  Id = x.r.Id,
                  ArticleId = x.r.ArticleId,
                  ArticleTitle = x.Title,
                  AuthorName = u.UserName,
                  Rating = x.r.Rating,
                  Recommendation = x.r.Recommendation,
                  Status = x.r.Status,
                  CreatedAt = x.r.CreatedAt
              })
        .ToListAsync();

    return Results.Ok(list);
});

rev.MapPost("", async (
        ReviewDto dto,
        HttpContext http,
        AppDbContext db) =>
{
    if (dto == null || dto.ArticleId <= 0)
        return Results.BadRequest(new { error = "Invalid request body or ArticleId." });

    var uid = http.User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (!int.TryParse(uid, out var reviewerId))
        return Results.BadRequest(new { error = "Invalid user token." });

    var req = await db.ReviewRequests.FirstOrDefaultAsync(r =>
        r.ArticleId == dto.ArticleId &&
        r.ReviewerId == reviewerId);
    if (req == null)
        return Results.NotFound(new { error = "Review request not found." });
    if (req.Status != "Accepted")
        return Results.BadRequest(new { error = "ReviewRequest is not in an accepted state." });

    var review = new Review
    {
        ArticleId = dto.ArticleId,
        ReviewerId = reviewerId,
        Rating = dto.Rating,
        Recommendation = dto.Recommendation,
        TechnicalMerit = dto.TechnicalMerit,
        Originality = dto.Originality,
        PresentationQuality = dto.PresentationQuality,
        CommentsToAuthors = dto.CommentsToAuthors,
        ConfidentialComments = dto.ConfidentialComments,
        Status = "Accepted",
        CreatedAt = DateTime.UtcNow
    };
    db.Reviews.Add(review);

    req.Status = "Submitted";
    req.UpdatedAt = DateTime.UtcNow;

    await db.SaveChangesAsync();

    var resp = new ReviewResponseDto
    {
        Id = review.Id,
        ArticleId = review.ArticleId,
        ReviewerId = review.ReviewerId,
        Rating = review.Rating,
        Recommendation = review.Recommendation,
        TechnicalMerit = review.TechnicalMerit,
        Originality = review.Originality,
        PresentationQuality = review.PresentationQuality,
        CommentsToAuthors = review.CommentsToAuthors,
        ConfidentialComments = review.ConfidentialComments,
        Status = review.Status,
        CreatedAt = review.CreatedAt
    };
    return Results.Created($"/api/reviews/{review.Id}", resp);
});

rev.MapPut("{id:int}/submit", async (
        int id,
        AppDbContext db) =>
{
    var r = await db.Reviews.FindAsync(id);
    if (r == null)
        return Results.NotFound();

    r.Status = "Submitted";
    r.SubmittedAt = DateTime.UtcNow;
    db.Reviews.Update(r);
    await db.SaveChangesAsync();

    var a = await db.Articles.FindAsync(r.ArticleId);
    if (a != null)
    {
        a.Status = r.Recommendation switch
        {
            "Accept" => "Accepted",
            "AcceptWithMinorRevisions" => "NeedsRevision",
            "AcceptWithMajorRevisions" => "NeedsRevision",
            "Reject" => "Rejected",
            _ => a.Status
        };
        db.Articles.Update(a);
        await db.SaveChangesAsync();
    }

    return Results.Ok(r);
});

rev.MapGet("{id:int}", async (
        int id,
        AppDbContext db) =>
{
    var rr = await db.Reviews
        .Include(r => r.Article)
        .FirstOrDefaultAsync(r => r.ArticleId == id);

    if (rr == null)
        return Results.NotFound(new { error = "Review not found." });

    var dto = new ReviewResponseDto
    {
        Id = rr.Id,
        ArticleId = rr.ArticleId,
        ReviewerId = rr.ReviewerId,
        Rating = rr.Rating,
        Recommendation = rr.Recommendation,
        TechnicalMerit = rr.TechnicalMerit,
        Originality = rr.Originality,
        PresentationQuality = rr.PresentationQuality,
        CommentsToAuthors = rr.CommentsToAuthors,
        ConfidentialComments = rr.ConfidentialComments,
        Status = rr.Status,
        CreatedAt = rr.CreatedAt
    };
    return Results.Ok(dto);
});

app.Run();




public class RegisterDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string Role { get; set; }
    public string Specialization { get; set; }
    public string Institution { get; set; }
    public string Bio { get; set; }
    public string Location { get; set; }
    public string SocialLinks { get; set; }
}

public class LoginDto
{
    public string Email { get; set; }
    public string Password { get; set; }
}

public class AdminCreateUserDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string Role { get; set; }
    public string Specialization { get; set; }
    public string Institution { get; set; }
    public string Bio { get; set; }
    public string Location { get; set; }
    public string SocialLinks { get; set; }
}

public class AdminReviewRequestDto
{
    public int ArticleId { get; set; }
    public int? ReviewerId { get; set; }
    public DateTime? DueDate { get; set; }
    public string ExpectedTime { get; set; }
    public int? Pages { get; set; }
}

public class ArticleDto
{
    public string Title { get; set; }
    public string Category { get; set; }
    public List<string> Tags { get; set; }
    public IFormFile File { get; set; }
}

public class ReviewDto
{
    public int ArticleId { get; set; }
    public int? Rating { get; set; }
    public string Recommendation { get; set; } = "";
    public string TechnicalMerit { get; set; } = "";
    public string Originality { get; set; } = "";
    public string PresentationQuality { get; set; } = "";
    public string CommentsToAuthors { get; set; } = "";
    public string ConfidentialComments { get; set; } = "";
}

public class ReviewResponseDto
{
    public int Id { get; set; }
    public int ArticleId { get; set; }
    public int ReviewerId { get; set; }
    public int? Rating { get; set; }
    public string Recommendation { get; set; }
    public string TechnicalMerit { get; set; }
    public string Originality { get; set; }
    public string PresentationQuality { get; set; }
    public string CommentsToAuthors { get; set; }
    public string ConfidentialComments { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; }
}
public class CompletedReviewResponseDto
{
    public int Id { get; set; }
    public int ArticleId { get; set; }
    public string ArticleTitle { get; set; }
    public string AuthorName { get; set; }
    public int? Rating { get; set; }
    public string Recommendation { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; }
}