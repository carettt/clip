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
    t.log("This test should pass");
    return true;
  });

  // New test
  clip.assert("another", async (t) => {
    let res = await fetch("http://localhost:3000/");
    let text = await res.text();

    return text === "tested";
  });

  // Get test results
  clip.check().then(() => {
    mock.stop();
  });
});
