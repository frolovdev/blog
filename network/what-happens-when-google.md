1) Typing

browser look through your history and started from letter g and display autocomplete list.

2) browsers starts parsing string "google.com"
  
so it looks is it search term or url, if url visit page

3) browser determine what protocol is it

https port 443  or http port 80

4) browser checks do I have an address for domain google.com
5) if not it goes to dns server, its just an udp service listening 453. We do dns lookup

6) so we send a packet through udp to dns server, we encapsulate our packet to a frame
7) so we see if we are not in local subnet we send our pacakge to gateway (my router), before send to dns server we change our ip to public ip (ip of router)
8) add to NAT (Network address translation) table
9) after that we establish tcp connection
10) tls 1.3

establish private key and public key and merged key and send client hello with public and merged key
and client send what encrypted functions it supports

and also sends application protocol negotiation (needs for HTTP2 and HTTP3)

next server hello with a certificate