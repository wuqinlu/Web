const Topic=require('../models/topics');
const User=require('../models/users');
const Question=require('../models/questions');
class TopicCtl{
    
    async find(ctx){
        const {page_per = 10,page=1}=ctx.query;
        const pages=Math.max(page*1,1)-1;
        const perPage=Math.max(page_per*1,1);
        ctx.body=await Topic.find({name:new RegExp(ctx.query.q)}).limit(perPage).skip(pages*perPage);
    }

    async checkTopicExist(ctx,next){
        const topic=await Topic.findById(ctx.params.id);
        if(!topic){ctx.throw(404,'话题不存在');}
        await next();
    }

    async findById(ctx){
        const {fields=''}=ctx.query;
        const selectFields=fields.split(';').filter(f=>f).map(f=>' +'+f).join('');
        const topic=await Topic.findById(ctx.params.id).select(selectFields);
        if(!topic){
            ctx.throw(404,'话题不存在');
        }
        ctx.body=topic;
    }

    async create(ctx){
        ctx.verifyParams({
            name:{type:'string',required:true},
            avatar_url:{type:'string',required:false},
            introduction:{type:'string',required:false}
        });
        const {name}=ctx.request.body;
        const repeatTopic=await Topic.findOne({name});
        if(repeatTopic){
            ctx.throw(409,'话题已存在');
        }
        const topic=await new Topic(ctx.request.body).save();
        ctx.body=topic;
    }

    async update(ctx){
        ctx.verifyParams({
            name:{type:'string',required:false},
            avatar_url:{type:'string',required:false},
            introduction:{type:'string',required:false}
        });
        
        const topic=await Topic.findByIdAndUpdate(ctx.params.id,ctx.request.body);
        if(!topic){
            ctx.throw(404,'话题不存在');
        }
        ctx.body=topic;
    }

    async listFollowers(ctx){
        const user=await User.find({followingTopics:ctx.params.id});
        ctx.body=user;
    }

    async listQuestions(ctx){
        const question=await Question.find({topics:ctx.params.id});
        ctx.body=question;
    }
}

module.exports=new TopicCtl();