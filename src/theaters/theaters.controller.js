// DONE

const theatersService = require("./theaters.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// actually lists the theaters
async function list(req, res, next) {
  const data = await theatersService.listAllTheatersWithMovies();
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
};
