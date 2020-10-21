https://blog.stanko.io/rabbitmq-is-more-than-a-sidekiq-replacement-b730d8176fb

https://redis.io/topics/persistence

https://github.com/monorkin/lectures/blob/master/19-rabbitmq_is_more_than_a_sidekiq_replacement/rabbitmq_is_more_than_a_sidekiq_replacement-with_presenter_notes.pdf
To resolve those issues we offload that work to a “background job” library. In the case of the signup example, the user’s account would be created and they would be logged in. The “send email” job would be put in a queue, and would eventually get processed. If the job fails we can retry it as many times as we like, or run custom logic on the raised errors. The user isn’t penalized for our mistake.

But do we really need Sidekiq for this? No. The same functionality can be accomplished with the standard Queue class and a Thread.

```ruby
  class App < Roda
  JOBS = Queue.new
  
  Thread.new do
    loop do
      begin
        job = JOBS.pop
        job.call
      rescue => e
        puts "ERROR: #{e}"
        JOBS << job
      end
    end
  end

  route do |r|
    r.on 'sign_up' do
      r.post do
        email = r.params['email']
        JOBS << proc do
          Mailer::ConfirmationMailer.deliver(email)
        end
      end
    end
  end
end
```

## Why do we use background workers then?

The above approach has many downsides. Not to go too deep down the rabbit hole, I’ll focus on debuggability (yes, I made that word up), persistence, scaling and lastly fault tolerance.


The above solution is difficult to debug. There is no clear way to inspect the contents of the queue without littering the code with bindings to pry. If the server is stopped (e.g. to add said bindings to pry) all jobs in the queue are lost, which means that we can’t even extract the job that caused the issue to replicate it. To solve those issues Sidekiq uses Redis to store it’s jobs. Redis is an in-memory key-value store that can store values as many different data types. Jobs are stored in a list as JSON objects. We can inspect the queue’s content by connecting to Redis with redis-cli and inspecting the queue list.

Using Redis as a central job queue also enables us to scale the number of workers to accommodate higher workloads.
There are two concerns regarding fault tolerance, Redis and the worker process. By default, Redis is a volatile store (data may be lost if the store restarts), though that can be changed by utilizing its RDB and AOF features which in conjunction prevent any data loss. 

There are some caveats, if RDB (which is enabled by default) is used without AOF, data loss may still occur, and if used in conjunction with AOF may cause performance fluctuations.

When it comes to worker failures, Sidekiq handles most issues regarding handling Ruby errors and retry logic. But if a worker crashes or is killed while processing a job, that job is gone.


Sidekiq’s memory problem
If we ignore the fault tolerance paywall, Sidekiq still has a memory consumption issue as it uses Redis for its job queue. Redis, as stated before, is an in-memory data store, and it has no mechanism to offload stale data to disk. This means that all jobs in the queue are kept in-memory all the time.

The most often solution to this issue is passing IDs of database records instead of values to the job queue. This reduces Redis’ memory consumption, but increases Sidekiq’s or Ruby’s since each Sidekiq instance needs to initialize your application to get access to your models, thus increasing memory consumption. This can be solved by writing your workers as lightweight Ruby processes, but now we have the issue of managing models and database access information in two separate applications (your worker and your main application). Another solution is to consume your main apps API, but then we are increasing load on our app instead of off-loading work from it.