/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
    "use strict";

    sap.ui.require(["tm/nutriTracker/myUI5App/test/integration/AllJourneys"], function () {
        QUnit.start();
    });
});
