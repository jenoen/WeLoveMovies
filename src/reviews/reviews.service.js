// DONE
const knex = require("../db/connection");

// function to grab/list of critics associated with the reviews - so that you could fully update the review
function listCritics(criticId) {
  return knex("critics as c").where({ "c.critic_id": criticId }).first();
}

// grabs data to read from DB
function read(review_id = 0) {
  return knex("reviews").select("*").where({ review_id }).first();
}

// updates DB data
function update(updatedReview) {
  return knex("reviews")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*");
}

// deletes DB data
function destroy(review_id) {
  // Your solution here
  return knex("reviews").where({ review_id }).del();
}

module.exports = {
  listCritics,
  read,
  update,
  delete: destroy,
};
