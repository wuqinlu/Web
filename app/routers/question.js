const Router=require('koa-router');
const jwt=require('koa-jwt');
const {secret}=require('../config')
const router=new Router({prefix:'/questions'});
const {find,findById,create,update,checkQuestionExist,checkQuestioner,delete:del}=require('../controllers/question');

const auth=jwt({secret});

router.get('/',find);
router.post('/',auth,create);
router.get('/:id',checkQuestionExist,findById);
router.patch('/:id',auth,checkQuestionExist,checkQuestioner,update);
router.delete('/:id',checkQuestionExist,auth,checkQuestioner,del);

module.exports=router;