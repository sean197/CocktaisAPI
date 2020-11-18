// Instanciate the Classes
const ui = new UI(),
      cocktail = new CocktailAPI();
    

// Create the Event Listeners
function eventListeners() {

    // Document ready
    document.addEventListener("DOMContentLoaded", documentReady)

    // Add event listner when form is submitted
    const searchForm = document.querySelector("#search-form");
    if(searchForm){
        searchForm.addEventListener("submit", getCocktails);
    }

    // The results div listeners
    const resultsDiv = document.querySelector("#results");
    if(resultsDiv) {
        resultsDiv.addEventListener("click", resultsDelegation);
    }
}

eventListeners();

// Get cocktails function
function getCocktails(e){
    e.preventDefault();

    const searchTerm = document.querySelector("#search").value;

    // Check something is on the search input
    if(searchTerm === ""){
        // Call User Interface print message
        ui.printMessage('Form is mandatory.', "danger");
    } else {
        // Server response from promise
        let serverResponse;

        // Type of search  (ingredients, cocktails or name )
        const type = document.querySelector("#type").value;

        // Evaluate type of method and execute query

        switch(type) {
        case "name": 
            serverResponse = cocktail.getDrinksByName(searchTerm);
            break;
        case "ingredient":
            serverResponse = cocktail.getDrinksByIngredient(searchTerm);
            break;
        case "category":
            serverResponse = cocktail.getDrinksByCategory( searchTerm );
            break;
        case "alcohol":
            serverResponse = cocktail.getDrinksByAlcohol(searchTerm);
            break;
        }

        ui.clearResults();

        // Query by the name of the drink
            serverResponse.then(cocktails => {
                if(cocktails.cocktails.drinks === null){
                    // Nothing exists
                    ui.printMessage(`There are no result of ${searchTerm}`, "danger");
                } else {
                    // ui.displayDrinksWithIngrediets(cocktails.cocktails.drinks);
                    if (type === "name") {
                        // Display with ingredients
                        ui.displayDrinksWithIngrediets(cocktails.cocktails.drinks);
                    } else {
                        // Display without Ingredients (category, alcohol, ingredient)
                        ui.displayDrinks(cocktails.cocktails.drinks);

                    }
                }
            })
    }
}

// Delegation for the results area
function resultsDelegation(e) {
    e.preventDefault();

    if(e.target.classList.contains("get-recipe")) {
        cocktail.getSingleRecipe( e.target.dataset.id )
            .then(recipe => {
                // Displays single reciper into a model
                ui.displaySingleRecipe( recipe.recipe.drinks[0] );
            })
    } 
} 

// Document Ready
function documentReady() {

    // Select the search category select
    const searchCategory = document.querySelector(".search-category");
    if(searchCategory) {
        ui.displayCategories();
    }
}