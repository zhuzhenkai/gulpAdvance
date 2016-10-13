
//js的引入接口

//引入swiper
var Swiper=require('./components/swiper/swiper-3.3.1.min');

var SwiperAnimate=require('./components/swiper/swiper.animate1.0.2.min'); 

var $ = require('./components/zepto-modules/_custom'); 

var IScroll=require('./components/iscroll/iscroll'); 


$('#mainContent').hide();
$('#btn').on('tap',function(){
	$('.swiper-container').hide();
	$('#mainContent').show();
	
	$.post('/api/skill',{},function(response){
		var html='';
		for(var i=0;i<response.length;i++){
			html+='<li>'+response[i].category+'</li>';
			$('#scroller ul').html(html);
			myScroll = new IScroll('#wrapper', { mouseWheel: true });
			document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		}
	})
})

$('#footer div').on('tap',function(){
	var Name=$(this).attr('id');
	$.post('/api/'+Name,{},function(response){
		var html='';
		for(var i=0;i<response.length;i++){
			html+='<li>'+response[i].category+'</li>';
			$('#scroller ul').html(html);
			myScroll = new IScroll('#wrapper', { mouseWheel: true });
			document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		}
	})
})


var mySwiper = new Swiper ('.swiper-container', {
	 	
		onInit: function(swiper){ //Swiper2.x的初始化是onFirstInit
		    SwiperAnimate.swiperAnimateCache(swiper); //隐藏动画元素 
		    SwiperAnimate.swiperAnimate(swiper); //初始化完成开始动画
		  }, 
		onSlideChangeEnd: function(swiper){ 
		    SwiperAnimate.swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
		} 
  	});  




// var interval=setInterval(function(){
// 	if(document.readyState==='complete'){
// 		clearInterval(interval);
// 		$('#preload').hide();
// 		$('.swiper-container').show();
// 		mySwiper.updateContainerSize();
// 		mySwiper.updateSlidesSize();
// 	}else{
// 		$('#preload').show();
// 	}
// },100);
