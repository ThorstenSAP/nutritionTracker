sap.ui.define([
    "tm/nutriTracker/myUI5App/controller/BaseController",
    "sap/ui/core/Element"
  ], function(Controller, Element) {
    "use strict";
  
    return Controller.extend("tm.nutriTracker.myUI5App.controller.App", {
        onInit(){
          console.log(Element.registry.all())
          
        },
        onAfterRendering(){
          console.log(Element.registry.all())
        }
    });
    });  