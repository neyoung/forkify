import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResult = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';

};

export const highlightSelected = () => {

};

export const limitRecipeTitle = () => {

};

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link results__link--active" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${recipe.title}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>

    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

const createButton = () => {

};

const renderButtons = () => {

};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // render results of current page
    //FIXME: // const start = (page -1) * resPerPage;
    // const end = page * resPerPage;

    recipes.forEach(renderRecipe);

    //FIXME: renderButtons();
};