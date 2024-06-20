//document.addEventListener('DOMContentLoaded', () => {

    console.log("DOM fully loaded and parsed");

    const myLibrary = [];

    function Book(title, author, pages, readRadio) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.readRadio = readRadio;
        this.id = crypto.randomUUID();

        this.info = function() {
            return `${this.title} by ${this.author}, ${this.pages} pages, ${this.readRadio}`;
        }
    }

    function saveLibrary() {
        localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
    }

    function loadLibrary() {
        const storedLibrary = localStorage.getItem('myLibrary');

        if (storedLibrary) {
            const parsedLibrary = JSON.parse(storedLibrary);
            parsedLibrary.forEach(bookData => {
                const book = new Book(bookData.title, bookData.author, bookData.pages, bookData.readRadio);
                myLibrary.push(book);
            });
            renderBooks();
        }
    }

    function removeBook(event) {
        const indexToRemove = event.target.getAttribute('remove-index');
        myLibrary.splice(indexToRemove, 1);
        saveLibrary();
        renderBooks();
    }

    function markAsRead(event) {
        //const indexToMark = event.target.getAttribute('read-key');

        // Get the read-key attribute from the button
        const readKey = event.target.getAttribute('read-key');

        // Find the book index corresponding to the readKey
        const indexToMark = findIndexByReadKey(readKey);
        console.log("Read key", readKey);
        console.log("Index", indexToMark);
        if (myLibrary[indexToMark].readRadio === 'Not Read Yet') {
        //if (true) {
            myLibrary[indexToMark].readRadio = "Read";
            saveLibrary();
            renderBooks();
        } else {
            alert('Book not found or already marked as Read.');
            console.log(indexToMark);
        }
    }

    function addBookToLibrary(event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const pages = document.getElementById('pages').value;
        const readRadio = document.querySelector('input[name=read]:checked').value;
        const id = crypto.randomUUID();

        console.log("Title:", title);
        console.log("Author:", author);
        console.log("Pages:", pages);
        console.log("Read Radio: ", readRadio)

        if (!title) {
            alert("Title is required");
            return;
        }
        if (!author) {
            alert("Author is required");
            return;
        }
        if (!pages) {
            alert("Number of pages is required");
            return;
        }
        if (!readRadio) {
            alert("Please select whether you have read the book");
            return;
        }
        console.log("Form submitted!")

        const book = new Book(title, author, pages, readRadio, id)
        myLibrary.push(book)
        console.log("Added " + book.info())

        renderBooks();
        saveLibrary();
        // Reset the form
        document.getElementById('addBook').reset();
    }

    function renderBooks() {
        const libraryDiv = document.getElementById('library');
        libraryDiv.innerHTML = '';

        myLibrary.forEach((book, index) => {
            const bookDiv = document.createElement('div');

            // Create a container for book info and delete button
            const infoContainer = document.createElement('div');
            infoContainer.classList.add('book-info');

            // Display book information
            infoContainer.textContent = book.info();

            const removeButton = document.createElement('button');
            removeButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Font Awesome trash icon
            removeButton.classList.add('remove-btn');
            removeButton.setAttribute('remove-index', index);
            removeButton.addEventListener('click', removeBook);

            // button adds to DOM a way to mark as read
            const readButton = document.createElement('button');
            readButton.innerHTML = '<i class="fas fa-book"></i>'; 
            readButton.classList.add('read-btn');
            readButton.setAttribute('read-key', book.id);
            readButton.addEventListener('click', markAsRead);

            // Append the remove button to the info container
            infoContainer.appendChild(removeButton);
            infoContainer.appendChild(readButton);

            // Append the info container to the bookDiv
            bookDiv.appendChild(infoContainer);


            // Append the bookDiv to the libraryDiv
            libraryDiv.appendChild(bookDiv);
        });

    }

    // Function to find the index based on the read-key attribute
    function findIndexByReadKey(key) {
        for (let i = 0; i < myLibrary.length; i++) {
            if (myLibrary[i].id === key) {
                return i; // Return the index if the key matches
            }
        }
        return null; // Return null if key is not found
    }

    loadLibrary();

    if (myLibrary.length === 0) {
        const theHobbit = new Book("The Hobbit", "J.R.R. Tolkein", 295, "Not Read Yet");
        myLibrary.push(theHobbit);
        saveLibrary();
    }
//});


// console.log(myLibrary)