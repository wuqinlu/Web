const Koa=require('koa');
const koabody=require('koa-body');
const error=require('koa-json-error');
const parameter=require('koa-parameter');
const mongoose=require('mongoose');
const path=require('path');
const koaStatic=require('koa-static');
const app=new Koa();
const {connectionStr}=require('./config');
const routing=require('./routers');

mongoose.connect(connectionStr,()=>console.log('MongoDB 连接成功！'));
mongoose.connection.on('error',console.error);


app.use(error({
    postFormat:(e,{stack,...rest})=>process.env.NODE_ENV=='production'?rest:{stack,...rest}
}));

// app.use(async(ctx,next)=>{
//     try {
//        await next();
//     } catch (err) {
//         ctx.status=err.status||err.statusCode||500;
//         ctx.body={
//             message:err.message
//         }
//     }
// });
app.use(koaStatic(path.join(__dirname,'public')));
app.use(koabody({
    multipart:true,
    formidable:{
        uploadDir:path.join(__dirname,'/public/uploads'),
        keepExtensions:true
    }
}));
app.use(parameter(app));
routing(app);

app.listen(3000,()=>console.log('程序启动在 3000 端口了'));


// const auth=async (ctx,next)=>{
//     if(ctx.url!=="/users"){
//         ctx.throw(401);
//     }
//     await next();
// }
// // 洋葱模型
// app.use(async (ctx,next)=>{
//     console.log(1);
//     await next();
//     console.log(2);
//     ctx.body='Hello ZhiHu ApI 20210901';
// });

// app.use(async (ctx,next)=>{
//     console.log(3);
//     await next();
//     console.log(4);
// });

// app.use(async (ctx)=>{
//     console.log(5);
// });

/*Chorme 控制台 换行不执行命令快捷键-shift+enter*/
// fetch('//api.github.com/users').then(res=>res.json()).then(
//     json=>{
//         console.log(json);
//         fetch('//api.github.com/users/lewis617').then(res=>res.json()).then(json2=>{
//         console.log(json2);
//         });
// });

// (async()=>{
//     const res=await fetch("//api.github.com/users");
//     const json=await res.json();
//     console.log(json);
//     const res2=await fetch("//api.github.com/users/lewis617");
//     const json2=await res2.json();
//     console.log(json2);
//    })()

/*自己编写koa路由中间件*/
// app.use(async (ctx)=>{
//     if(ctx.url==="/"){
//         ctx.body="这是主页";
//     }else if(ctx.url==="/users"){
//         if(ctx.method==="GET"){
//             ctx.body="这是用户列表页";
//         }else if(ctx.method==="POST"){
//             ctx.body="创建用户"
//         }else{
//             ctx.status=405;
//         }
//     }else if(ctx.url.match(/\/users\/(\w+)/)){
//         const userId=ctx.url.match(/\/users\/(\w+)/)[1];
//         ctx.body=`这是用户：${userId}`;
//     }else{
//         ctx.status=404;
//     }
// })

/*使用Koa-router实现路由*/

// usersRouter.get('/',auth,(ctx)=>{
//     ctx.body="这是用户列表";
// });
// usersRouter.post('/',auth,(ctx)=>{
//     ctx.body="创建用户";
// });
// usersRouter.post('/:id',auth,(ctx)=>{
//     ctx.body=`用户：${ctx.params.id}`;
// });



