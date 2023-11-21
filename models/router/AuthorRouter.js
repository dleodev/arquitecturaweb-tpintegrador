
const express = require("express");
const Author = require("../models/Author");
const Comment = require("../models/Comment");
const AuthorRouter = express.Router();

//CREATE
AuthorRouter.post("/author", async (req, res) => {
  try {
    const { name, surname, age } = req.body;
    if (!name || !surname || !age) {
      return res.status(400).send({
        success: false,
        message: "Faltan datos por completar",
      });
    }

    let author = new Author({
      name,
      surname,
      age,
    });

    await author.save();
    return res.status(200).send({
      success: true,
      message: "Autor creado correctamente!",
      author,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

//READ
AuthorRouter.get("/", async (req, res) => {
  let authors = await Author.find({});
  return res.status(200).send({
    success: true,
    authors,
  });
});



// UPDATE
AuthorRouter.put("/resource/:id", async (req, res) => {
  const { id } = req.params;
  const { age } = req.body;

  try {
    let author = await Author.findOneAndUpdate({ _id: id }, { age }, { new: true });

    if (!author) {
      return res.status(404).send({
        success: false,
        message: "Author not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Author is modified!",
      author,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error updating author",
      error: error.message,
    });
  }
});


//DELETE
AuthorRouter.delete("/resource/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Author.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Author is deleted!",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});


module.exports = AuthorRouter;