var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CLUE' });
});

router.get('/test',function(req,res,next){
  res.render('test');
})


router.post('/guess',function(req,res,next){
  console.log(req.params.body);
  next();
});


router.get('/scores',function(req,res,next){

})
module.exports = router;
