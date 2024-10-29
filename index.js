const { setup } = require("./lib/clip.js");
const { setTimeout } = require("timers/promises");

// get Clip object
let clip = setup();

// New test
clip.assert("example", async (t) => {
  await setTimeout(1000);
  t.log("Running example test!");
  return false;
});

// New test
clip.assert("another", (t) => {
  t.log("Running another test!");
  return true;
});

// Get test results
clip.check();
