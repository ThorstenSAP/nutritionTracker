# Nutrition Tracker
A standalone app which allows you to get an overview of the nutrition values of your meals. The project uses a cap app as an OData service. For the UI different technologies will be tested.

## Branches
- master => main Branch; UI developed with UI5 - the database layer uses associations for the connection between the tables
- feature/UI5UI => UI developed with UI5 - the database layer uses compositions for the connection between the tables.
- feature/FioriUI => UI based on Fiori Elements
- feature/capUI => UI build with cds-view annotations for cap

## Start the app
- npm i
- npm run deploy_db (to use the database)
- npm start