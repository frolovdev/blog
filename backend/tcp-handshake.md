TCP handshake

Let's do simple http request (curl)

First client try establishing TCP connection. In tcp we have an aknowledgement, server says I recieved a packet. But how to identify packet, so we need to introduce uniq identifier, each packet have sequence number. 

Also we have synchronization