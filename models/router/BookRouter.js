const express = require("express");
const Book = require("../models/Book");
const Author = require("../models/Author");
const Comment = require("../models/Comment");
const BookRouter = express.Router();

//CREA UN LIBRO
BookRouter.post("/book", async (req, res) => {
  try {
    const { title, description, authorId, genre } = req.body;
    if (!title || !description || !authorId || !genre) {
      return res.status(400).send({
        success: false,
        message: "Faltan datos por completar!",
      });
    }

    let book = await Book({
      title,
      description,
      author: authorId,
      genre,
    });
    await book.save();
    return res.status(201).send({
      success: true,
      message: "Libro creado correctamente!",
      book,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// DEVUELVE TODOS LOS LIBROS
BookRouter.get("/books", async (req, res) => {
  try {
    const books = await Book.find().populate({
      path: "author",
      select: "name surname",
    });

    return res.status(200).send({
      success: true,
      message: "Libros encontrados",
      books,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});


// DEVUELVE TODOS LOS LIBROS DE UN AUTOR
BookRouter.get("/books/authors/:idAuthor", async (req, res) => {
  try {
    const { idAuthor } = req.params; 
    const books = await Book.find({ author: idAuthor }).populate({
      path: "author",
      select: "name surname",
    });

    return res.status(200).send({
      success: true,
      message: "Libros encontrados para el autor",
      books,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});


// DEVOLVER UN LIBRO
BookRouter.get("/book/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let book = await Book.findById(id).populate({
      path: "author",
      select: "name surname",
    });

    if (!book) {
      return res.status(404).send({
        success: false,
        message: "Libro no encontrado",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Libro encontrado",
      book,
    });
  } catch (error) {
    return res.status(200).send({
      success: false,
      message: error.message,
    });
  }
});



// ACTUALIZA LAS PARTES DE UN LIBRO
BookRouter.put("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).send({
        success: false,
        message: "Libro no encontrado",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Libro actualizado correctamente",
      book: updatedBook,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});



// Obtener todos los libros del género
BookRouter.get("/books/genders/:genre", async (req, res) => {
  try {
    const { genre } = req.params;

    
    const books = await Book.find({ genre }).populate({
      path: "author",
      select: "name surname",
    });

    return res.status(200).send({
      success: true,
      message: `Libros encontrados para el género ${genre}`,
      books,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});


// Crear un comentario para un libro específico
BookRouter.post("/authors/:authorId/books/:bookId/comments", async (req, res) => {
  try {
    const { authorId, bookId } = req.params;
    const { text } = req.body;

    // Verificar si el autor existe
    const author = await Author.findById(authorId);
    if (!author) {
      return res.status(404).json({ message: "Autor no encontrado" });
    }

    // Verificar si el libro pertenece al autor
    const book = await Book.findOne({ _id: bookId, author: authorId });
    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    // Crear un nuevo comentario y agregarlo al libro
    const newComment = new Comment({ text });
    await newComment.save();  // Asegúrate de guardar el comentario antes de agregarlo al libro
    book.comments.push(newComment._id);
    await book.save();

    return res.status(201).json(newComment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});




// Obtener todos los comentarios para un libro específico
BookRouter.get("/authors/:authorId/books/:bookId/comments", async (req, res) => {
  try {
    const { authorId, bookId } = req.params;

    // Verificar si el autor existe
    const author = await Author.findById(authorId);
    if (!author) {
      return res.status(404).json({ message: "Autor no encontrado" });
    }

    // Verificar si el libro pertenece al autor
    const book = await Book.findOne({ _id: bookId, author: authorId });
    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    // Obtener todos los comentarios para el libro
    const comments = book.comments;
    return res.status(200).json( comments );
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


module.exports = BookRouter;