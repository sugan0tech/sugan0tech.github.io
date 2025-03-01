---
layout: post
title: Building a Clean Architecture API with ASP.NET Core
date: 2025-01-18
tags: [asp.net-core, clean-architecture, lifeflow, api-design, c#]
---

<div class="message">
  A detailed walkthrough of implementing Clean Architecture principles in an ASP.NET Core API, based on my experiences building the LifeFlow project.
</div>

When designing modern backend systems, architectural choices significantly impact maintainability, testability, and scalability. In this post, I'll share how I implemented a Clean Architecture approach in the LifeFlow project using ASP.NET Core.

## Why Clean Architecture for ASP.NET Core?

Clean Architecture, popularized by Robert C. Martin, emphasizes separation of concerns through well-defined layers:

> The overriding rule that makes this architecture work is The Dependency Rule: source code dependencies can only point inwards.

This approach brings several benefits to ASP.NET Core applications:

* **Framework independence**: Core business logic doesn't depend on ASP.NET or any external framework
* **Testability**: Business rules can be tested without UI, database, or any external element
* **UI independence**: The UI can change without changing the rest of the system
* **Database independence**: Business rules aren't bound to a specific database

## LifeFlow Project Structure

For the LifeFlow project, I structured the solution as follows:

{% highlight csharp %}
LifeFlow.Domain        // Entities, value objects, domain events
LifeFlow.Application   // Use cases, interfaces, DTOs
LifeFlow.Infrastructure// Data access, external services 
LifeFlow.API           // Controllers, middleware, DI setup
{% endhighlight %}

### Domain Layer

The domain layer contains business entities with behavior and business rules:

{% highlight csharp %}
// Domain entity with behavior
public class HealthRecord
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public DateTime Timestamp { get; private set; }
    public BloodPressure BloodPressure { get; private set; }
    public int HeartRate { get; private set; }
    
    // Domain behavior
    public void UpdateVitals(BloodPressure newBP, int newHeartRate)
    {
        if (newHeartRate <= 0)
            throw new DomainException("Heart rate must be positive");
            
        BloodPressure = newBP;
        HeartRate = newHeartRate;
    }
    
    // Factory method
    public static HealthRecord Create(Guid userId, BloodPressure bp, int heartRate)
    {
        // Validate and create
        return new HealthRecord
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Timestamp = DateTime.UtcNow,
            BloodPressure = bp,
            HeartRate = heartRate
        };
    }
}
{% endhighlight %}

Notice that domain entities:
- Encapsulate state with private setters
- Validate their invariants
- Don't depend on any infrastructure concerns

### Application Layer

The application layer defines use cases using the CQRS pattern with MediatR:

{% highlight csharp %}
// Query
public class GetUserHealthRecordsQuery : IRequest<List<HealthRecordDto>>
{
    public Guid UserId { get; set; }
}

// Query Handler
public class GetUserHealthRecordsHandler 
    : IRequestHandler<GetUserHealthRecordsQuery, List<HealthRecordDto>>
{
    private readonly IHealthRecordRepository _repository;
    private readonly IMapper _mapper;
    
    public GetUserHealthRecordsHandler(
        IHealthRecordRepository repository, 
        IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }
    
    public async Task<List<HealthRecordDto>> Handle(
        GetUserHealthRecordsQuery request, 
        CancellationToken cancellationToken)
    {
        var records = await _repository.GetByUserIdAsync(
            request.UserId, cancellationToken);
            
        return _mapper.Map<List<HealthRecordDto>>(records);
    }
}
{% endhighlight %}

For LifeFlow, this CQRS approach:
- Separates read and write operations
- Makes queries more efficient (read models)
- Improves scalability (separate read/write services)

### Infrastructure Layer

The infrastructure layer implements the interfaces defined in the application layer:

{% highlight csharp %}
public class EntityFrameworkHealthRecordRepository : IHealthRecordRepository
{
    private readonly AppDbContext _context;
    
    public EntityFrameworkHealthRecordRepository(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<List<HealthRecord>> GetByUserIdAsync(
        Guid userId, 
        CancellationToken cancellationToken)
    {
        return await _context.HealthRecords
            .Where(hr => hr.UserId == userId)
            .OrderByDescending(hr => hr.Timestamp)
            .ToListAsync(cancellationToken);
    }
    
    // Other repository methods...
}
{% endhighlight %}

### API Layer

Finally, the API layer is kept thin and focused on HTTP concerns:

{% highlight csharp %}
[ApiController]
[Route("api/[controller]")]
public class HealthRecordsController : ControllerBase
{
    private readonly IMediator _mediator;
    
    public HealthRecordsController(IMediator mediator)
    {
        _mediator = mediator;
    }
    
    [HttpGet("user/{userId}")]
    [Authorize]
    public async Task<ActionResult<List<HealthRecordDto>>> GetUserRecords(
        Guid userId)
    {
        // Authorization check
        if (User.GetUserId() != userId.ToString() && 
            !User.IsInRole("Admin"))
        {
            return Forbid();
        }
        
        var query = new GetUserHealthRecordsQuery { UserId = userId };
        var result = await _mediator.Send(query);
        
        return Ok(result);
    }
    
    // Other endpoints...
}
{% endhighlight %}

## Key Technical Decisions

1. **MediatR**: For implementing CQRS pattern to separate queries from commands
2. **FluentValidation**: For request validation before hitting handlers
3. **AutoMapper**: For mapping between domain entities and DTOs
4. **Entity Framework Core**: With repository pattern for data access
5. **Custom Middleware**: For consistent exception handling and response formatting

## Cross-Cutting Concerns

### Request Validation Pipeline

For LifeFlow, I implemented a validation pipeline using MediatR behaviors:

{% highlight csharp %}
public class ValidationBehavior<TRequest, TResponse> 
    : IPipelineBehavior<TRequest, TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;
    
    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }
    
    public async Task<TResponse> Handle(
        TRequest request, 
        RequestHandlerDelegate<TResponse> next, 
        CancellationToken cancellationToken)
    {
        if (_validators.Any())
        {
            var context = new ValidationContext<TRequest>(request);
            
            var validationResults = await Task.WhenAll(
                _validators.Select(v => 
                    v.ValidateAsync(context, cancellationToken)));
                    
            var failures = validationResults
                .SelectMany(r => r.Errors)
                .Where(f => f != null)
                .ToList();
                
            if (failures.Count != 0)
                throw new ValidationException(failures);
        }
        
        return await next();
    }
}
{% endhighlight %}

### Performance Monitoring

To monitor API performance, I integrated Application Insights:

{% highlight csharp %}
public void ConfigureServices(IServiceCollection services)
{
    // Add Application Insights telemetry
    services.AddApplicationInsightsTelemetry();
    
    // Configure adaptive sampling
    services.ConfigureTelemetryModule<DependencyTrackingTelemetryModule>(
        (module, o) => { module.EnableSqlCommandTextInstrumentation = true; });
        
    // Rest of configuration...
}
{% endhighlight %}

## Lessons Learned

After implementing this architecture in the LifeFlow project, I've learned:

1. **Start simple**: Don't over-engineer early; add complexity as needed
2. **Test business logic first**: Focus tests on domain and application layers
3. **Use vertical slices**: Organize by feature, not by layer, for better developer experience
4. **Embrace domain events**: For decoupling services and implementing eventual consistency
5. **Consider read models**: Separate read models can greatly improve query performance

## Conclusion

Clean Architecture with ASP.NET Core has provided a solid foundation for the LifeFlow project. The clear separation of concerns allows the system to evolve with changing requirements while maintaining quality and testability.

In future posts, I'll dive deeper into specific aspects like domain events, CQRS optimizations, and performance tuning for ASP.NET Core APIs.

What's your experience with Clean Architecture in .NET projects? Share your thoughts in the comments.
