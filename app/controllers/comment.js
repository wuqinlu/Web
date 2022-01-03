const Comment=require('../models/comments');
class CommentCtl{
    
    async find(ctx){
        const {page_per = 10,page=1}=ctx.query;
        const pages=Math.max(page*1,1)-1;
        const perPage=Math.max(page_per*1,1);
        const q=new RegExp(ctx.query.q);
        const {questionId,answerId}=ctx.params;
        const {rootCommentId}=ctx.query;
        ctx.body=await Comment.find({content:q,questionId,answerId,rootCommentId})
        .limit(perPage).skip(pages*perPage).populate('commentator replyTo');
    }

    async checkCommentExist(ctx,next){
        const comment=await Comment.findById(ctx.params.id).select('+commentator');
        if(!comment){ctx.throw(404,'评论不存在');}
        if(ctx.params.questionId&&comment.questionId!==ctx.params.questionId){ctx.throw(404,'该问题下没有此评论')}
        if(ctx.params.answerId&&comment.answerId!==ctx.params.answerId){ctx.throw(404,'该答案下没有此评论')}
        ctx.state.comment=comment;
        await next();
    }

    async findById(ctx){
        const {fields=''}=ctx.query;
        const selectFields=fields.split(';').filter(f=>f).map(f=>' +'+f).join('');
        const comment=await Comment.findById(ctx.params.id).select(selectFields).populate('commentator');
        if(!comment){
            ctx.throw(404,'评论不存在');
        }
        ctx.body=comment;
    }

    async create(ctx){
        ctx.verifyParams({
            content:{type:'string',required:true},
            rootCommentId:{type:'string',required:false},
            replyTo:{type:'string',required:false}
        });
        const commentator=ctx.state.user._id;
        const {questionId,answerId}=ctx.params;
        const comment=await new Comment({...ctx.request.body,commentator,questionId,answerId}).save();
        ctx.body=comment;
    }
    
    async checkCommentator(ctx,next){
        const {comment}=ctx.state;
        if(comment.commentator.toString()!==ctx.state.user._id){
            ctx.throw(403,'您没有权限操作');
        }
        await next();
    }

    async update(ctx){
        ctx.verifyParams({
            content:{type:'string',required:false}
        });        
        const {content}=ctx.request;
        await ctx.state.comment.update({content});
        ctx.body=ctx.state.comment;
    }

    async delete(ctx){
        await Comment.findByIdAndRemove(ctx.params.id);
        ctx.status=204;
    }
}

module.exports=new CommentCtl();