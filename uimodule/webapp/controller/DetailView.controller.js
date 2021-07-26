/*global sap*/

sap.ui.define(["tm/nutriTracker/myUI5App/controller/BaseController",
"sap/ui/core/Fragment",
"sap/ui/core/Element",
"./jqOnScreenKeyboard",],
function (Controller, Fragment, Element) {
    "use strict";

    return Controller.extend("tm.nutriTracker.myUI5App.controller.DetailView", {

        onInit() {
            this.getRouter().getRoute("NutriDetailView").attachPatternMatched(this._onRouteMatched, this)
        },
        onAfterRendering(){
            $(document).ready(function(){
                // Set NumPad defaults for jQuery mobile. 
                // These defaults will be applied to all NumPads within this document!
                $.fn.numpad.defaults.gridTpl = '<table class="table modal-content"></table>';
                $.fn.numpad.defaults.backgroundTpl = '<div class="modal-backdrop in"></div>';
                $.fn.numpad.defaults.displayTpl = '<input type="text" class="form-control  input-lg" />';
                $.fn.numpad.defaults.buttonNumberTpl =  '<button type="button" class="btn btn-default btn-lg"></button>';
                $.fn.numpad.defaults.buttonFunctionTpl = '<button type="button" class="btn btn-lg" style="width: 100%;"></button>';
                $.fn.numpad.defaults.onKeypadCreate = function(){$(this).find('.done').addClass('btn-primary');};




                const inputFields = $('input')
                const inputFieldsLength = inputFields.length
                for (let i=0; i< inputFieldsLength; i++){
                    $(`#${inputFields[i].id}`).numpad()
                    // $(inputFields[i]).click((Event) => {
                    //     $(`#${Event.currentTarget.id}`).numpad()
                    // })
                    // $(inputFields[i]).on("click", () => {
                    //     // $(inputFields[i]).onScreenKeyboard()
                    //     $(inputFields[i]).numpad()
                    // }
                    // )
                }
            })
            

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

        openCaclulator(oEvent){
            const oView = this.getView()

			if (!this._calcDialog) {
				this._calcDialog = Fragment.load({
					id: oView.getId(),
					name: "tm.nutriTracker.myUI5App.view.Calculator",
					controller: this
				}).then(function (oDialog){
                    oView.getModel('calc').setProperty('/test', "")
					oDialog.setModel(oView.getModel('calc'))
                    oDialog.bindElement('/')
					return oDialog;
				});
			}

			this._calcDialog.then((oDialog) => {
				oDialog.open();
			})
        },
        addDigitToInput(oEvent){
            //attach new value
            this.getView().getModel('calc').setProperty('/test', this.getView().getModel('calc').getProperty('/test')+oEvent.getSource().data('value'))
        },
        cancelCalculatorDialog(oEvent){
            //clear value and close dialog
            this.getView().getModel('calc').setProperty('/test', "")
            this.cancelDialog(oEvent)

        },
        confirmCalculator(oEvent){
            //write data into the other model
            this.getModel('newNutrient').setProperty('/energy', this.getModel('calc').getProperty('/test'))
            this.getView().getModel('calc').setProperty('/test', "")
            this.cancelDialog(oEvent)
        },



    });
});
