const db = require("_helpers/db");
const Recipes = db.Recipes;

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  return await Recipes.find();
}

async function getById(id) {
  return await Recipes.findById(id);
}

async function create(data) {
  console.log(data);
  // validate
  if (await Recipes.findOne({ recipeName: data.recipeName })) {
    throw 'Recipe name "' + data.recipeName + '" is already taken';
  }
  const recipe = new Recipes(data);
  // save recipe
  await recipe.save();
}

async function update(id, data) {
  const recipe = await Recipes.findById(id);

  // validate
  if (!recipe) throw "recipe not found";
  if (
    recipe.recipeName !== data.recipeName &&
    (await Recipes.findOne({ recipeName: data.recipeName }))
  ) {
    throw 'Recipe name "' + data.username + '" is already taken';
  }
  // copy userParam properties to user
  Object.assign(recipe, data);

  await recipe.save();
}

async function _delete(id) {
  await Recipes.findByIdAndRemove(id);
}
