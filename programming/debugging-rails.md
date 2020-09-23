```ruby
  @foo = Foo.new
  @foo.bar


  
```
Undefined method "bar" for Nil:nilClass

Beginners see this error and think the problem is that the method bar is undefined. It's not. In this error the real part that matters is:

for Nil:nilClass

for Nil:nilClass means that @foo is Nil! @foo is not a Foo instance variable! You have an object that is Nil. When you see this error, it's simply ruby trying to tell you that the method bar doesn't exist for objects of the class Nil. (well duh! since we are trying to use a method for an object of the class Foo not Nil).

Unfortunately, due to how this error is written (undefined method "bar" for Nil:nilClass) its easy to get tricked into thinking this error has to do with bar being undefined. When not read carefully this error causes beginners to mistakenly go digging into the details of the bar method on Foo, entirely missing the part of the error that hints that the object is of the wrong class (in this case: nil). It's a mistake that's easily avoided by reading error messages in their entirety.

Summary:

Always carefully read the entire error message before beginning any debugging. That means: Always check the class type of an object in an error message first, then its methods, before you begin sleuthing into any stacktrace or line of code where you think the error may be occurring. Those 5 seconds can save you 5 hours of frustration.

tl;dr: Don't squint at print logs: raise exceptions or use an irb debugger instead. Avoid rabbit holes by reading errors carefully before debugging.


1. Debugging view 
```ruby
 <%= debug(Object) %> 
```
 
2. 
```ruby
  <%= {amount: 50}.inspect %>
```

3. byebug

4. pry.rails
5. rails c or rails console


pry-rescue
pry-stack_explorer
pry-debugger

https://stackoverflow.com/questions/3955688/how-to-debug-ruby-scripts


6. debugging database

ActiveRecord::Base.verbose_query_logs = true

7. figure out where a method was defined

```ruby
object = Object.new
puts object.method(:blank?).source_location
# => ["/gems/activesupport-5.0.0.beta1/lib/active_support/core_ext/object/blank.rb", 14]
# This method was defined on line 14 of the file active_support/core_ext/object/blank.rb

```

8. Opening a dependency from a project

```
 bundle open active_support
```

9. See where an object was created

```ruby
  require 'objspace'
ObjectSpace.trace_object_allocations_start

Kernel.send(:define_method, :sup) do |obj|
  puts "#{ ObjectSpace.allocation_sourcefile(obj) }:#{ ObjectSpace.allocation_sourceline(obj) }"
end

world = "hello"

sup world
# => /tmp/scratch.rb:10
```

10. Find which method Super is Calling

```ruby
  def foo
    puts method(:foo).super_method.source_location
    super
  end
```

11. See where an argument is mutated

  Often times, I’ll instantiate a variable
```ruby
  config.thing = { "foo" => "bar" }
```

But later I’ll find it was changed, but I don’t know where:

```ruby
  puts config.thing
# => {"bar" => "THE FOO KEY IS GONE"}

```

You can see where the value of an object was modified by first freeze-ing the object:

```ruby
config.thing.freeze

```

There are some caveats: In this example the hash is frozen, but the keys and values are not. If you try to modify a key or value, no exception will be raised. If you’re trying to freeze a complex object such as a Hash, you’ll need to deep freeze it. This technique also won’t work for cases where a variable is assigned instead of mutated.

12. Un-debug a gem

If you’ve opened a gem and added debug statements, but forget to remove them before closing the file: you’ll get those debug statements every time you run your program. To reset every gem to its original state you can use gem pristine. For example to reset Active Support:

```bash
  gem pristine activesupport
```
To reset ALL gems you can run:

```bash
  gem pristine --all
```


13. conditional breakpoints