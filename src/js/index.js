import Search from './model/Search';
import * as searchView from './views/searchView';
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
        searchView.clearResult();
        renderLoader(elements.searchRes); //display loader animation

        try {
            // 4) Search for recipes
            await state.search.getResults();

            // 5) Reder results on UI
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