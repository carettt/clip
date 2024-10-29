const { setup } = require("./lib/clip.js");
const { setTimeout } = require("timers/promises");

let clip = setup();

clip.assert("example", async (t) => {
  await setTimeout(1000);
  t.log("Running example test!");
  return false;
});

clip.assert("another", (t) => {
  t.log("Running another test!");
  return true;
});

clip.check();
