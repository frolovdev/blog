“Fat models” cause maintenance issues in large apps. Only incrementally better than cluttering controllers with domain logic, they usually represent a failure to apply the Single Responsibility Principle (SRP). “Anything related to what a user does” is not a single responsibility.

Early on, SRP is easier to apply. ActiveRecord classes handle persistence, associations and not much else. But bit-by-bit, they grow. Objects that are inherently responsible for persistence become the de facto owner of all business logic as well. And a year or two later you have a User class with over 500 lines of code, and hundreds of methods in it’s public interface. Callback hell ensues.

1. Concerns

It can help break stuff by domains, so first of all discover a set of related problems for a problem domain

2. Draper decorators

Fitted scenario: model file creating detailed validation messages with HTML tags and URL links.

Just move the message creation code into a Draper Decorator for the model.

https://github.com/drapergem/draper

3. Presenters

Scenario

You are setting too many instance variables in the controller action. You also have local variables assigned in the view. 

Another solutions:

- More fat models
- Helpers

**Helpers**

cons:

Helpers are globally available
They are not objects and not related to OOP

Pattern:

Create a plain ruby object, that wraps up the values and logic going from controller to the view (decorator pattern).

Lib: Draper, draper adds object-oriented layer of presentation logic to your rails Application (view-model)


From 
```ruby
  # helpers/articles_helper.rb
  def publication
    if article.published?
      "Published at #{article.published_at.strftime('%A, %B %e')}"
    else
      "Unpublished"
    end
  end
```

To

```ruby
  # decorators/articles_decorator.rb

  class ArticleDecorator < Draper::Decorator
    delegate_all

    def publication_status
      if article.published?
        "Published at #{published_at}"
      else
        "Unpublished"
      end
    end

    def published_at
      object.published_at.strftime('%A, %B %e')
    end
  end
```

In the controller method

```ruby
  def show
    @article = Article.find(params[:id]).decorate
  end
```

In the view

```ruby
  <%= @article.publication_status %>
```

Presenter need when you have a lot of instance variables passed to the view

1. Service object 


[http://railscasts.com/episodes/398-service-objects?view=asciicast]()

https://gist.github.com/ryanb/4172391


https://github.com/shakacode/fat-code-refactoring-techniques
https://codeclimate.com/blog/7-ways-to-decompose-fat-activerecord-models/

[inspired by](https://youtu.be/bHpVdOzrvkE)

https://youtu.be/dSiE9N_f0h0

https://youtu.be/ori_StLXMSk