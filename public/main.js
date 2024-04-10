// Nel codice uso la funzione "fetch" che e' una versione piu' moderna, semplice e sicura di "XMLHttpRequest"

// Ottengo gli elementi HTML da utilizzare
const bookContainer = document.getElementById("books-container");
const addBookButton = document.getElementById("add-book-btn");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const publisherInput = document.getElementById("publisher");
const priceInput = document.getElementById("price");
const addBookError = document.getElementById("add-book-error");

// Funzione di entrata del programma
function main() {
  // Aggiungo l'evento per l'aggiunta di libri
  addBookButton.addEventListener("click", handleAddBook);
  // Mostro i libri
  displayBooks();
}
main();

// Funzione che mostra i libri sul server nell'HTML
async function displayBooks() {
  // Svuoto il contenuto del container per evitare di aggiungere libri a quelli gia' presenti
  bookContainer.innerHTML = "";
  // Mando una richista GET al server per ottenere il JSON dei libri
  const books = (await (await fetch("/api/books")).json()).books;
  // Costruisco l'HTML per ogni libro ottenuto
  for (const b of books) {
    displayBook(b);
  }
}

// Funzione che costruisce l'HTML per un libro
function displayBook(book) {
  const bookElement = document.createElement("article");
  bookElement.classList.add("book");
  bookElement.innerHTML = `
    <h3>${book.title}</h3>
    <p><b>ID:</b> ${book.id}</p>
    <p><b>Author:</b> ${book.author}</p>
    <p><b>Publisher:</b> ${book.publisher}</p>
    <p><b>Price:</b> €${book.price.toFixed(2)}</p>
    <button class="contrast outline" onclick="deleteBook(${book.id})">Delete</button>`;
  bookContainer.appendChild(bookElement);
}

// Funzione che aggiunge un libro
async function handleAddBook() {
  // Mando la richiesta POST al server contenente nel body il JSON con i dati del libro
  const res = await fetch("/api/book", {
    method: "POST",
    // Header che dice al server che il body e' in formato JSON
    headers: {
      "content-type": "Application/JSON"
    },
    // Body con il JSON del libro
    body: JSON.stringify({
      title: titleInput.value,
      author: authorInput.value,
      publisher: publisherInput.value,
      price: priceInput.value,
    })
  });
  // Se l'operazione e' andata a buon fine, mostro la lista aggiornata dei libri
  // altrimenti mostro un errore
  if (res.ok) {
    addBookError.classList.add("hidden");
    titleInput.value = authorInput.value = publisherInput.value = priceInput.value = "";
    await displayBooks();
  } else {
    addBookError.classList.remove("hidden");
  }
}

// Funzione che elimina un libro dato il suo ID
async function deleteBook(id) {
  // Mando la richiesta DELETE al server
  const res = await fetch(`/api/book/${id}`, { method: "DELETE" });
  // Se l'operazione e' andata a buon fine, mostro la lista aggiornata dei libri
  if (res.ok) {
    await displayBooks();
  }
}
