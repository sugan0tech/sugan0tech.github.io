---
layout: post
title: Spring Boot - From Zero to Production
date: 2025-02-03
tags: [java, spring-boot, backend, microservices, devops]
---

<div class="message">
  A comprehensive guide to building production-ready applications with Spring Boot, focusing on best practices and real-world challenges.
</div>

Spring Boot has revolutionized Java application development by simplifying the bootstrap and development process. In this post, I'll cover the journey from initial setup to production deployment, highlighting key practices I've implemented across multiple projects.

## Why Spring Boot?

Spring Boot eliminates much of the boilerplate configuration required in traditional Spring applications:

* **Opinionated defaults**: Works out of the box with sensible configurations
* **Standalone**: Run as a self-contained application with embedded servers
* **Production-ready**: Built-in metrics, health checks, and externalized configuration
* **No code generation**: No XML configuration required

## Setting Up a Spring Boot Project

The quickest way to bootstrap a Spring Boot application is using Spring Initializr:

{% highlight bash %}
curl https://start.spring.io/starter.tgz \
  -d dependencies=web,data-jpa,postgresql,actuator,validation \
  -d type=gradle-project \
  -d bootVersion=3.2.0 \
  -d groupId=com.example \
  -d artifactId=demo-service \
  -d packageName=com.example.demo \
  -d javaVersion=17 | tar -xzvf -
{% endhighlight %}

## Core Application Components

### Application Configuration

Spring Boot's externalized configuration is powerful for managing different environments:

{% highlight java %}
@Configuration
@ConfigurationProperties(prefix = "app")
public class ApplicationProperties {
    private String apiKey;
    private int cacheTimeToLiveSeconds;
    private Retry retry = new Retry();
    
    // Getters and setters

    public static class Retry {
        private int maxAttempts = 3;
        private long backoffMillis = 1000;
        
        // Getters and setters
    }
}
{% endhighlight %}

In `application.yml`:

{% highlight yaml %}
app:
  api-key: ${API_KEY:default-key}
  cache-time-to-live-seconds: 300
  retry:
    max-attempts: 5
    backoff-millis: 2000

spring:
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:dev}
  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:app}
    username: ${DB_USER:postgres}
    password: ${DB_PASSWORD:postgres}
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        jdbc:
          batch_size: 50
  cache:
    type: caffeine
    caffeine:
      spec: maximumSize=500,expireAfterAccess=600s

management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus
  endpoint:
    health:
      show-details: when_authorized
{% endhighlight %}

### Entity and Repository Layer

For domain entities and repositories, I prefer a clean, focused approach:

{% highlight java %}
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private BigDecimal price;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductCategory category;
    
    @Column(length = 2000)
    private String description;
    
    @CreatedDate
    private Instant createdAt;
    
    @LastModifiedDate
    private Instant updatedAt;
    
    // Getters, setters, equals, hashCode, toString
}

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryOrderByName(ProductCategory category);
    
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :min AND :max")
    Page<Product> findByPriceRange(
        @Param("min") BigDecimal min, 
        @Param("max") BigDecimal max, 
        Pageable pageable);
}
{% endhighlight %}

### Service Layer

The service layer implements business logic and transaction boundaries:

{% highlight java %}
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ApplicationProperties appProperties;
    
    @Cacheable("products")
    public List<ProductDTO> getProductsByCategory(ProductCategory category) {
        return productRepository.findByCategoryOrderByName(category).stream()
            .map(productMapper::toDto)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public ProductDTO createProduct(CreateProductRequest request) {
        Product product = productMapper.toEntity(request);
        Product saved = productRepository.save(product);
        return productMapper.toDto(saved);
    }
    
    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public void updateProductPrice(Long id, BigDecimal newPrice) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
            
        product.setPrice(newPrice);
        productRepository.save(product);
    }
}
{% endhighlight %}

### Controller Layer

Controllers should be thin, delegating business logic to services:

{% highlight java %}
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    
    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getProducts(
            @RequestParam(required = false) ProductCategory category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Page<ProductDTO> products;
        if (category != null) {
            products = productService.getProductsByCategory(category, PageRequest.of(page, size));
        } else {
            products = productService.getAllProducts(PageRequest.of(page, size));
        }
        
        return ResponseEntity.ok(products);
    }
    
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(
            @Valid @RequestBody CreateProductRequest request) {
        ProductDTO created = productService.createProduct(request);
        URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(created.getId())
            .toUri();
            
        return ResponseEntity.created(location).body(created);
    }
    
    @PutMapping("/{id}/price")
    public ResponseEntity<Void> updatePrice(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePriceRequest request) {
        productService.updateProductPrice(id, request.getPrice());
        return ResponseEntity.noContent().build();
    }
}
{% endhighlight %}

## Production-Ready Features

### Exception Handling

A global exception handler provides consistent API responses:

{% highlight java %}
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException ex) {
        ApiError error = new ApiError(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage()));
            
        ApiError apiError = new ApiError(
            HttpStatus.BAD_REQUEST.value(),
            "Validation error",
            errors,
            LocalDateTime.now()
        );
        
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleAllExceptions(Exception ex) {
        ApiError error = new ApiError(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "An unexpected error occurred",
            LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
{% endhighlight %}

### Request Logging

For debugging and audit purposes, request logging is essential:

{% highlight java %}
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestLoggingFilter implements Filter {
    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);
    
    @Override
    public void doFilter(
            ServletRequest request, 
            ServletResponse response, 
            FilterChain chain) throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        String requestId = UUID.randomUUID().toString();
        MDC.put("requestId", requestId);
        
        log.info("Request: {} {} [{}]", 
            httpRequest.getMethod(), 
            httpRequest.getRequestURI(),
            httpRequest.getRemoteAddr());
            
        long startTime = System.currentTimeMillis();
        try {
            chain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            log.info("Response: {} {} ({}ms)", 
                httpResponse.getStatus(),
                httpRequest.getRequestURI(),
                duration);
            MDC.remove("requestId");
        }
    }
}
{% endhighlight %}

### Actuator Endpoints

Spring Boot Actuator provides production-ready features:

{% highlight java %}
@Component
public class CustomHealthIndicator implements HealthIndicator {
    private final ExternalServiceClient client;
    
    public CustomHealthIndicator(ExternalServiceClient client) {
        this.client = client;
    }
    
    @Override
    public Health health() {
        try {
            boolean isAvailable = client.isServiceAvailable();
            if (isAvailable) {
                return Health.up()
                    .withDetail("externalService", "available")
                    .build();
            } else {
                return Health.down()
                    .withDetail("externalService", "unavailable")
                    .build();
            }
        } catch (Exception e) {
            return Health.down(e).build();
        }
    }
}
{% endhighlight %}

### Database Migration

Flyway or Liquibase manage database schema changes:

{% highlight sql %}
-- V1__create_products_table.sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(19, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description VARCHAR(2000),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category);
{% endhighlight %}

## Testing Strategies

### Unit Testing

{% highlight java %}
@ExtendWith(MockitoExtension.class)
class ProductServiceTest {
    @Mock
    private ProductRepository productRepository;
    
    @Mock
    private ProductMapper productMapper;
    
    @InjectMocks
    private ProductService productService;
    
    @Test
    void createProduct_ShouldSaveAndReturnMappedDTO() {
        // Arrange
        CreateProductRequest request = new CreateProductRequest(
            "Test Product", 
            BigDecimal.valueOf(99.99), 
            ProductCategory.ELECTRONICS, 
            "Test description"
        );
        
        Product product = new Product();
        product.setName("Test Product");
        product.setPrice(BigDecimal.valueOf(99.99));
        
        Product savedProduct = new Product();
        savedProduct.setId(1L);
        savedProduct.setName("Test Product");
        savedProduct.setPrice(BigDecimal.valueOf(99.99));
        
        ProductDTO expectedDto = new ProductDTO(
            1L, 
            "Test Product", 
            BigDecimal.valueOf(99.99), 
            ProductCategory.ELECTRONICS, 
            "Test description"
        );
        
        when(productMapper.toEntity(request)).thenReturn(product);
        when(productRepository.save(product)).thenReturn(savedProduct);
        when(productMapper.toDto(savedProduct)).thenReturn(expectedDto);
        
        // Act
        ProductDTO result = productService.createProduct(request);
        
        // Assert
        assertEquals(expectedDto, result);
        verify(productRepository).save(product);
        verify(productMapper).toEntity(request);
        verify(productMapper).toDto(savedProduct);
    }
}
{% endhighlight %}

### Integration Testing

{% highlight java %}
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.yml")
@ActiveProfiles("test")
class ProductControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @MockBean
    private ProductService productService;
    
    @Test
    void createProduct_ShouldReturnCreatedProduct() throws Exception {
        // Arrange
        CreateProductRequest request = new CreateProductRequest(
            "New Product", 
            BigDecimal.valueOf(29.99), 
            ProductCategory.BOOKS, 
            "New book"
        );
        
        ProductDTO createdDto = new ProductDTO(
            1L, 
            "New Product", 
            BigDecimal.valueOf(29.99), 
            ProductCategory.BOOKS, 
            "New book"
        );
        
        when(productService.createProduct(any())).thenReturn(createdDto);
        
        // Act & Assert
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.name").value("New Product"))
            .andExpect(jsonPath("$.price").value(29.99));
    }
}
{% endhighlight %}

## Containerization and Deployment

### Dockerfile

{% highlight dockerfile %}
FROM eclipse-temurin:17-jre-alpine as builder
WORKDIR /app
COPY build/libs/*.jar app.jar
RUN java -Djarmode=layertools -jar app.jar extract

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
ENV JAVA_OPTS="-Xms512m -Xmx1024m"

COPY --from=builder /app/dependencies/ ./
COPY --from=builder /app/spring-boot-loader/ ./
COPY --from=builder /app/snapshot-dependencies/ ./
COPY --from=builder /app/application/ ./

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -q --spider http://localhost:8080/actuator/health || exit 1

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS org.springframework.boot.loader.JarLauncher"]
{% endhighlight %}

### Application Performance Monitoring

For production monitoring, Spring Boot works seamlessly with APM tools like Datadog, New Relic, or Prometheus/Grafana.

## Lessons Learned

After working with Spring Boot across various projects, here are key observations:

1. **Minimize boilerplate**: Use Lombok, Spring Data projections, and MapStruct for cleaner code
2. **Embrace reactive programming**: Consider WebFlux for high-throughput, low-latency requirements
3. **Don't overuse annotations**: They can hide complexity and make debugging harder
4. **Design for failure**: Circuit breakers, retry policies, and graceful degradation are essential
5. **Profile and optimize early**: Use Spring Boot's metrics to identify bottlenecks

## Conclusion

Spring Boot provides an excellent foundation for building modern Java applications. By following the practices outlined in this post, you can create robust, maintainable, and production-ready services.

In future posts, I'll dive deeper into specific Spring Boot topics such as security, reactive programming, and event-driven architectures.

What Spring Boot features or best practices have you found most valuable? Share your experiences in the comments.
