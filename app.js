const Koa = require('koa');
const render = require('koa-ejs');
const path = require('path');
const serve = require('koa-static');
const session = require('koa-session')
const flash = require('koa-flash');
//const bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body')
const scss= require('koa-scss')
const app = new Koa;
app.use(koaBody({
  multipart: true,
  strict : false
}))
//app.use(bodyParser());
app.keys = ['some secret hurr1'];
const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
 
app.use(session(CONFIG, app));
app.use(scss({
  src:  __dirname + '/assets/scss',
  dest: __dirname + '/assets/',
}));
app.use(flash());
//const views = require('koa-views')
const staticpath = serve(path.join(__dirname, './assets'))
//app.use(views('views',{map: {html:'ejs'}}));
//app.use(views('views',{
//  extension:'ejs'  /*应用ejs模板引擎*/
//}))
const controller = require('./controller.js')
app.use(async (ctx,next) =>{
    console.log(`Process ${ctx.method} ${ctx.url}`)
    await next();
})
app.use(staticpath)
app.use(async function(ctx,next) {
    ctx.state.error = ctx.flash.error;
    ctx.state.success = ctx.flash.success;
    await next()
});
app.use(async (ctx, next) => {
  var user = tryGetUserFromSession(ctx);
  if (user) {
      ctx.state.user = user;
      await next();
  } else{
     ctx.state.user = null;
     await next();
  }
});
render(app, {
  root: path.join(__dirname, 'views'),
  layout: 'layout',
  viewExt: 'ejs',
  cache: false,
  debug: false
});
Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
app.use(controller())
function tryGetUserFromSession(res){
   let user;
   user = res.session.userinfo;
   return user;
}

app.listen('3001',
  ()=>console.log('app listen at 3001')
)