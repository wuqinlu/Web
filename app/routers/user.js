const Router=require('koa-router');
// const jsonwebtoken=require('jsonwebtoken');
const jwt=require('koa-jwt');
const {secret}=require('../config')
const router=new Router({prefix:'/users'})
const {find,findById,create,update,delete:del,login,checkOwner,listFollowing,listFollowers,
    checkUserExist,follow,unfollow,followTopic,unfollowTopic,listFollowingTopic,listQuestions,
    listlikingAnswers,likeAnswer,unlikeAnswer,listDislikingAnswers,dislikeAnswer,undislikeAnswer,
    listCollectingAnswers,collectAnswer,uncollectAnswer}=require('../controllers/user')

const {checkTopicExist}=require('../controllers/topic');
const {checkAnswerExist}=require('../controllers/answer');

// const auth=async(ctx,next)=>{
//     const {authorization=''}=ctx.request.header;
//     const token=authorization.replace('Bearer ','');
//     try{
//         const user=jsonwebtoken.verify(token,secret);
//         ctx.state.user=user;
//     }catch(err){
//         ctx.throw(401,err.message);
//     }
//     await next();  
// }

const auth=jwt({secret});

/*RESTful API 最佳实践*/
router.get('/',find);
router.post('/',create);
router.get('/:id',findById);
router.patch('/:id',auth,checkOwner,update);
router.delete('/:id',auth,checkOwner,del);
router.post('/login',login);
router.get('/:id/followers',listFollowers);
router.get('/:id/following',listFollowing);
router.put('/following/:id',auth,checkUserExist,follow);
router.delete('/unfollow/:id',auth,unfollow);
router.put('/following/:id',auth,checkUserExist,follow);
router.delete('/unfollow/:id',auth,checkUserExist,unfollow);
router.put('/followingTopics/:id',auth,checkTopicExist,followTopic);
router.delete('/unfollowTopics/:id',auth,checkTopicExist,unfollowTopic);
router.get('/:id/followingTopics',listFollowingTopic);
router.get('/:id/questions',listQuestions);

router.get('/:id/likingAnswers',listlikingAnswers);
router.put('/likingAnswer/:id',auth,checkAnswerExist,likeAnswer,undislikeAnswer);
router.delete('/likingAnswer/:id',auth,checkAnswerExist,unlikeAnswer);

router.get('/:id/dislikingAnswers',listDislikingAnswers);
router.put('/dislikingAnswer/:id',auth,checkAnswerExist,dislikeAnswer,unlikeAnswer);
router.delete('/dislikingAnswer/:id',auth,checkAnswerExist,undislikeAnswer);

router.get('/:id/collectingAnswers',listCollectingAnswers);
router.put('/collectingAnswer/:id',auth,checkAnswerExist,collectAnswer,unlikeAnswer);
router.delete('/collectingAnswer/:id',auth,checkAnswerExist,uncollectAnswer);

module.exports=router;