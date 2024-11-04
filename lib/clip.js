const express = require('express');

class Test {
  constructor(name, func) {
    this.name = name;
    this.logs = []
    this.func = func;
  }

  async run() {
    this.log("> RUNNING", this.name, "TEST");

    try {
      this.result = await this.func(this);
    } catch (err) {
      this.log(`> ERROR: ${err.message}`);
    }

    // Resolve or reject based on callback return (boolean)
    if (this.result) {
      this.log("> TEST PASSED");
    } else {
      this.log("> TEST FAILED");
      throw(this);
    }

    this.log("> FINISHED RUNNING", this.name, "TEST");

    return this;
  }

  // Helper function to store log messages instead of printing them
  log(...msgs) {
    let msg = "";

    // Add a space after each message unless its the last one
    msgs.forEach((m, i, l) => {
      msg += (m + (i === (l - 1) ? "" : " "));
    });

    this.logs.push(msg);
  }

  // Print stored logs
  printLogs() {
    this.logs.forEach(l => {
      console.log(l);
    });
  }
}

class Clip {
  constructor() {
    this.tests = [];
  }

  // Add new test
  assert(name, func) {
    this.tests.push(new Test(name, func));
  }

  async check() {
    let promises = [];

    this.tests.forEach((t) => {
      promises.push(t.run());
    });

    await Promise.allSettled(promises).then(results => {
      console.log("=== SUMMARY ===\n");

      // Print each test result, promise returns Test object in value/reason
      results.forEach(r => {
        if (r.status === "fulfilled") {
          console.log(r.value.name, "... PASSED");
        } else {
          console.log(r.reason.name, "... FAILED");

          // Print logs if test failed
          console.log("--- LOGS ---");
          r.reason.printLogs();
          console.log("--- END LOGS ---");
        }

        console.log();
      });
      
      console.log("=== END SUMMARY ===");
    });
  }
}

module.exports.setup = () => {
  return new Clip();
};

module.exports.MockServer = class MockServer {
  constructor() {
    this.app = express();
    this.port = 3000;
    this.server = null;
  }

  get(path, data) {
    this.app.get(path, (_, res) => {
      res.send(data);
    });
  }

  async start() {
    await new Promise((resolve, _) => {
      this.server = this.app.listen(this.port, () => {
        console.log(`Mock server listening on port ${this.port}`)
        resolve();
      });
    });
  }

  stop() {
    this.server.close();
  }
};
