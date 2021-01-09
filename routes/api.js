/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const mongoose = require("mongoose");
const { Book } = require("../models");
const BookModel = require("../models").Book;
const ObjectId = mongoose.Types.ObjectId;

module.exports = function (app) {
  app
    .route("/api/books")
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let arrayOfBooks = [];

      Book.find({}, (err, data) => {
        if (!err && data) {
          data.forEach((result) => {
            let book = result.toJSON();
            book["commentcount"] = book.comments.length;
            arrayOfBooks.push(book);
          });
          return res.json(arrayOfBooks);
        }
      });
    })

    .post(function (req, res) {
      let title = req.body.title;

      if (!title) {
        res.send("missing required field title");
      }
      //response will contain new book object including atleast _id and title

      let newBook = new Book({
        title: title,
        comments: [],
      });

      newBook.save((err, data) => {
        if (!err && data) {
          res.json(data);
        }
      });
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err, data) => {
        if (!err && data) {
          res.send("complete delete successful");
        }
      });
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      Book.findById(bookid, (err, data) => {
        if (!err && data) {
          res.send(data);
        } else if (!data) {
          return res.send("no book exists");
        }
      });
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let { comment } = req.body;
      //json res format same as .get

      Book.findById(bookid, (error, data) => {
        if (!data) {
          return res.json("no book exists");
        } else {
          if (!comment) {
            return res.send("missing required field comment");
          }else {
            data.comments.push(comment)
            data.save((err, data) => {
              if (!err && data) {
                res.json(data)
              }
            })
          }
        }
      });
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

      Book.findByIdAndDelete(bookid, (err, data) => {
        if (!err && data) {
          res.send("delete successful");
        } else if (!data) {
          return res.send("no book exists");
        }
      });
    });
};
