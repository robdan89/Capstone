import React, { useContext, useRef, useState, useEffect } from "react";
import { DietContext } from "../../meals/DietProvider";
import { MealTypeContext } from "../../meals/MealTypeProvider";
import { MealContext } from "../../meals/MealProvider";
import IngredientList from "./IngredientList";
import { MealFoodsContext } from "../../meals/MealFoodsProvider";
import { UserMealContext } from "../../meals/UserMealsProvider";
import { MealQuantityContext } from "../MealQuantityProvider";

export default ({ addIngredient, ingredients, removeIngredient }) => {
  const { diets } = useContext(DietContext);
  const { addMeal } = useContext(MealContext);
  const { getMeals } = useContext(MealContext);
  const { mealTypes } = useContext(MealTypeContext);
  const { addUserMeal } = useContext(UserMealContext);
  const { addMealFood } = useContext(MealFoodsContext);
  const { quantities } = useContext(MealQuantityContext);

  const [calories, setCalories] = useState(0);

  const [protein, setProtein] = useState(0);

  const [fat, setFat] = useState(0);

  const [carbohydrate, setCarbohydrate] = useState(0);

  const [sugar, setSugar] = useState(0);

  const updateMacros = (totals) => {
    const total = totals.reduce(
      (acc, curr) => {
        return {
          calories: (curr.calories += acc.calories),
          sugar: (curr.sugar += acc.sugar),
          carbohydrate: (curr.carbohydrate += acc.carbohydrate),
          protein: (curr.protein += acc.protein),
          fat: (curr.fat += acc.fat),
        };
      },
      { calories: 0, sugar: 0, carbohydrate: 0, protein: 0, fat: 0 }
    );
    setCalories(total.calories);
    setSugar(total.sugar);
    setCarbohydrate(total.carbohydrate);
    setProtein(total.protein);
    setFat(total.fat);
  };

  useEffect(() => {
    let totals = [];
    ingredients.forEach((ingredient) => {
      const cal = ingredient.calories;
      const pro = ingredient.protein;
      const f = ingredient.fat;
      const carb = ingredient.carbohydrate;
      const sug = ingredient.sugar;
      const quantity = quantities[ingredient.id];
      totals.push({
        calories: cal * quantity,
        protein: pro * quantity,
        fat: f * quantity,
        carbohydrate: carb * quantity,
        sugar: sug * quantity,
      });
    });
    updateMacros(totals);
  }, [ingredients, quantities]);

  const name = useRef();
  const dietType = useRef();
  const mealType = useRef();
  const description = useRef();

  const constructNewMealObj = () => {
    const chosenDietTypeId = parseInt(dietType.current.value);
    const chosenMealTypeId = parseInt(mealType.current.value);
    const chosenCalories = calories;
    const chosenProtein = protein;
    const chosenFat = fat;
    const chosenCarbohydrate = carbohydrate;
    const chosenSugar = sugar;

    if (name === "") {
      window.alert("Please name your meal");
    } else if (chosenDietTypeId === 0) {
      window.alert("Please select a diet type");
    } else if (chosenMealTypeId === 0) {
      window.alert("Please select a meal type");
    } else {
      addMeal({
        name: name.current.value,
        dietId: chosenDietTypeId,
        MealTypeId: chosenMealTypeId,
        calories: chosenCalories,
        protein: chosenProtein,
        fat: chosenFat,
        carbohydrate: chosenCarbohydrate,
        sugar: chosenSugar,
        description: description.current.value,
      })
        .then(constructNewMealFoodsObj)
        .then(getMeals);
      // figure out also how to reset form back to default
    }
  };
  // When we save a new meal we also want to save a new mealFood object for each ingredient in the meal.
  const constructNewMealFoodsObj = (meal) => {
    ingredients.map((ing) => {
      const quantity = quantities[ing.id];
      // This MealFoodObject is going to need the ID of the meal we just saved above...
      addMealFood({
        foodId: ing.id,
        mealId: meal.id,
        quantity: quantity,
      });
    });
    // When we save a new meal we also want to save a new userMeal object, incase one meal can be owned by many users later on.

    addUserMeal({
      userId: parseInt(localStorage.getItem("pal_id")),
      mealId: meal.id,
    });
  };

  return (
    <form className="mealMakerForm">
      <h1 className="mealMakerForm__title">Meal Maker</h1>
      <br></br>
      {/* Display list of ingredient */}
      <fieldset>
        <div className="form-group">
          <h4 htmlFor="Ingredients">Ingredients: </h4>
          {
            <IngredientList
              addIngredient={addIngredient}
              ingredients={ingredients}
              removeIngredient={removeIngredient}
            />
          }
        </div>
      </fieldset>

      {/* Display Total nutrients */}
      <fieldset>
        <div className="form-group">
          <h4 htmlFor="Nutriens">Total Nutrients: </h4>
          <section>
            <div className="calories">Calories: {calories}</div>
            <div className="protein">Protein: {protein}g</div>
            <div className="fat">Fat: {fat}g</div>
            <div className="carbohydrate">Carbohydrate: {carbohydrate}g</div>
            <div className="sugar">Sugar: {sugar}g</div>
          </section>
        </div>
      </fieldset>

      {/* Give 'er a name */}
      <fieldset>
        <div className="form-group">
          <label htmlFor="mealName">Name: </label>
          <input
            type="text"
            id="mealName"
            ref={name}
            required
            autoFocus
            className="form-control"
            placeholder="Meal name"
          />
        </div>
      </fieldset>
      {/* Dropdown to choose Diet Type */}
      <fieldset>
        <div className="form-group">
          <label htmlFor="DietType">Diet Type: </label>
          <select
            defaultValue=""
            name="dietType"
            ref={dietType}
            id="dietype"
            className="form-control"
          >
            <option value="0">choose one</option>
            {diets.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
      </fieldset>
      {/* Dropdown to choose Meal Type */}
      <fieldset>
        <div className="form-group">
          <label htmlFor="mealype">Meal Type: </label>
          <select
            defaultValue=""
            name="mealType"
            ref={mealType}
            id="mealType"
            className="form-control"
          >
            <option value="0">choose one</option>
            {mealTypes.map((e) => (
              <option key={e.id} value={e.id}>
                {e.type}
              </option>
            ))}
          </select>
        </div>
      </fieldset>
      {/* Enter in a description */}
      <fieldset>
        <div className="form-group">
          <label htmlFor="description">Description: </label>
          <textarea
            type="text"
            id="description"
            ref={description}
            required
            autoFocus
            className="form-control"
            placeholder="Description"
          />
        </div>
      </fieldset>
      {/* button to construct new meal object and save to meals */}
      <button
        type="submit"
        onClick={(evt) => {
          evt.preventDefault(); // Prevent browser from submitting the form
          constructNewMealObj();
        }}
        className="btn btn-primary"
      >
        Save Meal
      </button>
    </form>
  );
};
