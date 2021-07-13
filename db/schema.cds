namespace tm.nutriTracker;

using { cuid, managed } from '@sap/cds/common';

entity Meals : managed, cuid {
    name:           String;
    dateEaten:      DateTime;
    energy:         Integer;
    proteins:        Integer;
    carbs:          Integer;
    fats:           Integer;
    fibers:          Integer;
    ingredient:     Composition of  many IngredientInMeal on ingredient.meal=$self;
}

entity Ingredients: managed, cuid {
    meal:           Composition of  many IngredientInMeal on meal.ingredient=$self;
    name:           String;
    energy:         Integer;
    proteins:        Integer;
    carbs:          Integer;
    fats:           Integer;
    fiber:          Integer;

}
entity IngredientInMeal {
    key meal: Association to  Meals;
    key ingredient: Association to  Ingredients;
}