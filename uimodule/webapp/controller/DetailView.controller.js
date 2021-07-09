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
        addNutrient(aNutrients){
            //first create a nutrient in its own table
            aNutrients.forEach(element => {
                //TODO add existing nutrient in mapping table, not in nutrients table
                //get nutrition information from Dialog
                const oIngredientsContext = this.getView().byId('allIngredients').getBinding('items').create({
                    meal:[{meal_ID: `${this.getView().getBindingContext().getObject().ID}`}],
                    "name": element.name,
                    "energy": element.energy,
                    "proteins": element.proteins,
                    "carbs": element.carbs,
                    "fats": element.fats,
                    "fiber": element.fiber
                })
                oIngredientsContext.created().then( () => {
                    //Then create the entry in the mapping table with both the IDs
                    // const oContext = this.getView().byId('ingredientsList').getBinding('items').create({})
                    // oContext.created().then(
                    //     () => {
                    //         console.log('nutrient created')
                    //     }
                    // )
                })
            })
            
            
        },
        addNewNutrient(){
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
        onDialogConfirm(oEvent){
            const selectedItemIDs = []
            oEvent.getParameter('selectedItems').forEach((element, index) => {
                selectedItemIDs[index] = element.getBindingContext().getObject()
            })
            // const nutrientID = oEvent.getParameter('selectedItem').getBindingContext().getObject().ID
            this.addNutrient(selectedItemIDs)
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
        }

    });
});
