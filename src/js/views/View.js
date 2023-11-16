import icons from 'url:../../img/icons.svg'; //parcel 2
//Here we are exporting direct class and not creating object. Because we will only use it as a parent class of other child views
export default class View {
     _data;
     
     //Standard way of writing documentation for javascript functions and that is called JSDocs. ->JSDoc.app website -> multiline comment with star shows jsdoc comment
     /**
      * Render the Recived object to the DOM
      * @param {Object | Object[]} data The data to be rendered (e.g recipe)
      * @param {boolean} [render=true] If false, create markup string insted of rendering to the DOM 
      * @returns {undefined | string} A merkup string is returned if render = false
      * @this {Object} View instance
      * @author Devaki
      * @todo Finish implementation
      */
    //public api
    render(data, render = true) {
      //check if the data exist or not . Here !data means null or undefined and for emty array use array constructor method
      if (!data || (Array.isArray(data) && data.length===0)) return this.renderError(); 

        this._data = data;
        const markup = this._generateMarkup();

        if(!render) return markup;

        this._clear;
        this._parentElement.innerHTML = ''; //emptying the container before adding recipe 
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    update(data) {
        this._data = data;
        const newMarkup = this._generateMarkup();

        //Creating virtual DOM: convert this newMarkup into DOM Object that's living in the memory and that need to compare with the actual DOM that's on the page

        const newDOM = document.createRange().createContextualFragment(newMarkup);
        //this method convert the newMarkup string into real DOM Node objects.This is virtual DOM that is not really living on the page but which lives in our memory.
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        // console.log(newElements);
        //Now need to compare this virtual DOM to the actual DOM that is really on the page.
        const curElements = Array.from(this._parentElement.querySelectorAll('*')); 
        //Array.from used to convert nodelist to array.
        //Now need to compare these curElements and newElements

        newElements.forEach((newEl, i) => {
          const curEl = curElements[i];
          // console.log(curEl, newEl.isEqualNode(curEl));
          //isEqualNode is handy method on all nodes that compares the content inside that elements

          //Updating the DOM only in places where it has changed.

          //nodeValue method is available on all node methods and it returns the value of current node.For the document itself nodeValue returns null. For text, comment nodevalue returns the content of the node.
          //the firstchild node contains the text so we need to change only that text

          //Updates changed TEXT
          if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !=='') {
            // console.log('💥',newEl.firstChild.nodeValue.trim());
            curEl.textContent = newEl.textContent;
          }

          //Updates changed ATTRIBUTES
          if(!newEl.isEqualNode(curEl))
          Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value)
        )
        });
    }

    _clear() { 
        this._parentElement.innerHTML = '';
    }

    renderSpinner() {
        const markup = `
        <div class="spinner">
                <svg>
                  <use href="${icons}#icon-loader"></use>
                </svg>
              </div>
              `;
              this._clear();
              this._parentElement.insertAdjacentHTML('afterbegin', markup);
      };

      renderError(message = this._errorMessage) {
        const markup = `
        <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`

      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
      }

      //success message
      renderMessage(message = this._message) {
        const markup = `
        <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`

      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
      }

}