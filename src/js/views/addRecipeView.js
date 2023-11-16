import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _message = 'Recipe was successfully uploaded :)';

    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }

    toggleWindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }

    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }

    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function(e) {
            e.preventDefault();
            //FormData Pretty modern browser API used to get the form data 
            const dataArr = [...new FormData(this)];
             //Need to pass form as a parameter to FormData constructor.here this is _parentElement means form.
            //Use spread operator to convert object into an array
            const data = Object.fromEntries(dataArr); //From ES2019 fromEntries method is avialble.It takes array of entries and convert into an object. 
            //fromEntries method works opposite to entries method on arrays.
            handler(data);
            //Now this data will want to use to upload to API.API calls are happen in the modelBy creating controller funtion which is handler for this functon. again publish subscriber model.
        });
    }

    _generateMarkup() {
       
    }
}

export default new AddRecipeView();