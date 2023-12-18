const express = require("express");
const router = express.Router();
const recipeService = require("./RecipeService");

// routes
router.get("/", getAll);
router.post("/add", create);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", _delete);

module.exports = router;

function create(req, res, next) {
  recipeService
    .create(req.body)
    .then(() => res.json("Recipe has been created"))
    .catch((err) => next(err));
}

function getAll(req, res, next) {
  recipeService
    .getAll()
    .then((recipes) => res.json(recipes))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  recipeService
    .getById(req.params.id)
    .then((recipe) => (recipe ? res.json(recipe) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function update(req, res, next) {
  recipeService
    .update(req.params.id, req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function _delete(req, res, next) {
  recipeService
    .delete(req.params.id)
    .then(() => res.json({}))
    .catch((err) => next(err));
}
