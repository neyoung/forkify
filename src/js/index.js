import Search from './model/Search';
import Recipe from './model/Recipe';
import List from './model/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 * - Search object
 * - Current receipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {}; 

/** 
 * SEARCH CONTROLLER
*/
const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput(); 

    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes); //display loader animation

        try {
            // 4) Search for recipes
            await state.search.getResults();

            // 5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (err) {
            alert('Something is wrong with the search...');
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); //prevents the page from reloading upon clicking submit button
    controlSearch(); 
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/**
 * RECIPE CONTROL
 */
const controlRecipe = async () => {
    // Get ID from URL
    const id = window.location.hash.replace('#', '');
        
    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            // console.log(state.recipe); TODO: remove me
            recipeView.renderRecipe(state.recipe);
            //TODO: add isLiked here

        } catch (err) {
            console.log(err);
            alert('Error processing recipe!');
        }

    }  

};

// How to add the same event listener to different events
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * LIST CONTROLLER
 */
const controlList = () => {
    // Create a new list IF there is none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

    // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }

});


/**
 * LIKE CONTROLLER
 */

 // Handling RECIPE, LIST and LOVE button clicks
 elements.recipe.addEventListener('click', e => {
     if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
     } else if (e.target.matches('.btn-increase, .btn-increase *')) {
         // Increase button is clicked
         state.recipe.updateServings('inc');
         recipeView.updateServingsIngredients(state.recipe);
     } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
         // List controller - Add ingridents to shopping list
         controlList();
     } else if (e.target.matches('.recipe__love, .recipe__love *')) {
         // Like controller
     }
 });