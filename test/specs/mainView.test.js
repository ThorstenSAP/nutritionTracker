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
    it('should open the app', () => {
        const mainView = browser.asControl(
            { 
                selector: {
                    viewName: "tm.nutriTracker.myUI5App.view.MainView"
                }
            }
            )
        const mealsList = browser.asControl(
            { 
                selector: {
                    viewName: "tm.nutriTracker.myUI5App.view.MainView",
                    id: "mealsList"
                }
            }
            )
        expect(mainView.getVisible()).toBeTruthy()
        expect(mealsList.getItems(true).length).toBeGreaterThan(0)
    })
});

