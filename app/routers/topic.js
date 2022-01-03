const Router=require('koa-router');
const jwt=require('koa-jwt');
const {secret}=require('../config')
const router=new Router({prefix:'/topics'});
const {find,findById,create,update,checkTopicExist,listFollowers,listQuestions}=require('../controllers/topic');

const auth=jwt({secret});

router.get('/',find);
router.post('/',auth,create);
router.get('/:id',checkTopicExist,findById);
router.patch('/:id',auth,checkTopicExist,update);
router.get('/:id/topicFollowing',auth,checkTopicExist,listFollowers);
router.get('/:id/questions',auth,checkTopicExist,listQuestions);

module.exports=router;