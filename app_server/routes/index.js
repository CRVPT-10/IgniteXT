var express = require('express');
var router = express.Router();

const ctrlMain = require('../controllers/main');
console.log(ctrlMain); 

/*GET homepage*/
router.get('/', ctrlMain.home);
router.get('/student_login', ctrlMain.student_login);
router.get('/faculty_login', ctrlMain.faculty_login);
router.get('/roadmaps', ctrlMain.roadmaps);



module.exports = router;
