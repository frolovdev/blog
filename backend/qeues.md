Sometime webserver overwhelemd and cant execute all requests immediately. For exmaple we have a lot of request that takes a lot of time to process. And if you have tasks taking a lot of and unpredicatable amount of time then some reuests are coming and they are waiting adn client is actually blocked, because for example tcp connection doesnt get response back. Users hate when they don't get immediately result of their actions, so how do we trick that?

So let's introduce a queue, we're gonna do next thing, we say hey user I commited to you, we're recieved your request and now it's processing and now it's in the queue, I can't promise anything else but I recieeved it. 