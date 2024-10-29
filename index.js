const { setup } = require("./lib/clip.js");
const { setTimeout } = require("timers/promises");

let clip = setup();

clip.test("example", async (t) => {
  await setTimeout(5000);
  t.log("Running example test!");
  return false;
});

clip.test("another", (t) => {
  t.log("Running another test!");
  return true;
});

clip.assert();
