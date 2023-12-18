import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import http from "../../services/httpService";
import { useHistory } from "react-router-dom";
import { Button, Menu, MenuItem } from "@material-ui/core";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  title: {
    paddingBottom: "15px",
  },
});

const RecipesList = () => {
  const history = useHistory();
  const classes = useStyles();
  const [recipes, setRecipes] = useState();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [actionId, setActionId] = React.useState(null);
  const userType = JSON.parse(localStorage.getItem("user")).type;
  useEffect(() => {
    http.get("/recipes/").then((response) => {
      const recipesData = response.data;
      console.log(recipesData);
      setRecipes(recipesData);
    });
  }, []);

  const handleClick = (event, id) => {
    setActionId(id);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEdit = (event, id) => {
    history.push(`/editRecipe${id}`);
  };
  const handleView = (event, id) => {
    history.push(`/recipeView${id}`);
  };
  const handleDelete = (event, id) => {
    http.delete(`/recipes/${id}`).then((response) => {
      alert("Recipe deleted");
      http.get("/recipes/").then((response) => {
        const recipesData = response.data;
        console.log(recipesData);
        setRecipes(recipesData);
        setAnchorEl(null);
      });
    });
  };

  return (
    <>
      <Typography
        className={classes.title}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Recipes
      </Typography>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Recipe Name</TableCell>
              <TableCell align="right">Recipe Description</TableCell>
              <TableCell align="right">Recipe Servings</TableCell>
              <TableCell align="right">Prep Time</TableCell>
              <TableCell align="right">Cook Time</TableCell>
              <TableCell align="right">Total Cook Time</TableCell>
              <TableCell align="right">Difficulty Level</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recipes?.map((row, index) => {
              return (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {row.recipeName}
                  </TableCell>
                  <TableCell align="right">{row.recipeDescription}</TableCell>
                  <TableCell align="right">{row.recipeServings}</TableCell>
                  <TableCell align="right">{row.prepTime}</TableCell>
                  <TableCell align="right">{row.cookTime}</TableCell>
                  <TableCell align="right">{row.totalCookTime}</TableCell>
                  <TableCell align="right">{row.difficultyLevel}</TableCell>
                  <TableCell align="right">
                    <Button onClick={(event) => handleClick(event, row.id)}>
                      Actions
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={(event) => handleView(event, actionId)}
                style={{ cursor: "pointer" }}
              >
                View
              </MenuItem>
              {userType === "chef" ? (
                <>
                  <MenuItem
                    onClick={(event) => handleEdit(event, actionId)}
                    style={{ cursor: "pointer" }}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem
                    onClick={(event) => handleDelete(event, actionId)}
                    style={{ cursor: "pointer" }}
                  >
                    Delete
                  </MenuItem>
                </>
              ) : (
                ""
              )}
            </Menu>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default RecipesList;
