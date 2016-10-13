var gulp=require('gulp');
var sass = require('gulp-sass');
var url=require('url');
var fs=require('fs');
var webserver=require('gulp-webserver');
var minifyCss=require('gulp-minify-css');

//丑化
var uglify=require('gulp-uglify');

//模块化打包工具
var webpack=require('gulp-webpack');

//命名模块
var named=require('vinyl-named');

//版本模块
var rev=require('gulp-rev');  

//版本控制模块
var revCollector=require('gulp-rev-collector');

//监控模块
var watch=require('gulp-watch');

//队列模块
var sequence=require('gulp-watch-sequence');

//压缩html
var minifyHTML=require('gulp-minify-html');







gulp.task('copy-index',function(){
	return gulp.src('./src/index.html').pipe(gulp.dest('./www'));
})

gulp.task('images',function(){
      return gulp.src('./src/images/**/*')
      .pipe(gulp.dest('./www/img'));
})

gulp.task('audio',function(){
      return gulp.src('./src/audio/**')
      .pipe(gulp.dest('./www/audio'));
})

gulp.task('webserver', function() {
  gulp.src('www')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: true,
      // port:8080,//端口号，可以进行多项目操作

      //实现Mock数据原理：
      //1，在浏览器里输入url地址，比如：http://localhost、queryList
      //2，系统通过判断，获取到url的地址参数，即queryList
      //通过url的地址参数queryList，去查找相应的json文件
      middleware:function(req,res,next){
      	var urlObj=url.parse(req.url,true),
      	method=req.method;
      	// console.log(urlObj);
      	switch(urlObj.pathname){
      		case'/api/skill':
      		//设置的头信息
      		res.setHeader('Content-Type','application/json');
      		//读取本地的json文件，并读的信息内容编码，然后将内容转成data数据返回
      		fs.readFile('mock/skill.json','utf-8',function(err,data){
      			//res的全称是response，end是结束的意思，就是把data数据渲染带浏览器上
      			res.end(data);
      		});
      		return;

      		case'/api/project':
      		//设置的头信息
      		res.setHeader('Content-Type','application/json');
      		//读取本地的json文件，并读的信息内容编码，然后将内容转成data数据返回
      		fs.readFile('mock/project.json','utf-8',function(err,data){
      			//res的全称是response，end是结束的意思，就是把data数据渲染带浏览器上
      			res.end(data);
      		});
      		return;

      		case'/api/work':
      		//设置的头信息
      		res.setHeader('Content-Type','application/json');
      		//读取本地的json文件，并读的信息内容编码，然后将内容转成data数据返回
      		fs.readFile('mock/work.json','utf-8',function(err,data){
      			//res的全称是response，end是结束的意思，就是把data数据渲染带浏览器上
      			res.end(data);
      		});
      		return;
      	}

      	next();//这行代码很重要，解决的是循环操作
      }// end middleware


    }));
});

//将sass进行转换
gulp.task('sass',function(){
	return gulp.src('./src/styles/**/*.scss').pipe(sass()).pipe(gulp.dest('www/css'))
})

//js模块化管理
var jsFiles=['src/scripts/index.js'];

//打包js
gulp.task('packjs',function(){
      return gulp.src(jsFiles)
      .pipe(named())
      .pipe(webpack())
      // .pipe(uglify())
      .pipe(gulp.dest('www/js'))
})

//版本控制
var cssDistFiles=['www/css/style.css'];
var jsDistFiles=['www/js/index.js'];


//css的ver控制
gulp.task('verCss',function(){
      return gulp.src(cssDistFiles)

      //生成一个版本
      .pipe(rev())

      //复制到制定文件夹
      .pipe(gulp.dest('www/css'))

      //生成版本对应的映射关系
      .pipe(rev.manifest())

      //将映射文件输出到制定目录
      .pipe(gulp.dest('www/ver/css'))
})

//js的ver控制
gulp.task('verJs',function(){
      return gulp.src(jsDistFiles)

      //生成一个版本
      .pipe(rev())

      //复制到制定文件夹
      .pipe(gulp.dest('www/js'))

      //生成版本对应的映射关系
      .pipe(rev.manifest())

      //将映射文件输出到制定目录
      .pipe(gulp.dest('www/ver/js'))
})


//对html文件的版本内容的替换
gulp.task('html',function(){
      return gulp.src(['www/ver/**/*.json','www/*.html'])
      .pipe(revCollector({replaceReved:true}))
      .pipe(gulp.dest('www/'))
})


//设置监控
gulp.task('watch',function(){
      gulp.watch('./src/index.html',['copy-index']);
      gulp.watch('./src/images/**/*',['images']);
      gulp.watch('./src/audio/**',['audio']);

      var queue=sequence(300);//队列

       watch('src/styles/**/*.*',{
            name:'CSS',
            emitOnGlob:false,      
      }, nj 
      queue.getHandler('sass','verCss','html'));
      watch('src/scripts/**/*.js',{
            name:'JS',
            emitOnGlob:false,      
      },
      queue.getHandler('packjs','verJs','html'));
      
      
     
})

//设置默认任务
gulp.task('default',['webserver','watch']);