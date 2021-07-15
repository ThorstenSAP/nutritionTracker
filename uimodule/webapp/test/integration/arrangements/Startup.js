sap.ui.define(["sap/ui/test/Opa5"], function (Opa5) {
    "use strict";

    return Opa5.extend("tm.nutriTracker.myUI5App.test.integration.arrangements.Startup", {
        iStartMyApp: function () {
            this.iStartMyUIComponent({
                componentConfig: {
                    name: "tm.nutriTracker.myUI5App",
                    async: true,
                    manifest: true
                }
            });
        }
    });
});
