const Router=require('koa-router');
const jwt=require('koa-jwt');
const {secret}=require('../config')
const router=new Router({prefix:'/questions/:questionId/answers'});
const {find,findById,create,update,checkAnswerExist,checkAnswer,delete:del}=require('../controllers/answer');

const auth=jwt({secret});

router.get('/',find);
router.post('/',auth,create);
router.get('/:id',checkAnswerExist,findById);
router.patch('/:id',auth,checkAnswerExist,checkAnswer,update);
router.delete('/:id',checkAnswerExist,auth,checkAnswer,del);

module.exports=router;