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
                {
                    path:`/Meals(${oEvent.getParameters().arguments.ID})`, 
                    parameters: {
                        $expand: {"ingredient": {'$expand': 'ingredient'}}
                    }
                })
            
        },
        /*=========================
        * Dialog select nutrients
        =========================*/

        onSelectNutrientDialogPress () {
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

        addNutrient(aNutrients){
            aNutrients.forEach(element => {
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
                    this.getView().byId('ingredientsList').getBinding('items').getContext().refresh()
                })
            })
            
            
        },

        confirmNutrientSelection(oEvent){
            const selectedItems = []
            //LIST
            this.getView().byId('ProductList').getSelectedItems().forEach((element) => {
                    selectedItems.push(element.getBindingContext().getObject())
                })
            
            //SELECTDIALOG
            // oEvent.getParameter('selectedItems').forEach((element, index) => {
            //     selectedItems[index] = element.getBindingContext().getObject()
            // })
            this.addNutrient(selectedItems)
            oEvent.getSource().getParent().close() //close dialog
        },


        /*=========================
        * Dialog to create a new nutrient
        =========================*/
        
        openCreateNewNutrientDialog(){
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

        confirmNewNutrient(oEvent){
            const oDialog = oEvent.getSource().getParent()
            const nutrient = oEvent.getSource().getBindingContext().getModel().oData
            const oIngredientsContext = this.getView().byId('allIngredients').getBinding('items').create({
                meal:[{meal_ID: `${this.getView().getBindingContext().getObject().ID}`}],
                "name": nutrient.name,
                "energy": parseInt(nutrient.energy),
                "proteins": parseInt(nutrient.proteins),
                "carbs": parseInt(nutrient.carbs),
                "fats": parseInt(nutrient.fats),
                "fiber": parseInt(nutrient.fibers)
            })
            oIngredientsContext.created().then(()=>{
                this.getView().byId('ingredientsList').getBinding('items').getContext().refresh()
                // this.getView().byId('ProductList').getBinding('items').refresh() //reload other oDialog
                oDialog.close()
            })
        },

        cancelDialog(oEvent){
            oEvent.getSource().getParent().close() //close dialog
        }

    });
});
