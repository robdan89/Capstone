import React, { useState, useEffect } from "react";

/*
    The context is imported and used by individual components
    that need data
*/
export const MealContext = React.createContext();

/*
 This component establishes what data can be used.
 */
export const MealProvider = (props) => {
  const [meals, setMeals] = useState([]);

  const getMeals = () => {
    return fetch("http://localhost:8088/meals")
      .then((res) => res.json())
      .then(setMeals);
  };

  const addMeal = (meal) => {
    return fetch("http://localhost:8088/meals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(meal),
    }).then(getMeals);
  };

  const updateMeal = (meal) => {
    return fetch(`http://localhost:8088/meals/${meal.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(meal),
    }).then(getMeals);
  };
  const releaseMeal = (mealId) => {
    return fetch(`http://localhost:8088/meals/${mealId}`, {
      method: "DELETE",
    }).then(getMeals);
  };

  /*
        Load all Meals when the component is mounted. Ensure that
        an empty array is the second argument to avoid infinite loop.
    */
  useEffect(() => {
    getMeals();
  }, []);

  useEffect(() => {
    console.log("****  Meal APPLICATION STATE CHANGED  ****");
  }, [meals]);

  return (
    <MealContext.Provider
      value={{
        meals,
        addMeal,
      }}
    >
      {props.children}
    </MealContext.Provider>
  );
};