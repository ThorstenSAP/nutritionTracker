describe('MainView test', () => {
    // it.skip('should login with valid credentials', async () => {
    //     await browser.url(`https://the-internet.herokuapp.com/login`);

    //     await (await $('#username')).setValue('tomsmith');
    //     await (await $('#password')).setValue('SuperSecretPassword!');
    //     await (await $('button[type="submit"]')).click();

    //     await expect($('#flash')).toBeExisting();
    //     await expect($('#flash')).toHaveTextContaining(
    //         'You logged into a secure area!');
    // });
    it('should open the app', async () => {
        const mainView = await browser.asControl(
            { 
                selector: {
                    viewName: "tm.nutriTracker.myUI5App.view.MainView"
                }
            }
        )
        const mealsList = await browser.asControl(
            { 
                selector: {
                    viewName: "tm.nutriTracker.myUI5App.view.MainView",
                    id: "mealsList"
                }
            }
        )

        const mainViewWeb = await mainView.getWebElement()
        const mealsListWeb = await mealsList.getWebElement()
        const mealsULList = await mealsListWeb.$('ul')
        const mealsListItems = await mealsULList.$$('li')
        await mealsListItems[0].click()
        //expect detailview visible as well
        const detailView = await browser.asControl(
            { 
                selector: {
                    viewName: "tm.nutriTracker.myUI5App.view.DetailView"
                }
            }
        )
        await expect (await detailView.getWebElement().isDisplayed).toBeTruthy()
        await expect(await mainViewWeb.isDisplayed()).toBeTruthy()
    })
    it('should open a dialog to enter a meal name', async () => {
        const mealsList = await browser.asControl(
            { 
                selector: {
                    viewName: "tm.nutriTracker.myUI5App.view.MainView",
                    id: "mealsList"
                }
            }
        )
        const mealsListWeb = await mealsList.getWebElement()
        const mealsListButton= await mealsListWeb.$('button')
        await mealsListButton.click()

        const newNutrientDialog = await $('#newMealDialog')
        expect(await newNutrientDialog.isDisplayed()).toBeTruthy()

    })
});

