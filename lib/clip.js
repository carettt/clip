class Test {
  constructor(name, func) {
    this.name = name;
    this.logs = []

    this.promise = new Promise(async (resolve, reject) => {
      this.log("> RUNNING", this.name, "TEST");

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

  log(...msgs) {
    let msg = "";

    msgs.forEach((m, i, l) => {
      msg += (m + (i === (l - 1) ? "" : " "));
    });

    this.logs.push(msg);
  }

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

  assert(name, func) {
    this.tests.push(new Test(name, func));
  }

  check() {
    Promise.allSettled(this.tests.map((t) => {
      return t.promise;
    })).then(results => {
      console.log("=== SUMMARY ===\n");

      results.forEach(r => {
        if (r.status === "fulfilled") {
          console.log(r.value.name, "... PASSED");
        } else {
          console.log(r.reason.name, "... FAILED");
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
