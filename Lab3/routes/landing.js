//landing page - the start of our web app -> needs to render a table
//TODO: add the table, link and route to buy something.
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('landing', { title:'Books',header: 'All the books in the bookstore!' });
});

module.exports = router;
