while(shouldContinue()) {
  // 1 step node looks in pending timers and sees if any functions are ready to be invoked

  // 2 node looks in pending OS tasks and runs relevant callbacks

  // 3 pause execution temporaly and wait new events when
  // - a new pending os task done
  // - a new peding operation is done
  // - a timer is about to complete
}