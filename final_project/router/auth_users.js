const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user) => {
  return (user.username === username && user.password === password)
})
if (validusers.length > 0) {
  return true
} else {
  return false
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username
  const password = req.body.password

  if (!username || !password) {
    return res.status(404).json({message: "Error loging in"})
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'fingerprint_customer', {expiresIn: 60*60})
    req.session.authorization = {
      accessToken, username
    }
    console.log(accessToken)
    return res.status(200).send("User succesfully login")
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  books[req.params.isbn].reviews[req.session.authorization.username] = req.body.review
  return res.send(books[req.params.isbn]);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  delete books[req.params.isbn].reviews[req.session.authorization.username]
  return res.send(books[req.params.isbn]);
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
