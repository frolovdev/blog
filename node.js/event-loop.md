Javascript
|
Node js virtual macine

|

V8 | Libuv


process.binding() connects js and c++

---

one Tick - is one cycle of event loop

Timers - setTimeout and setInterval (not setimmediate)
Pending callbacks - callbacks от некоторых системных операций (TCP error)
Idle prepare

Poll - исполняет I/O коллбеки

Круто  тут делать setImmediate, исполнится раньше таймеров , если нет таймеров нет setImmediate ждем событий от IO

Фаза check - тут выполняется setImmediate (вызванный на Poll)


Фаза close callbacks - если события вылетли неожиданно то выполнится коллбек  


Если запустим 4 крипто функции на двухядерном прцоессоре то получим гораздо более мделенный рузультат чем на двух ядрах две крипто функции

Потому что процессор будет переключать контексты, дав на одно яро две функции и две других функции на другое ядро

<img src="https://prnt.sc/v7qedo"></img> 

Thread pool

Dns.lookup
fs
pipes


in start of event loop refs = 0, if in the end refs equal 0 scripts exit


# Event loop browser

Task ques , we always ques task

Render steps - style calculation, layout, painting

Request animation frame


Измение дом RequestANimationFrmae

Неприоритетная и недолгая RequestIdleCallback

Долгое и тяжелое WebWorkers