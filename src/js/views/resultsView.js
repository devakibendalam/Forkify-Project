import View from './View.js';
import previewView from './previewView.js';

class ResultsView extends View {
    _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipes found for your query Please try again ;)';
    _message = '';


    _generateMarkup() {
      console.log(this._data);
      return this._data.map(result => previewView.render(result, false))
      .join('');

    // _generateMarkup() {
    //     console.log(this._data);
    //     //need to loop over this array and simply return a whole string which contains these array elements.//For each data element from array need to show like this format

    //     return this._data.map(this._generateMarkupPreview).join('');
       
    // }

    // _generateMarkupPreview(result) {
    //   const id = window.location.hash.slice(1);

    //     return `
    //     <li class="preview">
    //         <a class="preview__link ${result.id === id ? 'preview__link--active' : ''}" href="#${result.id}">
    //           <figure class="preview__fig">
    //             <img src="${result.image}" alt="${result.title}" />
    //           </figure>
    //           <div class="preview__data">
    //             <h4 class="preview__title">${result.title}</h4>
    //             <p class="preview__publisher">${result.publisher}</p>
    //             </div>
    //         </a>
    //       </li>
    //       `;   
    // }
    }
}

export default new ResultsView();