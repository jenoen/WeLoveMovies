// done
const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

// lists all movies
function listAllMovies() {
  return knex("movies").select("*");
}

// lists movies currently showing in theaters
function listMoviesShowing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "mt.movie_id", "m.movie_id")
    .where({ "mt.is_showing": true })
    .distinct("m.*");
}

// grabbing a specific movie by id
function getMovieById(movieId) {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
}

// lists theaters that are showing the selected movie
function whereToWatch(movieId) {
  return knex("theaters as t")
    .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
    .select("t.*", "mt.*")
    .where({ "mt.movie_id": movieId })
    .orderBy("t.theater_id");
}

// reduces the critic properties into one object (for list reviews)
const reduceCritics = reduceProperties("review_id", {
  critic_id: ["critic", "critic_id"],
  preferred_name: ["critic", "preferred_name"],
  surname: ["critic", "surname"],
  organization_name: ["critic", "organization_name"],
});

// lists reviews by the selected movie
function listReviewsByMovieId(movieId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({ "r.movie_id": movieId })
    .then(reduceCritics);
}

module.exports = {
  listAllMovies,
  listMoviesShowing,
  getMovieById,
  whereToWatch,
  listReviewsByMovieId,
};
