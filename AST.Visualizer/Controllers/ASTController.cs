using Microsoft.AspNetCore.Mvc;
using AST.Parsers.Parsers;
using AST.Parsers.Models;

namespace AST.Visualizer.Controllers;

[ApiController]
[Route("[controller]")]
public class ASTController : ControllerBase
{
    private readonly ILogger<ASTController> _logger;
    public ASTController(ILogger<ASTController> logger) => _logger = logger;

    [HttpPost("parse")]
    [DisableRequestSizeLimit]
    public IActionResult Parse()
    {
        try
        {
            return Ok(ParseInternal());
        }
        catch(Exception e)
        {
            _logger.LogError("Failed to parse file", e);
            return BadRequest();
        }
    }

    private Hierarchy ParseInternal()
    {
        IFormFile? formFile = Request.Form.Files.SingleOrDefault();
        string? lang = Request.Form.SingleOrDefault(f => f.Key.ToLowerInvariant() == "language").Value;

        if (formFile is null)
            throw new ArgumentException();

        if (!Enum.TryParse<SupportedLanguages>(lang, out SupportedLanguages languageToParse))
            languageToParse = FindLanguage(formFile.FileName);

        IParser parser = Parser.Create(languageToParse);
        using Stream file = formFile.OpenReadStream();
        return parser.Parse(file);
    }

    private SupportedLanguages FindLanguage(string fileName)
    {
        return Path.GetExtension(fileName) switch
        {
            ".py" => SupportedLanguages.PYTHON,
            ".cs" => SupportedLanguages.CSHARP,
            ".java" => SupportedLanguages.JAVA,
            ".php" => SupportedLanguages.PHP,
            ".sql" => SupportedLanguages.SQL,
            ".vb" => SupportedLanguages.VISUALBASIC,
            _ => throw new ArgumentException()
        };
    }
}
