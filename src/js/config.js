//Many real world applications have two special modules that are completely independent of the rest of the architecture. And these are a module for the project configuration and also a module for some general helper functions that are gonna be useful across the entire project.
// Here into this file, we will basically put all the variables that should be constants and should be reused across the project.
// And the goal of having this file with all these variables is that it will allow us to easily configure or project by simply changing some of the data that is here in this configuration file.
// So therefore the name of config. So of course we will not want to put all the variables here in this file.
// The only variables that we do want here are the ones that are responsible for kind of defining some important data about the application itself. So one example of that is 
// the API URL.we will actually reuse in multiple places

export const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes/';
//using uppercase for constants that will never change
export const TIMEOUT_SEC = 10;
export const RES_PER_PAGE = 10;
export const KEY = 'd18834f7-0a10-4165-82df-fab4a0205e16';
export const MODAL_CLOSE_SEC = 2.5;
