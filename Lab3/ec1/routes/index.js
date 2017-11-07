/* GET home page. */

//landing page - the start of our web app -> needs to render a table
//TODO: add the table, link and route to buy something.
var express = require('express');
var router = express.Router();
var session = require('express-session');
var auth = require('../middleware/auth');
var redis = require('../middleware/redis');

var books = [{
  id: 0,
  title: 'War and Peace',
  series: 1,
  author: 'Lev Nicolayevich Tolstoy',
  desc: "aslkfjalkd jfalksfda ",
  genre: 'Historical Fiction',
  price: 100
},{
  id: 1,
  title: 'Harry Potter and the Philosophers Stone',
  series: 1,
  author: 'J K Rowling',
  genre: 'Fiction',
  desc: "aslkfjalkd jfalksfda ",
  price: 20,
}, {
  id: 2,
  title: 'Harry Potter and the Chamber of Secrets',
  series: 2,
  author: 'J K Rowling',
  genre: 'Fiction',
  desc: "efasfasdfjlkjaslkfjaslkfjaslkdfjasldfjal;skfasdlfjalskdf jfalksfda ",
  price: 25,
}, {
  id: 3,
  title: 'Harry Potter and the Prizoner of Azkaban',
  series: 3,
  author: 'J K Rowling',
  genre: 'Fiction',
  desc: "aslkfjalkd jfalksfda ",
  price: 33,
}, {
  id: 4,
  title: 'Harry Potter and the Goblet of Fire',
  series: 4,
  author: 'J K Rowling',
  genre: 'Fiction',
  desc: "aslkfjalkd jfalksfda ",
  price: 23,
}, {
  id: 5,
  title: 'Harry Potter and the Order of the Phoenix',
  series: 5,
  author: 'J K Rowling',
  desc: "aslkfjalkd jfalksfda ",
  genre: 'Fiction',
  price: 22
}, {
  id: 6,
  title: 'Harry Potter and the Half blood Prince',
  series: 6,
  author: 'J K Rowling',
  desc: "aslkfjalkd jfalksfda ",
  genre: 'Fiction',
  price: 32,
}, {
  id: 7,
  title: 'Harry Potter and the Deathly Hallows',
  series: 7,
  author: 'J K Rowling',
  desc: "aslkfjalkd jfalksfda ",
  genre: 'Fiction',
  price: 38
}, {
  id: 8,
  title: 'Lord of the Rings: The Fellowship of the Ring',
  series: 1,
  author: 'JRR Tolkeing',
  desc: "aslkfjalkd jfalksfda ",
  genre: 'Fiction',
  price: 38
}, {
  id: 9,
  title: 'Lord of the Rings: The Two Towers',
  series: 2,
  author: 'JRR Tolkein',
  genre: 'Fiction',
  desc: "aslkfjalkd jfalksfda ",
  price: 32
}, {
  id: 10,
  title: 'Lord of the Rings: The Return of the King',
  series: 3,
  author: 'JRR Tolkein',
  desc: "aslkfjalkd jfalksfda ",
  genre: 'Fiction',
  price: 30
}];

/* GET home page. */
router.get('/landing', auth.fauth,function(req, res, next) {
  res.render('index', {
    title: 'Books',
    header: 'Shop around for books',
    books: books,
    user:req.session.user
  });
});

router.get('/',function(req,res){
  res.redirect('/landing');
});
router.get('/login', auth.fauth,function(req, res, next) {
  res.render('login');
});

router.get('/signin', auth.auth, function(req, res, next) {
  console.log(req.session.user);
  res.redirect('/landing');
});

router.post('/signin', auth.auth, function(req, res, next) {
  console.log(req.session.user);
  console.log();
  res.render('loggedin', {
    user: req.session.user
  });
});
router.get('/list', auth.auth, function(req, res, next) {
  res.render('shop', {
    title: 'shop around!!',
    user: req.session.user,
    books: books
  });
});

var calculate = function(quantity, selectedBooks) {
  var cart = {
    qty: quantity,
    books: [],
    total: 0,
    card: 0,
    cardType: 'MasterCard',
    exp: 'no'
  }
  if (typeof selectedBooks === 'string') {
    var booknpr = selectedBooks.split(',');
    cart.books.push({
      title: booknpr[0],
      price: parseInt(booknpr[1]),
      totalPrice: parseInt(booknpr[1] * cart.qty)
    });
    cart.total = parseInt(booknpr[1]) * cart.qty;
  } else {
    for (var i = 0; i < selectedBooks.length; i++) {
      var bookandprice = selectedBooks[i].split(',');
      cart.books.push({
        title: bookandprice[0],
        price: parseInt(bookandprice[1]),
        totalPrice: parseInt(bookandprice[1]) * cart.qty
      });
      cart.total += (bookandprice[1] * cart.qty);
    }
  }
  console.log('adding cart to session');
  return cart;
}

router.get('/purchase', auth.auth, function(req, res, next) {
  res.redirect('/landing');
});
router.post('/purchase', auth.auth, function(req, res, next) {
  console.log('redis value');
  console.log(redis.get(req.session.user.name.toString(),function(err,result){
    console.log("REFIS ");
    console.log(result);
  }));
  var cart = calculate(parseInt(req.body.Quantity), req.body.Books);
  req.session.user.cart = cart;
  res.render('purchase', {
    title: 'your shopping cart ',
    cart: cart,
    user:req.session.user
  })
});

router.get('/confirm', auth.auth, function(req, res, next) {
  res.redirect('/landing');
});
router.post('/confirm', auth.auth, function(req, res, next) {
  // req.session.user.cart.card = req.card
  req.session.user.cart.card = req.body.Cardnumber;
  req.session.user.cart.cardType = req.body.Creditcard;
  req.session.user.cart.exp = (req.body.expressdelivery === 'on') ? 'yes' : 'no';

  res.render('confirm', {
    title: 'confirmation page',
    customer: req.session.user
  });
});

router.get('/logout', auth.unauth, function(req, res, next) {
  res.redirect('/landing');
});

router.get('/books/:id', function(req, res) {
  for (var i = 0; i < books.length; i++) {
    if (books[i].id === parseInt(req.params.id)) {
      console.log(i);
      res.render('book', {
        book: {
          title: books[i].title,
          desc: books[i].desc
        }
      });
    }
  }
  if (i == books.length) {
    console.log('i greater');
    res.render('error', {
      error: {
        message: 'book doesnt exist',
        stack: 'book no exist :P'
      }
    });
  }
});


router.get('/admin',auth.admin,function(req,res,next){
  if(req.session.admin){
    res.redirect('/adminSuc');
  }
  else{
    res.redirect('/admin/signin');
  }
})
router.get('/admin/signin',function(req, res, next) {
    res.render('adminlogin');
});

router.post('/admin/signin',auth.admin,function(req,res,next){
  res.render('adminSuc');
})
router.get('/admin/manage',auth.admin,function(req,res,next){
  res.render('admin',{books:books});
});

router.post('/admin/addbook',auth.admin,function(req,res,next){
  console.log('here admin');
  console.log(req.body);
  if(req.body.title===undefined || req.body.title === '' ){
    res.render('error',{error:{message:'invalid book title ',stack:'really? couldnt type one title?'}});
  }else if(req.body.id === undefined || req.body.id === ''){
    res.render('error',{error:{message:'invalid book id ',stack:'yep... the id is important'}});
  }
  else if(req.body.author === undefined || req.body.author === ''){
    res.render('error',{error:{message:'invalid book author ',stack:'why would you do that?'}});
  }
  else if(req.body.price === undefined || req.body.price === 'i would ask you to pick a number between 1 and 20,but if you wanna keep up with the stupid numbners, go ahead'){
    if(req.body.price<0){
    res.render('error',{error:{message:'invalid price value ',stack:''}});
    }
    if(req.body.price>1000){
    res.render('error',{error:{message:'invalid price value ',stack:'you are being unreasonable here'}});
    }
    res.render('error',{error:{message:'invalid price value ',stack:''}});
  }else{
    var thisBook =   {
        id: req.body.id,
        title: req.body.title,
        author: req.body.author,
        price: req.body.price
      };
    books.push(thisBook);
    console.log(books);
    res.render('bookAdded',{book:thisBook,message:'has been added'});
  }

//    books.removeValue(id,req.body.id);
  //  console.log(books);


});

router.get('/admin/delete/:id',auth.admin,function(req,res,next){
  for(var i =0;i<books.length;i++){
    if(books[i].id === parseInt(req.params.id)){
      var thisBook = books[i];
      books.splice(i,1);
      res.render('bookAdded',{book:thisBook,message:'has been deleted'})
    }
  }
  console.log(i);
});


router.get('/admin/logout',auth.unadmin,function(req,res,next){
  res.redirect('/landing');
})
module.exports = router;
