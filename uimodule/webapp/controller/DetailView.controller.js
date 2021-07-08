/*global sap*/

sap.ui.define(["tm/nutriTracker/myUI5App/controller/BaseController",],
function (Controller) {
    "use strict";

    return Controller.extend("tm.nutriTracker.myUI5App.controller.MainView", {

        onInit() {
            this.getRouter().getRoute("NutriDetailView").attachPatternMatched(this._onRouteMatched, this)
        },

        _onRouteMatched(oEvent){
            this.getView().bindElement({path:`/Meals(${oEvent.getParameters().arguments.ID})`})
            
            //sets the binding context with a double expand => /Meals(...)?$expand=ingredient($expand=ingredient)
            this.getView().byId('ingredientsList').bindElement(
                {path:`/Meals(${oEvent.getParameters().arguments.ID})`, 
                    parameters: {
                        $expand: {"ingredient": {'$expand': 'ingredient'}}
                    }
                })

            
        },
        addNutrient(){
            //first create a nutrient in its own table
            //TODO get nutrition information from Dialog
            let oIngredientsContext = this.getView().byId('allIngredients').getBinding('items').create({
                meal:[{meal_ID: `${this.getView().getBindingContext().getObject().ID}`}],
                "name": "Apple",
                "energy": 10,
                "proteins": 5,
                "carbs": 2,
                "fats": 4,
                "fiber": 15
            })
            oIngredientsContext.created().then( () => {
                //Then create the entry in the mapping table with both the IDs
                let oContext = this.getView().byId('ingredientsList').getBinding('items').create({})
                oContext.created().then(
                    () => {
                        console.log('nutrient created')
                    }
                )
            })
            
        }
    });
});
