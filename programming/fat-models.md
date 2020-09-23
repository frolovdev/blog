Why we need more slim models

1. Faster and well-isolated unit tests

“Fat models” cause maintenance issues in large apps. Only incrementally better than cluttering controllers with domain logic, they usually represent a failure to apply the Single Responsibility Principle (SRP). “Anything related to what a user does” is not a single responsibility.

Early on, SRP is easier to apply. ActiveRecord classes handle persistence, associations and not much else. But bit-by-bit, they grow. Objects that are inherently responsible for persistence become the de facto owner of all business logic as well. And a year or two later you have a User class with over 500 lines of code, and hundreds of methods in it’s public interface. Callback hell ensues.

1. Concerns

It can help break stuff by domains, so first of all discover a set of related problems for a problem domain

2. Draper decorators

Avoid using Helpers and use decorators instead. Why? A common pitfall with Rails helpers is that they can turn into a big pile of non-OO functions, all sharing a namespace and stepping on each other. But much worse is that there’s no great way to use any kind of polymorphism with Rails helpers — providing different implementations for different contexts or types, over-riding or sub-classing helpers. I think the Rails helper classes should generally be used for utility methods, not for specific use cases, such as formatting model attributes for any kind of presentation logic. Keep them light and breezy.

Fitted scenario: model file creating detailed validation messages with HTML tags and URL links.

Just move the message creation code into a Draper Decorator for the model.

https://github.com/drapergem/draper

1. Presenters

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

### Service object 

Why? What are the benefits?

**Decoupling**. Service objects help you achieve more isolation between objects.
**Visibility**. Service objects (if well-named) show what an application does. I can just glance over the services directory to see what capabilities an application provides.

**Clean-up models and controllers.** Controllers turn the request (params, session, cookies) into arguments, pass them down to the service and redirect or render according to the service response. While models only deal with associations, and persistence. Extracting code from controllers/models to service objects would support SRP and make the code more decoupled. The responsibility of the model would then be only to deal with associations and saving/deleting records, while the service object would have a single responsibility (SRP). This leads to better design and better unit tests.

**Clean up and speed up your test suite.** Services are easy and fast to test since they are small Ruby objects with one point of entry (the call method). Complex services are composed with other services, so you can split up your tests easily. Also, using service objects makes it easier to mock/stub related objects without needing to load the whole rails environment.

**Callable from anywhere.** Service objects are likely to be called from controllers as well as other service objects, DelayedJob / Rescue / Sidekiq Jobs, Rake tasks, console, etc.

Disadvantages

On the other hand, nothing is ever perfect. A disadvantage of Service objects is that they can be an overkill for a very simple action. In such cases, you may very well end up complicating, rather than simplifying, your code.

---

Here are some indicators of when to use Service objects:
* The action is complex.
* The action reaches across multiple models.
* The action interacts with an external service.
* The action is not a core concern of the underlying model.
* There are multiple ways of performing the action.


I usually use the following guidelines and conventions to design the service object:

* Do not store state of the object.
* Use instance methods, not class methods.
* There should be very few public methods
* Methods should return rich result objects and not booleans.
* Services start with a verb (and do not end with Service): ApproveTransaction, SendTestNewsletter, ImportUsersFromCsv
* Services respond to the call method. I found using another verb makes it a bit redundant: ApproveTransaction.approve() does not read well. Also, the call method is the de facto method for lambda, procs, and method objects.




Keep Controllers as thin layers and always call Service objects. Some of you would ask why use controllers at all since we want to keep calling service objects to contain the logic? Well, controllers are a good place to have the HTTP routing, parameters parsing, authentication, content negotiation, calling the right service or editor object, exception catching, response formatting, and returning the right HTTP status code.

A Service is a stateless object that encapsulates a set of steps and usually has a single purpose. It's a great resource to decompose fat Active Record models while still keeping the controllers thin, because we take away some validations which don't belong to a model nor a controller.

For that validation we need to check if the discount is inside a 24 hour window, connect to an external API service to check if the discount code is valid and then decide to show or hide the discounted price.

This is not something we should do in a model. A model is a representation of a plain ruby object that can be instantiated. In this case we are not going to instantiate any validator model, it's a good thing to avoid instantiating objects whenever it's possible.

So if we can't use a model for this task, should we leave it in the controller? Let's try that:

```ruby
class PageController < ApplicationController

  def index
    @show_discount = false

    if params[:discount_code].present?
      discount = DiscountCode.find_by(discount_code: params[:discount_code])

      if discount.present?
        @show_discount = discount.created_at > 24.hours.ago
      else
        DiscountCode.create(discount_code: params[:discount_code])
        @show_discount = true
      end

      if @show_discount
        client = ExternalApi::Client.new
        @show_discount = client.validate(discount_code)
      end
    end
  end
end
```

The problem with this approach is that we just fattened our controller, adding 13 more lines to it. Also, we can ask ourselves: is it really the responsibility of the controller to check if the discount code is valid or not? I would say this is the kind of thing we should create a service for:

```ruby
class DiscountValidator
  def self.validate(discount_code)
    valid_discount = false

    discount = DiscountCode.find_by(discount_code: discount_code)

    if discount.present?
      valid_discount = discount.created_at > 24.hours.ago
    else
      DiscountCode.create(discount_code: discount_code)
      valid_discount = true
    end

    if valid_discount
      client = ExternalApi::Client.new(api_key: MY_API_KEY)
      valid_discount = client.validate(discount_code)
    end

    valid_discount
  end
end
```

In our controller

```ruby
class PageController < ApplicationController

  def index
    @show_discount = false

    if params[:discount_code].present?
      @show_discount = DiscountValidator.validate(params[:discount_code])
    end
  end
end

```

It looks much better, right? With these changes we are refactoring our code so when we look at our controller we know exactly what it does without knowing how the discount validation is done. The code is cleaner and easier to read.



## Plain Old Ruby Objects (PORO)


```ruby
  # app/models/user.rb
class User < ApplicationRecord
  has_many :sessions, dependent: :destroy
  ...
  # model method to verify session of user
  def session_valid?(token)
    session = sessions.find_by(token: token)
    if session.nil?
      return "not_found"
    else
      if session.status == false
        return "late"
      elsif (session.last_used_at + Session::SESSION_TIMEOUT) >= Time.now # SESSION_TIMEOUT is a constant in Session Model
        # session model to update when session got used
        session.used!
        return "valid"
      else
        # session model to update to blocked status
        session.block!
        return "late"
      end
    end
  end
end
```

TO

```ruby
# app/models/users/valid.rb
module Users
  class Valid
    # attr_reader to access without @ in class
    attr_reader :token
    attr_reader :user

    # delegate what attributes of the user to be used in class
    delegate :sessions, to: :user

    # initialize the class with token and user to be used in class
    def initialize(token, user)
      @token = token
      @user = user
    end

    # call the valid function for the user initialized
    def call
      # sessions are delegated for `user`
      session = sessions.find_by(token: token)
      if session.nil?
        return "not_found"
      else
        if session.status == false
          return "late"
        elsif (session.last_used_at + Session::SESSION_TIMEOUT) >= Time.now
          session.used!
          return "valid"
        else
          session.block!
          return "late"
        end
      end
    end
  end
end

```

and now use it

```ruby
# app/models/user.rb
class User < ApplicationRecord
  has_many :sessions, dependent: :destroy
  ...
  def session_valid?(token)
    Users::Valid.new(token, self).call
  end
end
```


[http://railscasts.com/episodes/398-service-objects?view=asciicast]()

https://gist.github.com/ryanb/4172391


https://github.com/shakacode/fat-code-refactoring-techniques
https://codeclimate.com/blog/7-ways-to-decompose-fat-activerecord-models/

[inspired by](https://youtu.be/bHpVdOzrvkE)

https://youtu.be/dSiE9N_f0h0

https://youtu.be/ori_StLXMSk





## concerns

Avoid using concerns and use Decorators/Delegators instead. Why? After all, concerns seem to be a core part of Rails and can DRY up code when shared among multiple models. Nonetheless, the main issue is that concerns don’t make the model object more cohesive. The code is just better organized. In other words, there’s no real change to the API of the model.






## Query objects

What is a Query object?

A Query object is a PORO which represent a database query. It can be reused across different places in the application while at the same time hiding the query logic. It also provides a good isolated unit to test.

You should extract complex SQL/NoSQL queries into their own class.

Each Query object is responsible for returning a result set based on the criteria / business rules.

```ruby
  class GroupEntriesQuery
  def initialize(user, period='week')
    @user   = user
    @period = period
  end

  def call
    @user.entries.group_by(&@period.to_sym).lazy
  end
end
```

## Move Validations into a Form Object


Remember in our guidelines, we agreed we wanted models to contain associations and constants, but nothing else (no validations and no callbacks). So let’s start by removing callbacks, and use a Form object instead.

Why use Form objects?

When looking to refactor your app, it’s always a good idea to keep the single responsibility principle (SRP) in mind.

SRP helps you make better design decisions around what a class should be responsible for.

Your database table model (an ActiveRecord model in the context of Rails), for example, represents a single database record in code, so there is no reason for it to be concerned with anything your user is doing.

A Form object is responsible for representing a form in your application. So each input field can be treated as an attribute in the class. It can validate that those attributes meet some validation rules, and it can pass the “clean” data to where it needs to go (e.g., your database models or perhaps your search query builder).

When should you use a Form object?

* When you want to extract the validations from Rails models.
* When multiple models can be updated by a single form submission, you might want to create a Form object.

How do you create a Form object?

* Create a plain Ruby class.
* Include ActiveModel::Model (in Rails 3, you have to include Naming, Conversion, and Validations instead)
* Start using your new form class as if it were a regular ActiveRecord model, the biggest difference being that you cannot persist the data stored in this object.

```ruby
  # app/models/registration.rb
class Registration
  include ActiveModel::Model

  attr_accessor(
    :company_name,
    :email,
    :first_name,
    :last_name,
    :terms_of_service
  )

  validates :company_name, presence: true
  validates :email, presence: true, email: true
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :terms_of_service, acceptance: true

  def register
    if valid?
      # Do something interesting here
      # - create user
      # - send notifications
      # - log events, etc.
    end
  end

  private

  def create_user
    # ...
  end
end

```

```ruby
  # app/forms/entry_form.rb
class EntryForm
 include ActiveModel::Model

 attr_accessor :distance, :time_period, :date_time,
               :status_weather, :status_landform

 validates_presence_of :distance, :time_period, :date_time

 validates_numericality_of :distance, :time_period

 validates :status_weather, inclusion: {
   in: EntryStatus::OPTIONS[:weather]
 }

 validates :status_landform, inclusion: {
   in: EntryStatus::OPTIONS[:landform]
 }
end
```

```ruby
  class CreateEntry
       
       ......
       ......

        def call
          @entry_form = ::EntryForm.new(@params)

          if @entry_form.valid?
             ....
          else
             ....
          end
        end
      end
```

Note: Some of you would say that there’s no need to access the Form object from the Service object and that we can just call the Form object directly from the controller, which is a valid argument. However, I would prefer to have clear flow, and that’s why I always call the Form object from the Service object.


### Move Callbacks to the Service Object

Why do we want to remove callbacks from models?

Rails developers usually start noticing callback pain during testing. If you’re not testing your ActiveRecord models, you’ll begin noticing pain later as your application grows and as more logic is required to call or avoid the callback.

Once the object is saved, the purpose (i.e. responsibility) of the object has been fulfilled. So if we still see callbacks being invoked after the object has been saved, what we are likely seeing is callbacks reaching outside of the object’s area of responsibility, and that’s when we run into problems.

In our case, we are sending an SMS to the user after we save an entry, which is not really related to the domain of Entry.

A simple way to solve the problem is by moving the callback to the related service object. After all, sending an SMS for the end user is related to the CreateEntry Service Object and not to the Entry model itself.

In doing so, we no longer have to stub out the compare_speed_and_notify_user method in our tests. We’ve made it a simple matter to create an entry without requiring an SMS to be sent, and we’re following good Object Oriented design by making sure our classes have a single responsibility (SRP).

```ruby
  class CreateEntry
  class NotValidEntryRecord < StandardError; end

  def initialize(user, params)
    @user   = user
    @params = params
  end

  def call
    @entry_form = ::EntryForm.new(@params)

    if @entry_form.valid?
      entry = Entry.new(@params)
      entry.user = @user

      entry.status = EntryStatus.new(
        @params[:status_weather],
        @params[:status_landform]
      )

      compare_speed_and_notify_user
      entry.save!
    else
      raise(NotValidEntryRecord, @entry_form.errors.full_messages.to_sentence)
    end
  end

  private

  def compare_speed_and_notify_user
    entries_avg_speed = (Entry.all.map(&:speed).sum / Entry.count).round(2)

    if speed > entries_avg_speed
      msg = 'You are doing great. Keep it up superman. :)'
    else
      msg = 'Most of the users are faster than you. Try harder dude. :('
    end

    NexmoClient.send_message(
      from: 'Toptal',
      to: user.mobile,
      text: msg
    )
  end
end
@frolovdev

```