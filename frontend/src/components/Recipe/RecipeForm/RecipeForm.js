import React, { useState } from "react";
import "./RecipeForm.scss";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, InputLabel, FormGroup } from "@material-ui/core";
import { Formik } from "formik";
import http from "../../../services/httpService";
import { AddRounded } from "@material-ui/icons";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import SnackbarPop from "../../SharedComponents/SnackbarPop/SnackbarPop";
import { useHistory } from "react-router-dom";

const RecipeForm = () => {
    const history = useHistory();
    const useStyles = makeStyles((theme) => ({
        root: {
            "& .MuiTextField-root": {
                margin: theme.spacing(5),
                display: "block",
            },
        },
    }));

    const classes = useStyles();

    const [selectedFiles, setSelectedFile] = React.useState([]);
    const [error, setError] = React.useState(false);
    const [renderSnack, setRenderSnack] = useState();
    const [helperText, setHelperText] = React.useState(false);
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const userName = JSON.parse(localStorage.getItem("user")).username;

    const fileToBase64 = async (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (e) => reject(e);
        });

    const handleCapture = (event) => {
        const files = event.target.files;
        for (let x = 0; x < files.length; x++) {
            fileToBase64(files[x]).then((res) => {
                setSelectedFile((prevState) => [...prevState, { url: res }]);
            });
        }
    };

    const deleteImage = (value) => {
        const newArray = selectedFiles.filter(
            (selectedFile, index) => index !== value
        );
        setSelectedFile(newArray);
    };

    function onKeyDown(keyEvent) {
        if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
            keyEvent.preventDefault();
        }
    }

    console.log(userId, userName);
    return (
        <>
            <div className={"recipe-container"}>
                <Formik
                    initialValues={{
                        ingredients: [{ ingredient: "", quantity: "" }],
                        recipeSteps: [{ step: "" }],
                        images: [],
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        if (!values.recipeName) {
                            setError(true);
                            setHelperText("Required");
                        }
                        values.images = selectedFiles;
                        values.userId = userId;
                        values.userName = userName;

                        console.log(values);
                        http
                            .post("/recipes/add", values)
                            .then((response) => {
                                setRenderSnack(
                                    <SnackbarPop
                                        isOpen={true}
                                        message={response.data}
                                        target={"/recipesList"}
                                        severity={"success"}
                                    />
                                );
                            })
                            .catch((error) => {
                                setRenderSnack(
                                    <SnackbarPop
                                        isOpen={true}
                                        message={JSON.stringify(error.response.data.message)}
                                        severity={"error"}
                                    />
                                );
                            });
                    }}
                >
                    {({ handleChange, handleSubmit, setFieldValue, values }) => {
                        console.log("formikvalues", values);
                        const { ingredients } = values;
                        const { recipeSteps } = values;
                        const handleValueChange = (value, index, name) => {
                            let previousValues = [...ingredients];
                            previousValues[index][name] = value;
                            setFieldValue("ingredients", previousValues);
                        };
                        const handleRecipeStepsValueChange = (value, index, name) => {
                            let previousValues = [...recipeSteps];
                            previousValues[index][name] = value;
                            setFieldValue("recipeSteps", previousValues);
                        };
                        const handleAddRow = () => {
                            setFieldValue("ingredients", [
                                ...ingredients,
                                { ingredient: "", quantity: "" },
                            ]);
                        };
                        const handleAddRecipeSteps = () => {
                            setFieldValue("recipeSteps", [...recipeSteps, { step: "" }]);
                        };
                        return (
                            <form
                                className={classes.root}
                                noValidate
                                autoComplete="off"
                                onKeyDown={onKeyDown}
                                onSubmit={handleSubmit}
                            >
                                <Grid container spacing={5}>
                                    <Grid item xs={12} sm={12} md={6}>
                                        <TextField
                                            required={true}
                                            helperText={helperText}
                                            error={error}
                                            name="recipeName"
                                            id="recipeName"
                                            label="Recipe Name"
                                            type="text"
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            name="recipeDescription"
                                            id="recipeDescription"
                                            label="Recipe Description"
                                            type="textArea"
                                            multiline
                                            rows={5}
                                            fullWidth
                                            rowsMax={8}
                                            onChange={handleChange}
                                        />
                                        <InputLabel
                                            style={{
                                                paddingLeft: "40px",
                                                fontSize: "18px",
                                                fontWeight: "bold",
                                                color: "black",
                                            }}
                                        >
                                            Add Ingredients
                                        </InputLabel>
                                        {ingredients && ingredients.length
                                            ? ingredients.map((row, rowIndex) => {
                                                return (
                                                    <FormGroup>
                                                        <Grid container spacing={0} key={rowIndex}>
                                                            <Grid item xs={12} sm={12} md={6}>
                                                                <TextField
                                                                    value={row.ingredient}
                                                                    id={rowIndex}
                                                                    type="text"
                                                                    placeholder={"Ingredient"}
                                                                    onChange={(e) =>
                                                                        handleValueChange(
                                                                            e.target.value,
                                                                            rowIndex,
                                                                            "ingredient"
                                                                        )
                                                                    }
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={12} md={6}>
                                                                <TextField
                                                                    value={row.quantity}
                                                                    id={rowIndex}
                                                                    type="text"
                                                                    placeholder={"Quantity"}
                                                                    onChange={(e) =>
                                                                        handleValueChange(
                                                                            e.target.value,
                                                                            rowIndex,
                                                                            "quantity"
                                                                        )
                                                                    }
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </FormGroup>
                                                );
                                            })
                                            : null}
                                        <Button
                                            onClick={handleAddRow}
                                            className={"add-more"}
                                            style={{ paddingLeft: "40px", bottom: "25px" }}
                                        >
                                            Add More +
                                        </Button>
                                        <div className="recipe-steps">
                                            <InputLabel
                                                style={{
                                                    paddingLeft: "40px",
                                                    fontSize: "18px",
                                                    fontWeight: "bold",
                                                    color: "black",
                                                }}
                                            >
                                                How To Make
                                            </InputLabel>
                                            {recipeSteps && recipeSteps.length
                                                ? recipeSteps.map((steps, stepIndex) => {
                                                    return (
                                                        <FormGroup>
                                                            <TextField
                                                                id={stepIndex}
                                                                type="text"
                                                                placeholder={`Step ${stepIndex + 1}`}
                                                                onChange={(e) =>
                                                                    handleRecipeStepsValueChange(
                                                                        e.target.value,
                                                                        stepIndex,
                                                                        `step`
                                                                    )
                                                                }
                                                            />
                                                        </FormGroup>
                                                    );
                                                })
                                                : null}
                                            <Button
                                            id="add-ingredients"
                                                onClick={handleAddRecipeSteps}
                                                className="add-more"
                                                style={{ paddingLeft: "40px", bottom: "25px" }}
                                            >
                                                Add More +
                                            </Button>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6}>
                                        <TextField
                                            name="recipeServings"
                                            id="recipeServings"
                                            label="Recipe Servings"
                                            type="text"
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            name="prepTime"
                                            id="prepTime"
                                            label="Prep Time"
                                            type="text"
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            name="cookTime"
                                            id="cookTime"
                                            label="Cook Time"
                                            type="text"
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            name="totalCookTime"
                                            id="totalCookTime"
                                            label="Total Cook Time"
                                            type="text"
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            name="difficultyLevel"
                                            id="difficultyLevel"
                                            label="Difficulty Level"
                                            type="text"
                                            placeholder={"Difficulty Level"}
                                            onChange={handleChange}
                                        />
                                        <Grid>
                                            {selectedFiles &&
                                                selectedFiles.map((item, index) => {
                                                    return (
                                                        <>
                                                            <img
                                                                src={item.url}
                                                                style={{
                                                                    border: "1px solid grey",
                                                                    borderRadius: "10px",
                                                                    width: "150px",
                                                                    height: "100px",
                                                                    marginLeft: "10px",
                                                                }}
                                                                key={index}
                                                            />
                                                            <DeleteForeverIcon
                                                                style={{
                                                                    position: "absolute",
                                                                    marginLeft: "-30px",
                                                                    marginTop: "5px",
                                                                    color: "red",
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={() => deleteImage(index)}
                                                            />
                                                        </>
                                                    );
                                                })}
                                            <Button
                                                component="label"
                                                className={"upload-file-box"}
                                                style={{
                                                    border: "1px solid grey",
                                                    borderRadius: "10px",
                                                    width: "150px",
                                                    height: "100px",
                                                    marginLeft: "10px",
                                                    marginBottom: "90px",
                                                }}
                                            >
                                                <div style={{ textAlign: "center" }}>
                                                    <AddRounded
                                                        style={{
                                                            background: "blue",
                                                            color: "white",
                                                            height: "40px",
                                                            width: "40px",
                                                            borderRadius: "50%",
                                                        }}
                                                    />
                                                    <br />
                                                    Add Picture
                                                </div>
                                                <input
                                                    type="file"
                                                    hidden
                                                    multiple
                                                    onChange={handleCapture}
                                                />
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <div style={{ paddingTop: "10px" }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        data-testid="Publish-btn"
                                        style={{
                                            marginLeft: "40px",
                                            width: "200px",
                                            height: "50px",
                                        }}
                                    >
                                        Publish
                                    </Button>
                                </div>
                            </form>
                        );
                    }}
                </Formik>
                {renderSnack}
            </div>
        </>
    );
};

export default RecipeForm;
