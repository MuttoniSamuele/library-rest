import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { getBooks, saveBooks, generateId } from "./books.js";

// I metodi HTTP utilizzati, sono stati scelti secondo i principi REST

// Ottengo il percorso al progetto
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Inizializzo il server in express
const app = express();
// Uso la porta 8080 (si puo cambiare)
const port = 8080;
// Percorso contenente i file statici del frontend
const publicPath = path.join(__dirname, "public");

// Opzione per permettere ad express di ricevere body in formato JSON
app.use(bodyParser.json());

// Servo alla rotta "/" i file del frontend
app.use("/", express.static(publicPath));

// Rotta che accetta il metodo GET per ottenere il JSON di tutti i libri
app.get("/api/books", async (_req, res) => {
  // Resonde con un codice 200 (Ok) e il JSON dei libri
  res.status(200).json({ books: await getBooks() });
});

// Rotta che accetta il metodo POST per aggiungere un nuovo libro
app.post("/api/book", async (req, res) => {
  // Controllo che tutti i parametri del libro siano presenti nel JSON in input
  for (const field of ["title", "author", "publisher", "price"]) {
    // Se anche uno solo manca o e' vuoto, restituisce il codice 400
    if (!req.body.hasOwnProperty(field) || req.body[field] === "") {
      return res.status(400).send("Bad Request");
    }
  }
  // Converto il prezzo in float
  const price = parseFloat(req.body.price);
  // Se l'operazione fallisce o il numero e' negativo restituisce 400
  if (isNaN(price) || price < 0) {
    return res.status(400).send("Bad Request");
  }
  // Tutti i parametri sono validi, ottengo l'array di libri
  const books = await getBooks();
  // Aggiungo il libro
  books.push({
    id: generateId(books),
    title: String(req.body.title),
    author: String(req.body.author),
    publisher: String(req.body.publisher),
    price
  });
  // Salvo i libri
  await saveBooks(books);
  // Rispondo con un codice 201 per indicare che e' stata creata una risorsa
  res.status(201).send("Created");
});

// Rotta che accetta il metodo DELETE per eliminare un libro dato il suo ID
app.delete("/api/book/:id", async (req, res) => {
  // Prendo l'ID dal parametro e provo a convertirlo in int
  const id = parseInt(req.params.id);
  // Se l'operazione fallisce o il numero e' negativo restituisce 400
  if (isNaN(id) || id < 0) {
    return res.status(400).send("Bad Request");
  }
  // Ottengo l'array di libri
  const books = await getBooks();
  // Cerco l'indice del libro dato il suo ID
  const index = books.findIndex((b) => b.id === id);
  // Se non lo trova rispondo con codice 404
  if (index === -1) {
    return res.status(404).send("Not Found");
  }
  // Elimino il libro
  books.splice(index, 1);
  // Salvo i libri
  await saveBooks(books);
  // Rispondo con codice 200
  res.status(200).send("Ok");
});

// Avvio il server
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
