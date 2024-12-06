const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username
  console.log(username)
  const password = req.body.password
  if (username && password) {
    // Check if the user does not already exist
    if (!doesExist(username)) {
        // Add the new user to the users array
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
}
// Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   return res.send(JSON.stringify(books, null, 4))
// });

// // Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   let book = books[req.params.isbn]
//   return res.send(JSON.stringify(book));
//  });
  
// // Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
 
//  const keys = Object.keys(books)
//   let booksByAuthor = {}
//   keys.forEach(key => {
//     if (books[key].author === req.params.author) {
//       booksByAuthor[key] = books[key]
//     }
//   });
//   return res.send(JSON.stringify(booksByAuthor));
// });

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   const keys = Object.keys(books)
//   let booksByTitle = {}
//   keys.forEach(key => {
//     if (books[key].title === req.params.title) {
//       booksByTitle[key] = books[key]
//     }
//   });
//   return res.send(JSON.stringify(booksByTitle))
// });
public_users.get('/', function (req, res) {
  return new Promise((resolve, reject) => {
    try {
      // Simulate potential async operation (though this is synchronous in reality)
      resolve(books);
    } catch (error) {
      reject(error);
    }
  })
  .then(allBooks => {
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  })
  .catch(err => {
    return res.status(500).json({ message: 'Error retrieving books', error: err.message });
  });
});

public_users.get('/isbn/:isbn', function (req, res) {
  return Promise.resolve(books[req.params.isbn])
    .then(book => {
      if (!book) {
        throw new Error('Book not found');
      }
      return res.status(200).send(JSON.stringify(book));
    })
    .catch(err => {
      return res.status(404).json({ message: err.message });
    });
});

public_users.get('/author/:author', function (req, res) {
  return Promise.resolve(Object.keys(books))
    .then(keys => {
      const booksByAuthor = keys.reduce((acc, key) => {
        if (books[key].author === req.params.author) {
          acc[key] = books[key];
        }
        return acc;
      }, {});

      if (Object.keys(booksByAuthor).length === 0) {
        throw new Error('No books found for this author');
      }

      return res.status(200).send(JSON.stringify(booksByAuthor));
    })
    .catch(err => {
      return res.status(404).json({ message: err.message });
    });
});

public_users.get('/title/:title', function (req, res) {
  return new Promise((resolve, reject) => {
    try {
      const keys = Object.keys(books);
      let booksByTitle = {};
      
      keys.forEach(key => {
        if (books[key].title === req.params.title) {
          booksByTitle[key] = books[key];
        }
      });

      if (Object.keys(booksByTitle).length > 0) {
        resolve(booksByTitle);
      } else {
        reject(new Error('No books found with this title'));
      }
    } catch (error) {
      reject(error);
    }
  })
  .then(booksByTitle => {
    return res.status(200).send(JSON.stringify(booksByTitle));
  })
  .catch(err => {
    return res.status(404).json({ message: err.message });
  });
});
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.send(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
