import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { BOOKS, generateId } from "./books.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 8080;
const publicPath = path.join(__dirname, "public");

app.use(bodyParser.json());

app.use("/", express.static(publicPath));

app.get("/api/books", (_req, res) => {
  res.status(200).json({ books: BOOKS });
});

app.post("/api/book", (req, res) => {
  for (const field of ["title", "author", "publisher", "price"]) {
    if (!req.body.hasOwnProperty(field) || req.body[field] === "") {
      return res.status(400).send("Bad Request");
    }
  }
  const price = parseFloat(req.body.price);
  if (isNaN(price) || price < 0) {
    return res.status(400).send("Bad Request");
  }
  BOOKS.push({
    id: generateId(),
    title: String(req.body.title),
    author: String(req.body.author),
    publisher: String(req.body.publisher),
    price
  });
  res.status(201).send("Created");
});

app.delete("/api/book/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id < 0) {
    return res.status(400).send("Bad Request");
  }
  const index = BOOKS.findIndex((b) => b.id === id);
  if (index === -1) {
    return res.status(404).send("Not Found");
  }
  BOOKS.splice(index, 1);
  res.status(200).send("Ok");
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
