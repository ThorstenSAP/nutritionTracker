/*global sap*/

sap.ui.define(["tm/nutriTracker/myUI5App/controller/BaseController",
"sap/m/Dialog",
"sap/m/DialogType",
"sap/m/Input",
"sap/m/Button"], function (Controller, Dialog, DialogType, Input, Button) {
    "use strict";

    return Controller.extend("tm.nutriTracker.myUI5App.controller.MainView", {
        //navigate to the detail page
        displayNutriDetails (oEvent) {
            this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded")
            this.getRouter().navTo('NutriDetailView', {ID: oEvent.getSource().getBindingContext().getObject().ID})
        },

        addMeal(sName){
            const oContext = this.getView().byId('mealsList').getBinding('items').create({
                "name": sName
            })
            oContext.created().then(
                () => {
                    this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded")
                    this.getRouter().navTo('NutriDetailView', {ID: oContext.getObject().ID})
                }
            )
        },
        openNewMealDialog(){
            if(!this._newMealDialog){
                this._newMealDialog = new Dialog('newMealDialog', {
                    type: DialogType.Message,
                    title: this.getView().getModel("i18n").getResourceBundle().getText("NewMealDialog.Title"),
                    content: [
                        new Input("newMealName", {
                            liveChange: (oEvent) => {
                                let sText = oEvent.getParameter("value");
                                this._newMealDialog.getBeginButton().setEnabled(sText.length > 0);
                            }
                        })
                    ],
                    beginButton: new Button({
                        text: this.getView().getModel("i18n").getResourceBundle().getText("Dialog.Button.Submit"),
                        enabled: false,
                        press: () => {
                            const sText = sap.ui.getCore().byId("newMealName").getValue()
                            sap.ui.getCore().byId("newMealName").setValue('') //clear input field
                            this.addMeal(sText)
                            this._newMealDialog.close();
                        }
                    }),
                    endButton: new Button({
                        text: this.getView().getModel("i18n").getResourceBundle().getText("Dialog.Button.Cancel"),
                        press: () => {
                            sap.ui.getCore().byId("newMealName").setValue('')
                            this._newMealDialog.close();
                        }
                    })
                });
            }
            this._newMealDialog.open()
        }
    });
});
