const bookContainer = document.getElementById("books-container");
const addBookButton = document.getElementById("add-book-btn");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const publisherInput = document.getElementById("publisher");
const priceInput = document.getElementById("price");
const addBookError = document.getElementById("add-book-error");

function main() {
  addBookButton.addEventListener("click", handleAddBook);
  displayBooks();
}
main();

async function displayBooks() {
  bookContainer.innerHTML = "";
  const books = (await (await fetch("/api/books")).json()).books;
  for (const b of books) {
    displayBook(b);
  }
}

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

async function handleAddBook() {
  const res = await fetch("/api/book", {
    method: "POST",
    headers: {
      "content-type": "Application/JSON"
    },
    body: JSON.stringify({
      title: titleInput.value,
      author: authorInput.value,
      publisher: publisherInput.value,
      price: priceInput.value,
    })
  });
  if (res.ok) {
    addBookError.classList.add("hidden");
    await displayBooks();
  } else {
    addBookError.classList.remove("hidden");
  }
}

async function deleteBook(id) {
  const res = await fetch(`/api/book/${id}`, { method: "DELETE" });
  if (res.ok) {
    await displayBooks();
  }
}
