const express = require("express"); // returns a function to the express var
let app = express(); // when we call that function it returns an object let's store it in a varible.

const port = 3000;
app.listen(port, () => {
  console.log(`Server started`);
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello", status: 200 });
});
