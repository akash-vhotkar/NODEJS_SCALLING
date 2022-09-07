const express = require("express");
const cluster = require("node:cluster");
const os = require("os");

// calculate no of cpus 
const noCpus = os.cpus().length;
const app = express();

const PORT = 9000;

app.get("/user", (req, res) => {
  // command  to kill worker processes
  //    cluster.worker.kill();
  res.send("Hello from server " + process.pid);
});

// whenever on worker process exited we will generate new process
cluster.on("exit", (worker, code, signal) => {
  console.log("the worker process exited ", worker.process.pid);
  cluster.fork();
});

// checking whether is primary worker or not \
// if it is primary worker that means we need to create  
// no of  worker process equal  no cpu cors 
if (cluster.isPrimary) {
  for (let i = 0; i < noCpus; i++) {
    cluster.fork();
  }
} else {
  app.listen(PORT, (err) => {
    if (err) {
      console.log(err);
    }
    console.log(process.pid + "  server is running on the port  " + PORT);
  });
}
