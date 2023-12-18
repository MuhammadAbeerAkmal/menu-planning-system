import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Sidebar from "../components/SharedComponents/Sidebar/Sidebar";
import Signup from "../components/Signup/Signup";
import SignupWorker from "../components/Signup/SignupWorker";
import SignIn from "../components/SignIn/SignIn";
import SignInWorker from "../components/SignIn/SignInWorker";
import Recipe from "../components/Recipe/Recipe";
import Dashboard from "../components/Dashboard/Dashboard";
import RecipesList from "../components/RecipesList/RecipesList";
import RecipeView from "../components/RecipeView/RecipeView";
import ChefsList from "../components/ChefsList/ChefsList";
import WorkersList from "../components/WorkersList/WorkersList";
import PrivateRoute from "../components/ProtectedRoutes/ProtectedRoute";
import RecipeEditForm from "../components/Recipe/RecipeEditForm/RecipeEditForm";
import EditChef from "../components/EditChef/EditChef";
import Ingredients from "../components/Ingredients/Ingredients";
//Add new routes below
const Routing = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/signupChef" component={Signup} />
          <Route path="/signupWorker" component={SignupWorker} />
          <Route path="/loginChef" component={SignIn} />
          <Route path="/loginWorker" component={SignInWorker} />
          <Route exact path="/" component={SignIn} />
          <Fragment>
            <Sidebar>
              <PrivateRoute path="/createRecipe" component={Recipe} />
              <PrivateRoute path="/editRecipe:id" component={RecipeEditForm} />
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <PrivateRoute path="/recipesList" component={RecipesList} />
              <PrivateRoute path="/recipeView:id" component={RecipeView} />
              <PrivateRoute path="/chefsList" component={ChefsList} />
              <PrivateRoute path="/editChefs" component={ChefsList} />
              <PrivateRoute path="/workersList" component={WorkersList} />
              <PrivateRoute path="/edit/:type/:id" component={EditChef} />
              <PrivateRoute path="/ingredients" component={Ingredients} />
            </Sidebar>
          </Fragment>
        </Switch>
      </div>
    </Router>
  );
};

export default Routing;
