[https://github.com/krisleech/wisper](https://github.com/krisleech/wisper)
https://www.toptal.com/ruby-on-rails/the-publish-subscribe-pattern-on-rails#:~:text=The%20publish%2Dsubscribe%20pattern%20(or,to%20specific%20receivers%20(subscribers).


```ruby
class Checkout
  include Publisher

  attr_reader :items

  def initialize(subscribers:)
    @items = []
    subscribe(subscribers)
  end

  def add(item)
    @items << item
    broadcast(:item_added, item)
  end
end

class Printer
  def item_added(item)
    print(item)
  end

  private

  def print(message)
    puts "[#{Time.now}] #{message}"
  end
end

module Publisher
  def subscribe(subscribers)
    @subscribers ||= [] # if @subscribers is nil, we initialize it as empty array, else we do nothing
    @subscribers += subscribers
  end

  def broadcast(event, *payload)
    @subscribers ||= [] # @subscribers is nil, we can't do each on it
    @subscribers.each do |subscriber|
      # If event is :item_added occured with payload item itself
      # we send method :item_added to subscriber and bypass payload as argument if subscriber
      # responds to it.
      subscriber.public_send(event.to_sym, *payload) if subscriber.respond_to?(event)
    end
  end
end


class Item
  attr_reader :code, :title

  def initialize(code:, title:)
    @code = code
    @title = title
  end

  def to_s
    "#{@code} #{@title}"
  end
end

class Printer
  def print(message)
    puts "[#{Time.now}] #{message}"
  end
end
```