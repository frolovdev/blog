Because we write web applications for users other than ourselves, we cannot be sure that the users will always input valid data into the database. To enforce this, Active Record provides us a mini-validation framework that ensures the presence of data, uniqueness of certain fields, and so on.

Custom Validation
Sometimes, we might want to use certain validations that are more than just ensuring the presence of an attribute, length, uniqueness, or any of the helpers provided by Active Record. Luckily, Active Record allows us to define our own custom validations, which is the point of this article.

Custom Validator
To validate using a custom validator, you just need to define your validation logic in a class that extends ActiveModel::Validator and implements the validate method, which takes the record to be validated as its argument.

If validation fails, it adds the attribute to the errors array along with its error message. So, in our case, we’ll have RegNumValidator as seen below:

To use this validator in the Student model, we use the validates_with method:

With this, when a user tries to create a student with the wrong registration number, the record creation fails and an error message can be shown.


```ruby

  class SaveUserInteractor
  include ActiveModel::Model

  ATTRIBUTES = %i(first_name last_name image)

  attr_accessor(*ATTRIBUTES)

  validates :first_name, presence: true
  validates :last_name, presence: true

  # >>> all this is needed for paperclip validation outside of AR
  extend ActiveModel::Callbacks
  include Paperclip::Glue

  define_model_callbacks :save, only: [:after]
  define_model_callbacks :destroy, only: [:before, :after]
  define_model_callbacks :commit, only: [:after]

  has_attached_file :image
  validates_attachment :image, content_type: {content_type: %r{\Aimage/.*\Z}}, size: {in: 0..10.megabytes}
  attr_accessor :image_file_size, :image_file_name, :image_content_type, :id
  # <<< end of paperclip validation

  def initialize(user, attributes = {})
    super(attributes)
  end

  def call
    valid? && persist
  end

  private

  def persist
    # save/update the model
  end

```


```ruby
  class User
    include ActiveModel::Validations

    attr_reader :name, :age, :errors


    validates :name, :age, presence: true


    def initialize(attrs)
      @name, @age = attrs.values_at(:name, :age, :errors)
    end
  end
```

Rather awkward behaiviour, we can't use names of variables that used by active record

```ruby

User.new(name: "Jane", age: 30, errors: {foo: "bar"})

user.errors

# => { foo: bar }

user.validate

# => true

user.errors
# => {}

```

So don't use object that validates themselves, its antipattern


## so why having object that is valid or not valid is antipattern

simply because your code relys that your objects are valid, so invalidating objects only for displaying errors somewhere, this is not good way for solving problms

Example where it can be a problem: 
Sometimes your validation rules change over time

And if your app in production and you gathering some data, and if validation rules change over time you always end up in a situation
that you a data in your database that no longer valid

So to fix it you need to use stateless validation, when you just validation data and don't store objects in valid or invalid state

Illustration of this problem

```ruby
  class CreateUsers < ActiveRecord::Migration[6.0]
    create_table :users do |table|
      table.column :name, :string
      table.column :age, :integer
    end
  end
```