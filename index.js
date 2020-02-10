#!/usr/bin/env node
const minimist = require("minimist");
const { execSync } = require("child_process");

var _data = "";

function cleanText(arr, pattern) {
  return arr.map(d => d.replace(pattern, ""));
}

function loopData(argv, data) {
  const exec = argv._[0];
  const debug = argv.verbose || argv.v || false;
  const dryRun = argv.dry || argv.d || false;
  const pattern = argv.pattern || argv.p || "\n";
  const cleanPattern = argv.clean || argv.c || /\r?\n|\r/g;
  let arr = data.split(pattern);
  arr = cleanText(arr, cleanPattern);
  if (debug)
    console.log({
      argv,
      data,
      arr,
      options: {
        debug,
        dryRun,
        pattern,
        cleanPattern
      }
    });
  for (let i = 0; i < arr.length; i++) {
    const v = arr[i];
    const cmd = exec.replace(/{i}/g, i).replace(/{v}/, v);
    if (dryRun || debug) console.log(cmd);
    else {
      execSync(cmd, { cwd: process.cwd(), detached: false, stdio: "inherit" });
      // execa(cmd, [], { cwd: process.cwd() }).stdout.pipe(process.stdout);
    }
  }
}

function withPipe(data) {
  const argv = minimist(process.argv.slice(2));
  loopData(argv, data.trim());
}

function withoutPipe() {
  console.log("no content was piped");
}

var self = process.stdin;
self.on("readable", function() {
  var chunk = this.read();
  if (chunk === null) {
    if (!_data) withoutPipe();
  } else {
    _data += chunk;
  }
});
self.on("end", function() {
  withPipe(_data);
});

process.on("SIGTERM", () => {
  process.exit(1);
});
