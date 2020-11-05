setTimeout(() => {
  Promise.resolve().then(() => {
    console.log("prom");
  });

  console.log("setTimeout");
}, 0);

process.nextTick(() => {
  console.log("tick");

  process.nextTick(() => {
    console.log("kek");
  });
});


  Promise.resolve().then(() => {
    console.log("prom2");
  });