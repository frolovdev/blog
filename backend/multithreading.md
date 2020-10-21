# Asynchronosity Concurrency and Parallelism: A Practical Tutorial

When you make a request then there's always creates a process (by default process use 1 thread), that does actual work and now our thread is busy.

So if you for example you ask your file system read file is your thread actually busy? No it inst doint actually any work it's basically blocked and waiting. In reading a file disc controller does actually work. And thread just sitting adn do nothing.

And it's called synchronous execution, because you sending a request and waiting and blocked despite you are not doing any work.

Now , it's ridiculuos situation we need to introduce other thread. Let the process execute another thread, that does more work. So what is the threead actually is? We have a process, so for simplicity you can imagine that it's just a container that have some resources (CPU memory) and it has some threads that have in commmon shared resurces that the process has. This is a big problem because they can start racing for memory location. So what to do? You dont never do multithreading, multithreading is evil. So its very hard to build an application so it's a thread safe. 

So some smart peoople came and say you know what, we're gonna execute called something asynchronous execution and node js is very elegant example. It is sing threaded non blocking asynchronous platform. Let's talk about asynchronosity.

The idea of asynchronosity is having a single thread single process. So how we actually work with reading from disk. If we reading asynchronosly. Because the thread is actually doing anything it's just waiting, the application knows this, this thread don't do know anything, and our application says, hey file system I jsut want this resource of this file, I'm gonna go away and here's a function, it's called a callback (call me back ), whenever you're done. And thread immediately unblocking and start executing the rest of a code, until that function (callback) is executes. But what's the problem here? The code is ugly and it's hard to read it.

And what about multiprocessing? The idea of multiprocessing is spin up processes with their own memory structure, not threads and you just need to do inter process communication. So where is multiprocessing actually good? So for exmple you want to right a function that brute force a password, so you can split up not only on CPU cores but you can scale it to multiple machines as well.


So move to the Concurrency and parallelism. They are not the same thing (i.e., concurrent != parallel).

Ruby cncurrency is when two tasks can start, run and complete in overlapping time, it doesn't neccecerally mean, that they'll ever both be running at the same time instant (multithreads on a single core machine). In contrast, parallelism is when two tasks literally run at the same time (multithreads on multicore processor). 

The key point here is that concurrent threads and/or process will not necessarily be running in *parallel*.

Comparing table Threads vs Process

| Process                                                                                                   | Thread                                                                            |
| --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Uses more memory                                                                                          | Uses less memory                                                                  |
| If parent dies before children have exited, children can become zombie processes                          | All threads die when the process dies (no chance of zombies)                      |
| More expensive for forked processes to switch context since <br /> OS needs to save and reload everything | Threads have considerably less overhead since they share address space and memory |
| Forked processes are given a new virtual memory space (process isolation) | Threads share the same memory, so need to control and deal with concurrent memory issues| 
| Requires inter-process communication | Can "communicate" via queues and shared memory | 
| Slower to create and destroy | Faster to create and destroy |
| Easier to code and debug | Can be significantly more complex to code and debug|


**Ruby multiple processes**


Before we look into Ruby multithreading options, let’s explore the easier path of spawning multiple processes.

In Ruby, the fork() system call is used to create a “copy” of the current process. This new process is scheduled at the operating system level, so it can run concurrently with the original process, just as any other independent process can. (Note: fork() is a POSIX system call and is therefore not available if you are running Ruby on a Windows platform.)

https://www.toptal.com/ruby/ruby-concurrency-and-parallelism-a-practical-primer