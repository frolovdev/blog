SIGINT is an interrupt signal. It is an alternative to hitting Ctrl-C from the keyboard. When a process is running in foreground, we can hit Ctrl-C to signal the process to shut down. When the process is running in background, we can use kill command to send a SIGINT signal to the process’ PID. A process can optionally catch this signal and shutdown itself gracefully. If the process does not respect this signal and ignores it, then nothing really happens and the process keeps running. Both INT and SIGINT are identical signals.

Another useful signal is SIGTERM. It is called a termination signal. A process can either catch it and perform necessary cleanup or just ignore it. Similar to a SIGINT signal, if a process ignores this signal, then the process keeps running. Note that, if no signal is supplied to the kill command, SIGTERM is used by default. Both TERM and SIGTERM are identical signals.

SIGTSTP or TSTP is called terminal stop signal. It is an alternative to hitting Ctrl-Z on the keyboard. This signal causes a process to suspend further execution.

SIGKILL is known as kill signal. This signal is intended to kill the process immediately and forcefully. A process cannot catch this signal, therefore the process cannot perform cleanup or graceful shutdown. This signal is used when a process does not respect and respond to both SIGINT and SIGTERM signals. KILL, SIGKILL and 9 are identical signals.

There are a lot of other signals besides these, but they are not relevant for this post. Please check them out here.

A Sidekiq process pays respect to all of these signals and behaves as we expect. When Sidekiq receives a TERM or SIGTERM signal, Sidekiq terminates itself gracefully.
https://en.wikipedia.org/wiki/Signal_(IPC)#POSIX_signals