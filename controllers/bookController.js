const { default: mongoose } = require('mongoose');
const bookModel = require('../models/book')

var url = 'mongodb://127.0.0.1:27017/library'

// Get book by id
exports.getBook = async function (req, res) {
    try {
        await mongoose.connect(url);
        const books = await bookModel.findById(req.params.id).exec();
        res.render('details', { books: books, verifUser: req.session.userId })
    }
    catch (error) {
        console.error(error);
    }
    finally {
        mongoose.disconnect();
    }
}

// Get limited books from the database

exports.getLimitBooks = async function (req, res) {
    try {
        await mongoose.connect(url);
        const books = await bookModel.find().limit(3).exec()
        res.render('index', { books: books, verifUser: req.session.userId });
    } catch (error) {
        // Handle any errors that occurred during the find or rendering
        console.error(error);
    } finally {
        mongoose.disconnect();
    }
};


// Get all books from the database

exports.getAllBooks = async function (req, res) {
    try {
        await mongoose.connect(url);
        const books = await bookModel.find().exec()
        res.render('index', { books: books, verifUser: req.session.userId });
    } catch (error) {
        // Handle any errors that occurred during the find or rendering
        console.error(error);
    } finally {
        mongoose.disconnect();
    }
};


// exports.getAllBooks = function (req, res) {
//     mongoose.connect(url)
//         .then(() => {
//             return bookModel.find().exec();
//         })
//         .then(books => {
//             res.render('index', { books: books });
//         })
//         .catch(error => {
//             // Handle any errors that occurred during the find or rendering
//             console.error(error);
//         })
//         .finally(() => {
//             mongoose.disconnect();
//         });
// };



exports.getAddBook = async function (req, res, next) {
    res.render('addbook', { verifUser: req.session.userId, message: req.flash('message')[0], emessage: req.flash('emessage')[0] })
}


exports.addBook = async function (req, res, next) {
    try {
        await mongoose.connect(url);
        const { title, description, author, price } = req.body;
        const { userId } = req.session;     // heya session.userId 
        const { filename } = req.file;         // hethi heya file.filename
        image = filename
        const book = new bookModel({ title, description, author, price, image, userId });
        await book.save();
        req.flash('message', 'success')
        res.render('addbook', { verifUser: req.session.userId, message: req.flash('message')[0], emessage: req.flash('emessage')[0] })
    } catch (err) {
        req.flash('emessage', 'error')
        console.error(err);
    }
    finally {
        mongoose.disconnect()
    }
}


// Get my books from the database

exports.getMyBooks = async function (req, res) {
    try {
        await mongoose.connect(url);
        const books = await bookModel.find({userId:req.session.userId}).exec()
        res.render('mybooks', { books: books, verifUser: req.session.userId });
        console.log(req.session.userId)
        console.log(books)
    } catch (error) {
        // Handle any errors that occurred during the find or rendering
        console.error(error);
    } finally {
        mongoose.disconnect();
    }
};

  // Delete a book from the database
  exports.deleteBook = async function (req, res) {
    try {
       await mongoose.connect(url)
      const bookId = req.params.id;
      const books = await bookModel.findByIdAndDelete(bookId);
      res.redirect('/mybooks')
      if (!books) {
        mongoose.disconnect()
      }
      
    } catch (error) {
      console.error(error)
    }
  };
  
    
  exports.getupdateBook = async function(req,res){
    
    await mongoose.connect(url);
    const books = await bookModel.findById(req.params.id).exec()
    res.render('updateBook', { books: books, verifUser: req.session.userId,message: req.flash('message')[0], emessage: req.flash('emessage')[0] });
  }


  exports.postUpdate = async function (req, res) {
    try {
      await mongoose.connect(url);
  
      const { title, description, author, price } = req.body;
      let image = ""; // Initialize image variable
  
      // Check if a file is uploaded
      if (req.file) {
        const { filename } = req.file;
        image = filename;
      } else {
        // If no file is uploaded, use the existing image filename
        const existingBook = await bookModel.findById(req.params.id);
        if (existingBook) {
          image = existingBook.image;
        }
      }
  
      // Assuming req.params.id is used to identify the book to be updated
      const bookId = req.params.id;
  
      // Find the book by ID
      const existingBook = await bookModel.findById(bookId);
  
      if (!existingBook) {
        req.flash('emessage', 'Book not found');
        return res.redirect('/'); // Redirect to an appropriate page if the book is not found
      }
  
      // Update the book properties
      existingBook.title = title;
      existingBook.description = description;
      existingBook.author = author;
      existingBook.price = price;
      existingBook.image = image;
  
      // Save the updated book
      await existingBook.save();
  
      req.flash('message', 'Book updated successfully');
      res.redirect('/mybooks'); // Redirect to an appropriate page after successful update
    } catch (err) {
      req.flash('emessage', 'Error updating book');
      console.error(err);
    } finally {
      mongoose.disconnect();
    }
  };
  


  