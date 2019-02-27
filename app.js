//Book Class: Represents a Book
class Book{
	constructor(title, author, isbn){
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}

//UI Class: Handles UI Task
class UI {
	static displayBooks(){
		/*const storedBooks = [
			{
				title: 'Book One',
				author: 'John Doe',
				isbn: '3434434'
			},
			{
				title: 'Book Two',
				author: 'John Doe',
				isbn: '4553454'
			}
		];

		const books = storedBooks;*/

		const books = Store.getBooks();

		books.forEach((book)=>UI.addBookToList(book));
	}

	static addBookToList(book){
		const list = document.querySelector('#book-list');
		
		//This row is created from the DOM because it increases dynamically
		const row = document.createElement('tr');
		row.innerHTML = `
			<td>${book.title}</td>
			<td>${book.author}</td>
			<td>${book.isbn}</td>
			<td><a href='#' class='delete'>X</a></td>
		`;

		list.appendChild(row)
	}

	static deleteBook(targetElement){
		if(targetElement.classList.contains('delete')){
			targetElement.parentElement.parentElement.remove();

			//Show success message
			UI.showAlert('Book successfully removed', 'successColor')
		}
	} 

	static showAlert(message, class_Name){
		const div = document.createElement('div');
		div.className = `alert alert-${class_Name}`;
		div.appendChild(document.createTextNode(message));
		const container = document.querySelector('#container');
		const form = document.querySelector('#book-form');
		container.insertBefore(div, form);
		//Make alert vanish in 3s
		setTimeout(()=>document.querySelector('.alert').remove(), 3000);
	}

	static clearFields(){
		document.querySelector('#title').value = '';
		document.querySelector('#author').value = '';
		document.querySelector('#isbn').value = '';
	}
}

//Store Class: Handles Storage
class Store {
	static getBooks(){
		let books;
		if(localStorage.getItem('books')=== null){
			books = [];
		}else{
			books = JSON.parse(localStorage.getItem('books'));
		}

		return books;
	}

	static addBook(book){
		const books = Store.getBooks();
		books.push(book);
		localStorage.setItem('books', JSON.stringify(books));
	}

	static removeBook(isbn){
		const books = Store.getBooks();
		books.forEach((book, index) =>{
			if(book.isbn===isbn){
				books.splice(index, 1);
			}
		});

		localStorage.setItem('books', JSON.stringify(books));
	}
}


//Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks)

//Event: Add a Book
document.querySelector('#book-form').addEventListener('submit',(e)=>{
	//Prevent actual submit
	e.preventDefault()
	//Get form values
	const title = document.querySelector('#title').value;
	const author = document.querySelector('#author').value;
	const isbn = document.querySelector('#isbn').value;

	//Valiate
	if(title===''||author===''||isbn===''){
		UI.showAlert('Please fill in all fields', 'color');
	}else{
		//instantiate book
		const book = new Book(title, author, isbn);

		//Add Book to UI
		UI.addBookToList(book);

		//Add Book to Store
		Store.addBook(book);

		//Show success message
		UI.showAlert('Book successfully added', 'successColor')

		//Clear fields
		UI.clearFields();
	}

})

//Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e)=>{
	UI.deleteBook(e.target)

	// Remove book from store
  	Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
})