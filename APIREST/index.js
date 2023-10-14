const express = require("express");
const app = express();
const port = 3000;

// Define a route for GET requests to the root URL
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Define a route for POST requests to the root URL
app.post("/", (req, res) => {
  res.send("Got a POST request");
});

// Define a route for PUT requests to the /user URL
app.put("/user", (req, res) => {
  res.send("Got a PUT request at /user");
});

// Define a route for DELETE requests to the /user URL
app.delete("/user", (req, res) => {
  res.send("Got a DELETE request at /user");
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
