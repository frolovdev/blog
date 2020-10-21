All the complexity on the end is on the PUBLISH command, that performs
an amount of work that is proportional to:

a) The number of clients receiving the message.
b) The number of clients subscribed to a pattern, even if they'll not
match the message.

This means that if you have N clients subscribed to 100000 different
channels, everything will be super fast.

If you have instead 10000 clients subscribed to the same channel,
PUBLISH commands against this channel will be slow, and take maybe a
few milliseconds (not sure about the actual time taken). Since we have
to send the same message to everybody.


So just to iterate, it's better to have million channels with one/two subscribers each than a million users listening to one channel and parse the data right?

You really mean "reiterate", but yes. But the reasons are simple: if you publish to 10k clients (1 million would suggest that you wrote your clients wrong), then the amount of data that needs to be sent is 10,000 times what was received, which can be pretty nasty for the network and Redis. But sending to a handful of clients? Not a big deal.


To unsubscribe channel redis visit only channels with it know the client sibscribed to.