// done

const moviesService = require("./movies.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// lists theaters - depending if there is a query
async function list(req, res, next) {
  const query = req.query.is_showing;
  let data;

  if (query === "true") {
    data = await moviesService.listMoviesShowing();
  } else {
    data = await moviesService.listAllMovies();
  }
  res.json({ data });
}

// checks if movie id is valid/exits
async function movieExists(req, res, next) {
  const movie = await moviesService.getMovieById(Number(req.params.movieId));
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}

// actually list the specific movie
function getSpecificMovie(req, res) {
  const movie = res.locals.movie;
  res.json({ data: movie });
}

// actually shows the theaters for the specific movie
async function readTheatersByMovieId(req, res, next) {
  const data = await moviesService.whereToWatch(Number(req.params.movieId));
  res.json({ data });
}

// actually shows the reviews for the specifc movie
async function readReviewsByMovieId(req, res, next) {
  const data = await moviesService.listReviewsByMovieId(
    Number(req.params.movieId)
  );
  res.json({ data });
}

module.exports = {
  //   listAllMovies: asyncErrorBoundary(listAllMovies),
  //   listMoviesShowing: asyncErrorBoundary(listMoviesShowing),
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(getSpecificMovie)],
  readTheatersByMovieId: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readTheatersByMovieId),
  ],
  readReviewsByMovieId: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readReviewsByMovieId),
  ],
  //   create: [
  //     hasRequiredProperties,
  //     hasOnlyValidProperties,
  //     asyncErrorBoundary(create),
  //   ],

  //   update: [asyncErrorBoundary(restaurantExists), asyncErrorBoundary(update)],
  //   delete: [asyncErrorBoundary(restaurantExists), asyncErrorBoundary(destroy)],
};

// similar:
//  node-express-postgreSQL
//  starter-node-exerss-postgresql main
//  starter-corsback-end Main
