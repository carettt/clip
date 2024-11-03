const { setup, MockServer } = require("./lib/clip.js");
const { setTimeout } = require("timers/promises");

// get Clip object
let clip = setup();

// Setup mock server
let mock = new MockServer();

mock.get("/", "testing");
mock.start().then(() => {
  // New test
  clip.assert("example", async (t) => {
    await setTimeout(1000);
    t.log("Running example test!");
    return false;
  });

  // New test
  clip.assert("another", async (t) => {
    console.log("starting another test");
    let res = await fetch("http://localhost:3000/test");
    let text = await res.text();

    return text === "testing";
  });

  // Get test results
  clip.check();

  // Stop server
  mock.stop();
});
