import * as model from './model.js';
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js'; 
import { MODAL_CLOSE_SEC } from './config.js';
//Polyfilling used to support most older browsers also
import 'core-js/stable';  //To polyfill everything
import 'regenerator-runtime/runtime'; //Polyfill async await

// if(module.hot) {
//   module.hot.accept();
// }

// const recipeContainer = document.querySelector('.recipe');

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



//MVC Architecture:
// Importance of Architecture in Software Development:
// Just like a house needs a structure, software requires organization and structure.
// In software, structure involves organizing code into modules, classes, and functions.

// Three Key Aspects of a Perfect Architecture:
// Structure: Organizing and dividing code.
// Maintainability: The ability to make future changes and updates.
// Expandability: Easily adding new features in the future.

// Achieving the Perfect Architecture:
// Creating an architecture from scratch is possible for small projects.
// Complex projects may require well-established architecture patterns like Model-View-Controller, Model-View-Presenter, Flux, etc.

// The Role of Frameworks:
// Modern web development often involves using frameworks like React, Angular, Vue, or Svelte.
// Frameworks handle architecture, reducing the need for developers to create their own.
// Learning JavaScript and how to implement architecture is important even when using frameworks.

// components of any architecture:
// there are some components that any architecture must have. And that is business logic, state, an HTTP library, application logic, and presentation logic. 
// Business logic is basically all the code that solves the actual business problem. So that's code that is directly related to what the business does and to what it needs. So if your business is WhatsApp, then your business logic will include sending messages.So essentially, business logic is the logic that is really related to solving the problem that the business set out to solve in the first place.

// State, which is one of the most important aspects of any web application. So the application state is essentially what stores all the data about the application that is running in the browser. So the data about the application's front end, basically. So the state should store any data that you might fetch from an API or data that the user inputs, or what page the user is currently viewing and so on. And this data should be the so-called single source of truth, which should be kept in sync with the user interface. So that means that if some data changes in the state, then the user interface should reflect that. And the same is true the other way around. So if something changes in the UI, then the state should also change. Now storing and displaying data and keeping everything in sync is one of the most difficult tasks when building web applications. And that's why there are actually many state management libraries like Redux or MobX. But in this project, we will keep things very simple and use a simple object to store our entire state.

// The HTTP library is simply responsible for making and receiving AJAX requests or sending and receiving data from an API. 

// The fourth part, application logic (ROUTER): Code that is only concerned about the implementation logic of application itself;
// Handles navigation and UI events

// And the last part, presentation logic, is what is responsible for presenting the data to the user. Now the state stores the data, but the presentation logic is responsible for creating and updating the user interface, presentation logic is what users see and interact with, but it is not the actual HTML or the buttons and the input fields that you have in your HTML. It's really the visual elements that you see on the screen.

// Forkify Project Architecture [mvc]:
// The architecture chosen for the Forkify project is the model-view-controller (MVC) architecture.
// This architecture separates the application into three components: the model, the view, and the controller.

// The model is all about the business logic. the model is the one place where all data related code is stored. So for example, if you write code that calculates the cooking time of a recipe or stores all recipes in one place, that code goes into the model.

// The view, which is essentially everything the user sees on the screen. So the view is the visual representation of the model and what the user sees. So when the data changes in the model, the view is then going to be updated. And the other way around, when the user interacts with the UI, the view will call methods from the controller to update the model.

// The controller is the connection between the model and the view, which means that it is the place where we put all the application logic. Now the controller decides what should happen when a user interacts with the view.

// So in summary, the model is all about the application data and the business rules. The view is all about displaying the data to the user. And the controller is responsible for user interaction and for updating the view and the model when the user interacts with the application.

// So these are the three main components of the MVC architecture. But the big question is, how do these three components interact with each other? Well, let me give you a quick overview of that process. So first, the user interacts with the view, so the view is then going to call a method from the controller. The controller is then going to handle the user input and might decide that it needs to change the data in the model. And so the controller is going to do just that, change the data in the model. Now, when the model changes, it will then notify the view that some change occurred. And then the view will update and display the new data to the user. And so this is essentially how MVC works.

// Now, there are many variations of MVC. But the core principles are always the same.Now, in JavaScript, a very well-known variation of the MVC pattern is actually the model-view-viewmodel pattern, which is often just called MVVM. However, this pattern is essentially the same as the original MVC, but it's just tailored to modern web development. 


// https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza 
// //this is very common format of basically sending variables over urls. Here search is like a variable and pizza is that value. search is here query string

//////////////////////////////////////////////////////////////////////////////

//Loading a Recipe data from API
const controlRecipes = async function () {
  try {
    //to get the Recipe ID from the Hash
    const id = window.location.hash.slice(1); //here window.location gives entire url 
    console.log(id);

    if(!id) return;
    recipeView.renderSpinner();

    // 0) update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1) Loading recipe
    await model.loadRecipe(id); //one async function calls another async function.
    //here this function does not return any anything so no need to store in any variable and this is chainging the state object.

    // 2) Rendering recipe
    recipeView.render(model.state.recipe); //render method sends data and store it into object
    // const recipeView = new recipeView(model.state.recipe); //this is also possible when we export entire class. Here creating the object for recipeView and sending data to it

  } catch(err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if(!query) return;
 
    // 2) Load search results
     await model.loadSearchResults(query);

     // 3) Render results
     console.log(model.state.search.results);
    //  resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
     console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings);

  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe); //update method will only update text attributes in the DOM. Without having to re-render the entire view.
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
 if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
 else model.deleteBookmark(model.state.recipe.id);

  // 2) update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async  function (newRecipe) {
  try{
  // console.log(newRecipe);

  //Show loading spinner
  addRecipeView.renderSpinner();

  //upload the new recipe data
  await model.uploadRecipe(newRecipe);
  console.log(model.state.recipe);

  //Render recipe
  recipeView.render(model.state.recipe);

  //Success message
  addRecipeView.renderMessage();

  //Render bookmark view
  bookmarksView.render(model.state.bookmarks);

  //Change ID in URL 
  // For this use history object: window.history is history object of browsers. On this pushState method used to change the url without reloading the page.
  //pushState(state, title, url) takes these 3 parameters
  window.history.pushState(null, '', `#${model.state.recipe.id}`);
  // window.history.back() //used to go back in browsers using history api

  //Close form window
  setTimeout(function () {
    addRecipeView.toggleWindow();
  }, MODAL_CLOSE_SEC * 1000);
  
  } catch (err) {
     console.error('💥', err);
     addRecipeView.renderError(err.message);
  }
};

// when selecting a recipe from the results list hashchange event need to trigger when the URL hash changes.
// changing the URL hash (the part after the '#' symbol) is used to load different recipes.When the hash changes, an hashchange event is fired.
// Event Listeners for Recipe Loading:
// when loading a recipe by its ID. then load event need to trigger

// window.addEventListener('hashchange', controlRecipes); //hashchange event fired when hash changes
// window.addEventListener('load', controlRecipes); //load event fired when page completed loading

//this as same as above individual events
// ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, controlRecipes));

//Handling events in an MVC (Model-View-Controller) architecture using the Publisher-Subscriber pattern.
//subscriber function 
const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes); //passing function as argument
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

// Events related to the DOM and user interface should be handled in the view, while the actual event handling logic should be in the controller.
// The challenge is that the view and controller need to communicate without direct dependencies.
// The Publisher-Subscriber pattern is introduced as a solution, where the view acts as the "publisher" that listens for events and the controller as the "subscriber" that responds to events.
// The controller subscribes to the view by passing its event-handling function as an argument to the view's event listener setup.
// This decouples the view and controller, ensuring that the view can trigger events without knowing about the controller.
// When an event occurs, the controller's function is called as a callback, allowing event handling to occur within the controller while keeping presentation logic in the view.
// The pattern maintains separation of concerns and enables control over which functions are executed in response to events.
// The Publisher-Subscriber pattern is a key concept in designing clean and maintainable architectures for handling events in an MVC framework.










