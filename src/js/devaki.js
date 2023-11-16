
//import icons from '../img/icons.svg'; //parcel 1
import icons from 'url:../img/icons.svg'; //parcel 2
const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////////////////////
//  "Forkify" Application:
// The application allows users to search for recipes, display them, change serving sizes, bookmark recipes, and add their own recipes.

// User Stories:
// User stories are descriptions of the application's functionality from a user's perspective.
// User stories include searching for recipes, updating servings, bookmarking recipes, creating personal recipes, and seeing bookmarks and personal recipes after returning to the application.

// Features:
// Search Functionality:
// Users can search for recipes using an input field.
// Search results are loaded asynchronously from an API and displayed.
// Pagination buttons allow users to navigate between result pages.

// Updating Servings:
// Users can update the number of servings, and the ingredients adjust accordingly.

// Bookmarking Recipes:
// Users can bookmark recipes, and a list of bookmarks is displayed.

// Uploading Personal Recipes:
// Users can upload their own recipes, which automatically get bookmarked.
// Each user's recipes are visible only to them.

// Local Storage:
// User bookmarks are stored in the browser using local storage.
// Bookmarks are retrieved and displayed when the page loads.

// Flowchart:
// The flowchart describes the logical order of events in the application.
// Key events include searching for recipes, loading and rendering search results, using pagination, selecting and displaying a recipe, and updating servings.
// The flowchart provides a visual representation of how the application's features are connected.

// https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza 
// //this is very common format of basically sending variables over urls. Here search is like a variable and pizza is that value. search is here query string

//Loading a Recipe data from API
const showRecipe = async function () {
  try {
    // 1) Loading recipe
    const res = await fetch(
      // 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886'
      'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcc40'
    );
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    //Creating new recipe object from resultent data object from server
    let { recipe } = data.data;
    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_Time,
      ingredints: recipe.ingredints,
    };
    console.log(recipe);

    // 2) Rendering recipe
    const markup = `<figure class="recipe__fig">
    <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img" />
    <h1 class="recipe__title">
      <span>${recipe.title}</span>
    </h1>
  </figure>

  <div class="recipe__details">
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-clock"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--minutes">${recipe.cookingTime}</span>
      <span class="recipe__info-text">minutes</span>
    </div>
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-users"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
      <span class="recipe__info-text">servings</span>

      <div class="recipe__info-buttons">
        <button class="btn--tiny btn--increase-servings">
          <svg>
            <use href="${icons}#icon-minus-circle"></use>
          </svg>
        </button>
        <button class="btn--tiny btn--increase-servings">
          <svg>
            <use href="${icons}#icon-plus-circle"></use>
          </svg>
        </button>
      </div>
    </div>

    <div class="recipe__user-generated">
      <svg>
        <use href="${icons}#icon-user"></use>
      </svg>
    </div>
    <button class="btn--round">
      <svg class="">
        <use href="${icons}#icon-bookmark-fill"></use>
      </svg>
    </button>
  </div>

  <div class="recipe__ingredients">
    <h2 class="heading--2">Recipe ingredients</h2>
    <ul class="recipe__ingredient-list">
    ${recipe.ingredints.map(ing => {
      return `
      <li class="recipe__ingredient">
      <svg class="recipe__icon">
        <use href="${icons}#icon-check"></use>
      </svg>
      <div class="recipe__quantity">${ing.quantity}</div>
      <div class="recipe__description">
        <span class="recipe__unit">${ing.unit}</span>
        ${ing.description}
      </div>
    </li>
    `;
    }).join('')}
  </div>

  //  we have ingrediants array and need to loop over that array in which each element will contain this markup corresponding to the ingredient.
  //  And then transform that array of strings into one big string. So result of this map, which is that array and call join on it. And so now the result of this entire expression is going to be a big string containing all the ingredients.

  <div class="recipe__directions">
    <h2 class="heading--2">How to cook it</h2>
    <p class="recipe__directions-text">
      This recipe was carefully designed and tested by
      <span class="recipe__publisher">${recipe.publisher}</span>. Please check out
      directions at their website.
    </p>
    <a
      class="btn--small recipe__btn"
      href="${recipe.sourceUrl}"
      target="_blank"
    >
      <span>Directions</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </a>
  </div>`;
  recipeContainer.innerHTML = ''; //emptying the container before adding recipe 
  recipeContainer.insertAdjacentHTML('afterbegin', markup);
  } catch(err) {
    alert(err);
  }
};
showRecipe();






