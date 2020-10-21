**CSRF Protection**

"Synchronizer Token Pattern"

Dont put state changes on GET

1. Save a CSRF token to the session
2. Add meta tags for javascript read tokens
3. Insert the CSRF token in forms
4. Send tokens with XHR Requests
5. Match tokens on POST/PUT/DELETE

```html
<meta name="csrf-param" content="authenticity_token">
<meta name="csrf-token" content="JYROZoEPqtu3y0r4DZZvjMN6pOobY//SJAtA+PrANIyMcWQkNuYXFb4sUvr0RR2doMT2LHog+m2RY8KGc47VFg==">
```

**Mass assignment problem**

```ruby

@user = User.find(params[:id])

@user.update_attributes(params[:user])

```

PUT example.com/users/1?user[admin]=true

**Sanitizng vs escaping**

Sanitize - stip out the bad stuff (extremely hard)

```ruby
  "<Some <script>prompt(1)</script>> input" => "> input"
```


Escaping change special haracters to save characters (extremely easy)
```ruby
  h "

```

Avoid 
```ruby
sanitize()
sanitize_css()
strip_tags()
strip_links()
```


**Default headers**

```ruby
config.action_dispatch.default_headers = {
  'X-Frame-Options': "SAMEORIGIN",
  "X-XSS-Protection": "1; mode=block",
  "X-Content-Type-Options": "nosniff"
}
```

**Per form csrf token**

```ruby

Rails.configuration.action_controller.pef_form_csrf_tokens = true
```

**Content Security Policy**
[https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
```ruby
content_security_policy.rb
```


**HTML_SAFE**

html_safe is not safe its just say 