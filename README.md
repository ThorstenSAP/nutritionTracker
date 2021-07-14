# Nutrition Tracker
A standalone app which allows you to get an overview of the nutrition values of your meals. The project uses a cap app as an OData service. For the UI different technologies will be tested.

## Branches
- feature/UI5UI => main Branch; development with SAP UI5
    - feature/association => uses association instead of compositions on a database layer. To use the associations, the database tables have to be filled with at least one sample entry. Otherwise the referential integrity is not provided and no data can be added.
- feature/FioriUI => UI based on Fiori Elements
- feature/capUI => UI build with cds-view annotations for cap

## Start the app
- npm i
- npm run deploy_db (to use the database)
- npm start