1. every time when person that you follow post tweet we update your timeline feed precomputing it and storing in redis
2. if user is inactive for 2 weeks we dont need to store his feed in redis cluster
3. For very famous people we dont precompute them in 