/*global sap*/

sap.ui.define(["tm/nutriTracker/myUI5App/controller/BaseController",
"sap/ui/core/Fragment"],
function (Controller, Fragment) {
    "use strict";

    return Controller.extend("tm.nutriTracker.myUI5App.controller.DetailView", {

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
        addNutrientToMeal(aNutrients){
            //first create a nutrient in its own table
            
            
            
        },
        openNewNutrientDialog(){
            const oView = this.getView()
			if (!this._newNutrientDialog) {
				this._newNutrientDialog = Fragment.load({
					id: oView.getId(),
					name: "tm.nutriTracker.myUI5App.view.newNutrientDialog",
					controller: this
				}).then(function (oDialog){
					oDialog.setModel(oView.getModel('newNutrient'))
                    oDialog.bindElement('/')
					return oDialog;
				});
			}

			this._newNutrientDialog.then((oDialog) => {
				oDialog.open();
			})
        },
        onSelectDialogPress (oEvent) {
			const oView = this.getView()

			if (!this._pDialog) {
				this._pDialog = Fragment.load({
					id: oView.getId(),
					name: "tm.nutriTracker.myUI5App.view.IngredientDialog",
					controller: this
				}).then(function (oDialog){
					oDialog.setModel(oView.getModel());
					return oDialog;
				});
			}

			this._pDialog.then((oDialog) => {
				oDialog.open();
			})

		},
        confirmNutrientSelection(oEvent){
            const oDialog = oEvent.getSource().getParent()
            const mealID = this.getView().getBindingContext().getObject().ID
            const aNutrients = []
            this.getView().byId('ProductList').getSelectedItems().forEach((element, index) => {
                aNutrients[index] = element.getBindingContext().getObject()
            })
            // const nutrientID = oEvent.getParameter('selectedItem').getBindingContext().getObject().ID
            // this.addNutrientToMeal(aNutrients)
            aNutrients.forEach(element => {
                //add entry in mapping table //TODO update meal itself and add entry in mapping table?
                const oIngredientsContext = this.getView().byId('ingredientInMeal').getBinding('items').create(
                    {
                    meal_ID: mealID, ingredient_ID: element.ID
                    // ingredient: {meal_ID: mealID}
                })
                oIngredientsContext.created().then( () => {
                    //reload the table on the objec page
                    this.getView().byId('ingredientsList').getBinding('items').refresh()
                })
            })
            oDialog.close()
        },
        cancelDialog(oEvent){
            oEvent.getSource().getParent().close() //close dialog
        },
        confirmNewNutrient(oEvent){
            const oDialog = oEvent.getSource().getParent()
            const nutrient = oEvent.getSource().getBindingContext().getModel().oData
            const oIngredientsContext = this.getView().byId('allIngredients').getBinding('items').create({
                meal:[{}],
                "name": nutrient.name,
                "energy": parseInt(nutrient.energy),
                "proteins": parseInt(nutrient.proteins),
                "carbs": parseInt(nutrient.carbs),
                "fats": parseInt(nutrient.fats),
                "fiber": parseInt(nutrient.fibers)
            })
            oIngredientsContext.created().then(()=>{
                this.getView().byId('ProductList').getBinding('items').refresh() //reload other oDialog
                oDialog.close()
            })
        },
        // confirmNutrientSelection(oEvent){
        //     const oIngredientsContext = this.getView().byId('ingredientInMeal').getBinding('items').create({
        //         meal_ID: `${hallo}`,
        //         ingredient_ID:`${hallo}`
        //     })
        //     oIngredientsContext.created().then(()=>{
        //         this.getView().byId('ProductList').getBinding('items').refresh() //reload other oDialog
        //         oDialog.close()
        //     })
        // }

    });
});
