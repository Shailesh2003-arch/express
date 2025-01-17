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

// here if we want to create a dedicated response for a route parameter, then we do following.

app.get("/Movies/:id", (req, res) => {
  //we mention the required route parameter using the : parameterName, we can specify any number of paramteres to the route parameter list by using : and as well as we can make any route parameter to be optional by using ?  right in front of the route paramter...

  // Now how to know what value has been passed to the route parameter ?. we can do it by using the 'param' property of request object.
  // param is the property of request object that stores the route parameters in object form, in key value pairs.

  // console.log(req.params);
  // res.send(`test movie`);

  // Now to find if the movie with the route parameter that we define 'id' do matches to the user's requested id or not.
  // As the value of the route parameter's property is stored in string format we need to convert it into number format to work with it...
  const newId = parseInt(req.params.id); //converted to number format
  const movie = movieData.filter((el) => {
    //checking if the particular id exists in our array of objects of movies using filter method.
    if (el.id === newId) return el; // if it does exist, will simply return it.
  });
  // sometimes it may happen that user requests the id of the movies that doesn't exists in the datasource to handle such case we have.
  // as filter returns the array of elements that passed the required condition we check if the array is empty so that we can send a fail message to the user with the specified not found status code.
  if (movie.length === 0) {
    return res.status(404).json({
      status: "fail",
      message: `Movie with id ${newId} not found`,
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      movie: movie,
    },
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started`);
});
