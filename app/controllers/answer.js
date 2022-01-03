const Answer=require('../models/answers');
class AnswerCtl{
    
    async find(ctx){
        const {page_per = 10,page=1}=ctx.query;
        const pages=Math.max(page*1,1)-1;
        const perPage=Math.max(page_per*1,1);
        const q=new RegExp(ctx.query.q);
        ctx.body=await Answer.find({content:q,questionId:ctx.params.questionId})
        .limit(perPage).skip(pages*perPage);
    }

    async checkAnswerExist(ctx,next){
        const answer=await Answer.findById(ctx.params.id).select('+answerer');
        if(!answer){ctx.throw(404,'答案不存在');}
        // 只有删改查答案的时候才检查此逻辑，赞、踩答案不检查
        if(ctx.params.questionId&&answer.questionId!==ctx.params.questionId){ctx.throw(404,'该问题下没有此答案')}
        ctx.state.answer=answer;
        await next();
    }

    async findById(ctx){
        const {fields=''}=ctx.query;
        const selectFields=fields.split(';').filter(f=>f).map(f=>' +'+f).join('');
        const answer=await Answer.findById(ctx.params.id).select(selectFields).populate('answerer');
        if(!answer){
            ctx.throw(404,'问题不存在');
        }
        ctx.body=answer;
    }

    async create(ctx){
        ctx.verifyParams({
            content:{type:'string',required:true}
        });
        const answerer=ctx.state.user._id;
        const {questionId}=ctx.params;
        const answer=await new Answer({...ctx.request.body,answerer,questionId}).save();
        ctx.body=answer;
    }
    
    async checkAnswer(ctx,next){
        const {answer}=ctx.state;
        if(answer.answerer.toString()!==ctx.state.user._id){
            ctx.throw(403,'您没有权限操作');
        }
        await next();
    }

    async update(ctx){
        ctx.verifyParams({
            content:{type:'string',required:false}
        });        
        await ctx.state.answer.update(ctx.request.body);
        ctx.body=ctx.state.answer;
    }

    async delete(ctx){
        await Answer.findByIdAndRemove(ctx.params.id);
        ctx.status=204;
    }
}

module.exports=new AnswerCtl();