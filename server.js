const express = require("express"); // returns a function to the express var
let app = express(); // when we call that function it returns an object let's store it in a varible.
const fs = require("fs");

// Now in real world applications we keep our data in the database and from there we return it to the client as per the request.
// Now as for of now, we are not working with the database, so will be using the json file as the data source to serve the data to the client.
// to serve the data from our json file to the client we need to read it...
//  And to do so will be using the node api 'fs'

// app.use(express.json());
app.use(express.json());

// reading the data source

const movieData = JSON.parse(fs.readFileSync("./data/movies.json", "utf-8")); // we read the data just once to avoid the numerous time of data reading whenever the client hits the request.

console.log(typeof movieData);

// creating our first api...

// first get request...
app.get("/Movies", (req, res) => {
  res.status(200).json({
    status: "sucess",
    count: movieData.length,
    data: {
      movies: movieData,
    },
  });
});

app.post("/Movies", (req, res) => {
  const newId = movieData[movieData.length - 1].id + 1;
  const newMovie = Object.assign({ id: newId }, req.body);
  movieData.push(newMovie);
  fs.writeFile("./data/movies.json", JSON.stringify(movieData), (err) => {
    res.status(201).json({
      status: "sucess",
      data: {
        movie: newMovie,
      },
    });
  });
  // console.log(req.body);

  // res.send(`Created`);
});

// Practice purpose...
// app.post("/Movies", (req, res) => {
//   // console.log(req.body);
//   const newId = movieData[movieData.length - 1].id + 1;
//   const newMovie = Object.assign({ id: newId }, req.body);
//   console.log(newMovie);
//   // res.send(`created`); // sending response to the server that data is created
//   movieData.push(newMovie);
//   fs.writeFile("./data/movies.json", JSON.stringify(movieData), (err) => {
//     res.status(201).json({
//       status: "success",
//       data: {
//         movie: newMovie,
//       },
//     });
//   });
// });

const port = 3000;
app.listen(port, () => {
  console.log(`Server started`);
});
