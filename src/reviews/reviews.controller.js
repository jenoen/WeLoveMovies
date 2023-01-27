// DONE

const reviewsService = require("./reviews.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// makes sure the review Id exists
async function reviewExists(req, res, next) {
  const { reviewId } = req.params;

  const review = await reviewsService.read(reviewId);

  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: `Review cannot be found.` });
}

// function to actually update
async function update(req, res, next) {
  const updatedReview = {
    ...res.locals.review,
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };

  // updates the table
  const data = await reviewsService.update(updatedReview);

  console.log("mouse", data);

  // this updates the "body" to include the pulled critic info after fully updating table
  updatedReview.critic = await reviewsService.listCritics(
    updatedReview.critic_id
  );
  console.log("mouse2", updatedReview);

  // to display the updatedBody with critic inserted
  res.json({ data: updatedReview });
}

// function to actually delete
async function destroy(req, res, next) {
  reviewsService
    .delete(res.locals.review.review_id)
    .then(() => res.sendStatus(204))
    .catch(next);
}

module.exports = {
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};
