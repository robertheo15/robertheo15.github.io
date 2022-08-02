/**
 * [
 *    {
 *      id: <int>
 *      title: <string>
 *      author: <string>
 *      year: <int>
 *      isComplete: <boolean>
 *    }
 * ]
 */

 const books = [];
 const RENDER_EVENT = 'render-book';
 const SAVED_EVENT = 'saved-book';
 const STORAGE_KEY = 'BOOKSHELF';

 function generateId() {
  return +new Date();
}

 function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete
  }
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}


function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData(message, type) {
  if (isStorageExist()) {
    showAlert(message, type)
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const todo of data) {
      books.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const {id, title, author, year, isComplete} = bookObject;

  const textTitle = document.createElement('h3');
  textTitle.classList.add("book-title");
  textTitle.innerText = title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = `Penulis: ${author}`;

  const textYear = document.createElement('p');
  textYear.innerText = `Tahun: ${year}`;

  const article = document.createElement('article');
  article.classList.add('book_item');
  article.append(textTitle, textAuthor, textYear);

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  cardBody.append(article);


  const card = document.createElement('div');
  card.classList.add('card', 'mb-3')
  card.append(cardBody);
  card.setAttribute('id', `book-${id}`);


  if (isComplete) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('btn','btn-warning','btn-sm', 'me-1');
    undoButton.innerText = "Belum selesai dibaca";
    undoButton.addEventListener('click', function () {
      setBookCompletedOrNot(id)
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('btn','btn-danger','btn-sm');
    trashButton.innerText = "Hapus Buku";
    trashButton.addEventListener('click', function () {
      removeBook(id);
    });

    article.append(undoButton, trashButton);
   } else {

    const trashButton = document.createElement('button');
    trashButton.classList.add('btn', 'btn-primary', 'btn-sm', 'me-1');
    trashButton.innerText = "Selesai dibaca";
    trashButton.addEventListener('click', function () {
      setBookCompletedOrNot(id)
    });

    const checkButton = document.createElement('button');
    checkButton.classList.add('btn', 'btn-danger', 'btn-sm');
    checkButton.innerText = "Hapus buku";
    checkButton.addEventListener('click', function () {
      removeBook(id);
    });

    article.append(trashButton, checkButton);
  }

  return card;
}

function addBook() {
  const title = document.getElementById('inputBookTitle').value;
  const author = document.getElementById('inputBookAuthor').value;
  const year = document.getElementById('inputBookYear').value;
  const isComplete = document.getElementById('isComplete').checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, title, author, year, isComplete);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData('Buku Berhasil ditambahkan!', 'success');
}

function setBookCompletedOrNot(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  if (bookTarget.isComplete){
    bookTarget.isComplete = !bookTarget.isComplete;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData('Buku belum selesai dibaca!', 'warning');
  } else {
    bookTarget.isComplete = !bookTarget.isComplete;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData('Buku selesai dibaca!', 'success');  
  }
}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData('Buku berhasil dihapus!', 'danger');
}

function searchBook(){
  const searchBookTitle = document.getElementById('searchBookTitle').value.toLowerCase();
  const renderBooks = document.querySelectorAll('.book-title');

  for (render of renderBooks) {
    if (render.innerText.toLowerCase().includes(searchBookTitle) === false){
      render.parentElement.parentElement.parentElement.remove();
    }
  }
}

const showAlert = (message, type) => {
  const alertElement = document.getElementById('alert')
  const alertElementChild = document.createElement('div')
  alertElementChild.classList.add('col-md-12');

  alertElementChild.innerHTML = `
  <div class="alert alert-${type} alert-dismissible" role="alert">
    ${message}
  </div>
  `;
  alertElement.append(alertElementChild);
  setInterval(()=> {
    alertElementChild.remove()
  },5000);

}

document.addEventListener('DOMContentLoaded', function () {
 
  const submitForm = document.getElementById('inputBook');
  const searchForm = document.getElementById('searchBook');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    searchBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.');
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById('isNotComplete');
  const completedBookList = document.getElementById('completedBookList');

  uncompletedBookList.innerHTML = '';
  completedBookList.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete) {
      completedBookList.append(bookElement);
    } else {
      uncompletedBookList.append(bookElement);
    }
  }
});
