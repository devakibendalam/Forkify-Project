import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './views/helpers.js';
import {AJAX} from './views/helpers.js';

//this state contains all the data about application
export const state = {
    recipe: {},
    search: {
      query: '',
      results: [],
      page : 1,
      resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
};

const createRecipeObject = function (data) {
  //Creating new recipe object from resultent data object from server
  const { recipe } = data.data;
   return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && {key: recipe.key}), // && operator short circutes here. this expression returns like key: recipe.key when it exists key otherwise it does not happen anything.
  };
}

//this function does not return anything, its just changing the state object. And from this state object controller grab the recipe and need to display it. 
export const loadRecipe = async function (id) {
    try {
    // const res = await fetch(
    //     // 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886'
    //     `/${API_URL}/${id}`
    //   );
    //   const data = await res.json();
  
    //   if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
  
    state.recipe = createRecipeObject(data);

      if (state.bookmarks.some(bookmark => bookmark.id === id))
        state.recipe.bookmarked = true;
      else state.recipe.bookmarked = false;
      
      console.log(state.recipe);
    } catch(err) {
        console.error(`${err} 💥💥💥💥`);
        //if the url is not correct then rethrowing this error to controller and displaying by using view
        throw err;
    }
};

//Whenever user searches for any recipe it need to load search results then render that results on view
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);

    //this map returns new array with the new objects.
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && {key: rec.key}),
      };
    });
  state.search.page = 1;
  // console.log(state.search.results);
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
}; 

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  //page start and end data items
  const start = (page - 1) * state.search.resultsPerPage; //0
  const end = page * state.search.resultsPerPage; //9

  return state.search.results.slice(start, end);  //this returns only part of data(10 items) that need to display in that page.
};

// To update the servings Each ingredients has an object which contains quantity. So this quantity need to change when updating the servings.
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQT * newServings / oldServings // 2 * 8 / 4 = 4

    state.recipe.servings = newServings;
  });
};

//storing bookmarks in local storage
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //Add bookmark
  state.bookmarks.push(recipe);

  //Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
}

//taking bookmarks data out from localstorage
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();
// console.log(state.bookmarks);

const clearBookmarks = function() {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try{
  //This function takes raw data and need to convert it into same format as the data that we also get out of the API.

  //create an array of ingredients (filter only ingredients that have data )
   //entries used to convert an object into array
  const ingredients = Object.entries(newRecipe)
  .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
  .map(ing => {
    // const ingArr = ing[1].replaceAll(' ', '').split(',');
    const ingArr = ing[1].split(',').map(el => el.trim());
    if (ingArr.length !== 3)
    throw new Error(
  'Wrong ingredient format! please use the correct format ;)'
  );

  const [quantity, unit, description] = ingArr;

  return {quantity: quantity ? +quantity : null, unit, description};
  });

  const recipe = {
    title: newRecipe.title,
    source_url: newRecipe.sourceUrl,
    image_url: newRecipe.image,
    publisher: newRecipe.publisher,
    cooking_time: +newRecipe.cookingTime,
    servings: +newRecipe.servings,
    ingredients,
  };

  const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
  // console.log(data);
  state.recipe = createRecipeObject(data);
  addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};