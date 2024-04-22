import fs from "fs";

// Funzione che restituisce tutti i libri presenti nel file JSON
export async function getBooks() {
  // Se il file non esiste, lo creo a partire dal file di esempio
  if (!fs.existsSync("books.json")) {
    const rawBooks = await fs.promises.readFile("books-sample.json");
    await fs.promises.writeFile(
      "books.json",
      rawBooks
    );
    return JSON.parse(rawBooks).books;
  }
  // Altrimenti leggo il file e restituisco i libri
  return JSON.parse(await fs.promises.readFile("books.json")).books;
}

// Funzione che salva i libri in un file JSON
export async function saveBooks(books) {
  await fs.promises.writeFile("books.json", JSON.stringify({ books }));
}

// Funzione che genera un ID univoco per un libro
export function generateId(books) {
  // Inizializzo l'ID a 0
  let id = 0;
  // Trovo l'ID piu' alto tra tutti i libri
  for (const book of books) {
    id = Math.max(id, book.id);
  }
  // Restituisco l'ID successivo
  return id + 1;
}
