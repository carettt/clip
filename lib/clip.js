class Test {
  constructor(name, func) {
    this.name = name;
    this.logs = []

    // Make new promise to run test asynchronously
    this.promise = new Promise(async (resolve, reject) => {
      this.log("> RUNNING", this.name, "TEST");

      // Resolve or reject based on callback return (boolean)
      if (await func(this)) {
        this.log("> TEST PASSED");
        resolve(this);
      } else {
        this.log("> TEST FAILED");
        reject(this);
      }

      this.log("> FINISHED RUNNING", this.name, "TEST");
    });
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

  // Wait until all promises are settled and then print summary
  check() {
    Promise.allSettled(this.tests.map((t) => {
      // Get promise from Test object
      return t.promise;
    })).then(results => {
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

exports.setup = () => {
  return new Clip();
}
