const { setup, MockServer } = require("./lib/clip.js");
const { setTimeout } = require("timers/promises");

// get Clip object
let clip = setup();

// Setup mock server
let mock = new MockServer();

mock.get("/", "testing");
mock.start().then(() => {
  // Passing test
  clip.assert("passing", (t) => {
    t.log("This test should pass after 1 second");
    return true;
  });

  // Passing test with fetch from server
  clip.assert("server", async (t) => {
    t.log("Fetching from server endpoint /");
    let res = await fetch("http://localhost:3000/");
    t.log("Parsing response");
    let text = await res.text();

    return text === "testing";
  });

  // Failing test with TypeError
  clip.assert("type-error", () => {
    ""();
    return true;
  });

  // Get test results
  clip.check().then(() => {
    mock.stop();
  });
});
