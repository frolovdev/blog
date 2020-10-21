https://karolgalanciak.com/blog/2019/08/18/durable-sidekiq-jobs-how-to-maximize-reliability-of-sidekiq-and-redis/


https://gitlab.com/gitlab-com/gl-infra/infrastructure/-/issues/943#note_38192586
https://gitlab.com/gitlab-org/sidekiq-reliable-fetch

https://github.com/ondrejbartas/sidekiq-cron
https://github.com/davydovanton/sidekiq-statistics


https://github.com/nickelser/activejob-traffic_controls
https://github.com/chaps-io/gush

Sidekiq uses BRPOP command to pop a job off the queue in Redis. It means that job is removed from the queue, usually, that's not a problem because if our job raises an error the Sidekiq puts it back with "failed" status(to another queue) and it will be retried later. But it becomes a problem when we kill sidekiq or when it segfaults or crashes. In this case, we lose that job forever.


https://blog.bigbinary.com/2018/05/08/increase-reliability-of-background-job-processing-using-super_fetch-of-sidekiq-pro.html


sidekiq-scheduler
https://github.com/moove-it/sidekiq-scheduler


sidekiq-unique-jobs

https://github.com/mhenrixon/sidekiq-unique-jobs