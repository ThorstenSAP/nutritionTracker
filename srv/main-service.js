const cds = require('@sap/cds')
module.exports = function (){

    this.before('CREATE', 'Meals', async (req) => {
        //update nutrition values if not provided or valued as null
        if (! req.data.carbs || req.data.carbs == null)
            req.data.carbs = 0
        if (! req.data.fats || req.data.fats == null)
            req.data.fats = 0
        if (! req.data.proteins || req.data.proteins == null)
            req.data.proteins = 0
        if (! req.data.fibers || req.data.fibers == null)
            req.data.fibers = 0
        if (! req.data.energy || req.data.energy == null)
            req.data.energy = 0

        //update date
        if (! req.data.dateEaten || req.data.dateEaten == null)
            req.data.dateEaten = new Date().toISOString()
    })
    
    this.after ('CREATE', 'Ingredients', async (req, res) => {
        const { Meals } = cds.entities
        let mealID = req.meal[0].meal_ID
        let query = SELECT.from(Meals).where({ID:mealID})
        let meal = await cds.run (query)

        //update database entry if required
        if(req.energy !== null && req.energy !== 0)
            await UPDATE (Meals) .where('ID =', mealID).set (`energy +=`, req.energy) 
        
        if(req.proteins !== null && req.proteins !== 0)
            await UPDATE (Meals) .where('ID =', mealID).set (`proteins +=`, req.proteins) 
        
        if(req.carbs !== null && req.carbs !== 0)
            await UPDATE (Meals) .where('ID =', mealID).set (`carbs +=`, req.carbs) 
        
        if(req.fats !== null && req.fats !== 0)
            await UPDATE (Meals) .where('ID =', mealID).set (`fats +=`, req.fats) 
        
        if(req.fibers !== null && req.fibers !== 0)
            await UPDATE (Meals) .where('ID =', mealID).set (`fibers +=`, req.fibers) 

        
    })
}