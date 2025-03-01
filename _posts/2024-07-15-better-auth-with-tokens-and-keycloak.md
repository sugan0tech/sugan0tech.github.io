---
layout: post
title: Modern Authentication - Deep Dive into Token-Based Auth with Keycloak
date: 2025-02-28
tags: [security, authentication, keycloak, jwt, oauth2, oidc]
---

<div class="message">
  A comprehensive exploration of modern authentication systems using access and refresh tokens, with a focus on implementing robust auth flows with Keycloak.
</div>

Authentication is the cornerstone of application security, yet it remains one of the most complex and commonly misunderstood aspects of modern systems. In this post, I'll dive deep into token-based authentication, explore the access/refresh token pattern, and demonstrate how Keycloak simplifies these implementations.

## The Evolution of Authentication

Authentication has evolved significantly over time:

> "Authentication mechanisms reflect the evolving balance between security needs and user experience requirements."

* **Password-based**: Simple but vulnerable to numerous attack vectors
* **Session-based**: Server-side sessions with client cookies
* **Token-based**: Stateless authentication using cryptographically signed tokens
* **Modern token-based**: Combining short-lived access tokens with refresh tokens

## Understanding the JWT Token Architecture

Modern token-based authentication typically uses JSON Web Tokens (JWTs) in two distinct roles:

### Access Tokens

Access tokens are short-lived credentials that:

* Contain encoded user identity and permissions (claims)
* Are cryptographically signed to prevent tampering
* Remain valid for a short period (typically 5-15 minutes)
* Are presented with each API request

An example decoded JWT access token:

{% highlight json %}
{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "sGu0-6lMk..."
}
{% endhighlight %}

Payload:
{% highlight json %}
{
  "exp": 1709136789,
  "iat": 1709136489,
  "jti": "aa5f8315-4e4c-4ae6-9ae1-fc98b9979129",
  "iss": "https://auth.example.com/realms/demo",
  "aud": "account",
  "sub": "8fb4e5a0-3c4d-40ce-b1d5-3f89cacf9d24",
  "typ": "Bearer",
  "azp": "frontend-client",
  "session_state": "e70b1c18-c5ea-47b2-9e11-c6109d413515",
  "acr": "1",
  "allowed-origins": ["https://app.example.com"],
  "realm_access": {
    "roles": ["user", "admin"]
  },
  "resource_access": {
    "account": {
      "roles": ["manage-account"]
    }
  },
  "scope": "profile email",
  "sid": "e70b1c18-c5ea-47b2-9e11-c6109d413515",
  "name": "Jane Doe",
  "preferred_username": "jane.doe",
  "given_name": "Jane",
  "family_name": "Doe",
  "email": "jane.doe@example.com"
}
{% endhighlight %}

### Refresh Tokens

Refresh tokens are longer-lived credentials that:

* Allow obtaining new access tokens without re-authentication
* Are typically valid for days or weeks
* Must be securely stored client-side
* Are invalidated if compromised

## The Authentication Flow

A complete token-based authentication flow works as follows:

1. **Initial Authentication**:
   * User provides credentials
   * Server validates credentials and issues access + refresh tokens
   * Tokens are returned to client

2. **Accessing Protected Resources**:
   * Client includes access token with each request
   * Server validates token signature and claims
   * Server authorizes the request based on token claims

3. **Token Renewal**:
   * When access token expires, client uses refresh token to obtain new tokens
   * If refresh token is valid, new access and refresh tokens are issued
   * If refresh token is expired or invalid, user must re-authenticate

## Security Considerations

Implementing token-based authentication requires addressing several security concerns:

### Token Storage

* **Access tokens**: Can be stored in memory or session storage
* **Refresh tokens**: Should be stored in secure HTTP-only cookies or secure storage
* **Never** store tokens in localStorage due to XSS vulnerabilities

### Token Validation

Backend services must:

1. Verify token signature using the correct public key
2. Validate the token's expiration time
3. Check issuer and audience claims
4. Verify that the token hasn't been revoked (if using token blacklisting)

{% highlight java %}
@Component
public class JwtTokenValidator {
    private final RSAPublicKey publicKey;
    
    public JwtTokenValidator(RSAPublicKey publicKey) {
        this.publicKey = publicKey;
    }
    
    public Jws<Claims> validateToken(String token) {
        try {
            return Jwts.parserBuilder()
                .setSigningKey(publicKey)
                .build()
                .parseClaimsJws(token);
        } catch (JwtException e) {
            throw new InvalidTokenException("Invalid JWT token: " + e.getMessage());
        }
    }
}
{% endhighlight %}

### Token Revocation

Unlike stateless JWT validation, token revocation requires:

* Maintaining a blacklist of revoked tokens
* Checking against this blacklist during validation
* Implementing refresh token rotation for better security

## Introducing Keycloak

Keycloak is an open-source identity and access management solution that implements all the patterns discussed above and provides:

* **Complete OAuth2/OIDC implementation**: Full support for modern authentication protocols
* **Centralized auth management**: Single place to manage users, roles, and permissions
* **Customizable login flows**: Support for MFA, social login, and custom authenticators
* **Token customization**: Ability to add custom claims and control token lifespans
* **Session management**: Tracking and managing user sessions across applications

## Setting Up Keycloak

### Docker Deployment

The quickest way to get started with Keycloak is using Docker:

{% highlight bash %}
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:22.0.0 start-dev
{% endhighlight %}

### Basic Configuration

Once Keycloak is running:

1. Create a new realm (e.g., "app-realm")
2. Create client(s) for your application(s)
3. Configure client settings:
   * Valid redirect URIs
   * Web origins (CORS)
   * Access type (confidential for server-side apps)
   * Scope and token settings

## Implementing Authentication with Keycloak and Spring Boot

### Backend Integration

For a Spring Boot application, integration is straightforward using Spring Security OAuth2:

{% highlight java %}
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeRequests(authorize -> authorize
                .antMatchers("/api/public/**").permitAll()
                .antMatchers("/api/admin/**").hasRole("ADMIN")
                .antMatchers("/api/**").authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .jwtAuthenticationConverter(jwtAuthenticationConverter())
                )
            );
        
        return http.build();
    }
    
    private JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthoritiesClaimName("realm_access.roles");
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");
        
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);
        
        return jwtAuthenticationConverter;
    }
}
{% endhighlight %}

Configure application properties:

{% highlight yaml %}
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8080/realms/app-realm
          jwk-set-uri: http://localhost:8080/realms/app-realm/protocol/openid-connect/certs
{% endhighlight %}

### Frontend Integration

On the frontend, you can use libraries like `keycloak-js`:

{% highlight javascript %}
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://localhost:8080',
    realm: 'app-realm',
    clientId: 'frontend-client'
});

keycloak.init({ 
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    pkceMethod: 'S256'
}).then(authenticated => {
    if (authenticated) {
        initApp(keycloak);
    } else {
        doLogin();
    }
}).catch(error => {
    console.error('Keycloak init failed:', error);
});

// Automatic token refresh
keycloak.onTokenExpired = () => {
    console.log('Token expired, refreshing...');
    keycloak.updateToken(30).catch(() => {
        console.log('Failed to refresh token, logging out...');
        keycloak.logout();
    });
};

// Making authenticated requests
function fetchProtectedResource() {
    fetch('https://api.example.com/protected', {
        headers: {
            'Authorization': 'Bearer ' + keycloak.token
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}
{% endhighlight %}

## Advanced Keycloak Features

### Session Management

Keycloak provides extensive session management capabilities:

* View and manage active sessions in the admin console
* Set session timeouts at realm and client levels
* Implement single sign-out across applications
* Track login history and detect suspicious activity

### Event Logging and Auditing

For security monitoring, Keycloak offers comprehensive event logging:

* Authentication events (logins, logouts, failures)
* Administrative events (configuration changes)
* Custom event listeners for integration with external systems

### User Federation

Keycloak can integrate with existing user directories:

* LDAP/Active Directory integration
* Custom user storage providers
* User attribute synchronization

## Real-World Considerations

### Multiple Client Types

In a typical architecture, you might have:

* **Public clients**: Single-page applications or mobile apps
* **Confidential clients**: Backend services with client secrets
* **Service accounts**: Machine-to-machine communication

Each requires different security configurations in Keycloak.

### Microservices Authorization

For microservices architectures:

* Use fine-grained role-based access control
* Implement custom authorization policies
* Consider using Keycloak Authorization Services for complex scenarios

### Performance Optimization

For high-traffic applications:

* Implement token caching
* Consider using offline tokens for mobile applications
* Use token introspection judiciously (it adds network overhead)

## Conclusion

Token-based authentication with access and refresh tokens provides a robust security model for modern applications. Keycloak simplifies the implementation of these patterns while offering extensive customization options.

By understanding the underlying concepts and security considerations, you can implement authentication systems that are both secure and user-friendly.

In future posts, I'll explore advanced Keycloak features such as custom authenticators, token exchange, and integrating with external identity providers.

What authentication challenges are you facing in your projects? Share in the comments below.
