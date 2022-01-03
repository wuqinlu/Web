const Router=require('koa-router');
const jwt=require('koa-jwt');
const {secret}=require('../config')
const router=new Router({prefix:'/questions/:questionId/answers/:answerId/comments'});
const {find,findById,create,update,checkCommentExist,checkCommentator,delete:del}=require('../controllers/comment');

const auth=jwt({secret});

router.get('/',find);
router.post('/',auth,create);
router.get('/:id',checkCommentExist,findById);
router.patch('/:id',auth,checkCommentExist,checkCommentator,update);
router.delete('/:id',checkCommentExist,auth,checkCommentator,del);

module.exports=router;