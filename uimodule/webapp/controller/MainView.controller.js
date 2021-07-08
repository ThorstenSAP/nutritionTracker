/*global sap*/

sap.ui.define(["tm/nutriTracker/myUI5App/controller/BaseController"], function (Controller) {
    "use strict";

    return Controller.extend("tm.nutriTracker.myUI5App.controller.MainView", {

        //navigate to the detail page
        displayNutriDetails (oEvent) {
            this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded")
            this.getRouter().navTo('NutriDetailView', {ID: oEvent.getSource().getBindingContext().getObject().ID})
        },

        addMeal(){
            const oContext = this.getView().byId('mealsList').getBinding('items').create({})
            oContext.created().then(
                () => {
                    this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded")
                    this.getRouter().navTo('NutriDetailView', {ID: oContext.getObject().ID})
                }
            )
        }
    });
});
