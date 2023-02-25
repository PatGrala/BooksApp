{
  'use strict';

  const select = {
    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      booksList: '.books-list',
      filters: '.filters',
    },
  };

  const templates = {
    book: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
  };

  class Books {
    constructor() {
      const thisBooks = this;

      thisBooks.initData();
      thisBooks.getElements();
      thisBooks.render();
      thisBooks.initActions();
    }

    initData() {
      const thisBooks = this;

      thisBooks.data = dataSource.books;
      thisBooks.favoriteBooks = [];
      thisBooks.filters = [];
    }

    getElements() {
      const thisBooks = this;

      thisBooks.listContainer = document.querySelector(select.containerOf.booksList);
    }

    render() {
      const thisBooks = this;

      for (let book of thisBooks.data) {
        const ratingBgc = thisBooks.determineRatingBgc(book.rating);
        book.ratingBgc = ratingBgc;
        const ratingWidth = book.rating * 10;
        book.ratingWidth = ratingWidth;
        const generatedHTML = templates.book({
          id: book.id,
          name: book.name,
          image: book.image,
          rating: book.rating,
          price: book.price,
          ratingBgc: book.ratingBgc,
          ratingWidth: book.ratingWidth
        });
        const generatedDom = utils.createDOMFromHTML(generatedHTML);
        const listContainer = document.querySelector(select.containerOf.booksList);
        listContainer.appendChild(generatedDom);
      }
    }

    initActions() {
      const thisBooks = this;
      thisBooks.listContainer.addEventListener('dblclick', function (event) {
        event.preventDefault();
        const image = event.target.offsetParent;
        const bookId = image.getAttribute('data-id');
        if (thisBooks.favoriteBooks.includes(bookId)) {
          image.classList.remove('favorite');
          const bookIndex = thisBooks.favoriteBooks.indexOf(bookId);
          thisBooks.favoriteBooks.splice(bookIndex, 1);
        } else {
          image.classList.add('favorite');
          thisBooks.favoriteBooks.push(bookId);
        }
      });

      const bookFilter = document.querySelector(select.containerOf.filters);

      bookFilter.addEventListener('click', function (cb) {
        const clickedElement = cb.target;

        if (clickedElement.tagName == 'INPUT' && clickedElement.type == 'checkbox' && clickedElement.name == 'filter') {
          if (clickedElement.checked) {
            thisBooks.filters.push(clickedElement.value);
          } else {
            const indexOfValue = thisBooks.filters.indexOf(clickedElement.value);
            thisBooks.filters.splice(indexOfValue, 1);
          }
        }
        thisBooks.filterBooks();
      });
    }

    filterBooks() {
      const thisBooks = this;
      for (let book of dataSource.books) {
        let shouldBeHidden = false;
        const hiddenBooks = document.querySelector('.book__image[data-id="' + book.id + '"]');
        for (const filter of filters) {
          if (!book.details[filter]) {
            shouldBeHidden = true;
            break;
          }
        }
        if (shouldBeHidden) {
          hiddenBooks.classList.add('hidden');
        } else {
          hiddenBooks.classList.remove('hidden');
        }
      }
    }

    determineRatingBgc(rating) {

      let background = '';

      if (rating < 6) {
        background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      } else if (rating > 6 && rating <= 8) {
        background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      } else if (rating > 8 && rating <= 9) {
        background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else if (rating > 9) {
        background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }
      return background;
    }
  }
  new Books();
}
