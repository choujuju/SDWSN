window.onload = function () {
	draw_svg_circles();
	$("a").hover(function() {
		$(this).css("color","#03c4eb").css("border-color","#b6f3ff");
	},function() {
		$(this).css("color","#03034b").css("border-color","#f2f2f2");
	});
	$("li a,.button").hover(function() {
		$(this).css("color","#03c4eb").css("border-color","#b6f3ff");
	},function(){
		$(this).css("color","#aaabbb").css("border-color","#aaabbb");
	});
	$(".close .iconfont").hover(function(){
		$(this).css("color","#03c4eb").css("background-color","#fff").css("border-color","#B6F3FF");
	},function(){
		$(this).css("color","#aaabbb").css("background-color","#f2f2f2").css("border-color","#e6e6ed");
	});
	$(".share-button").click(function(){
		$("#page-cover").css("display","block").css("opacity",".8");
		$("#share").css("top","200px");
	});
	$(".close,#page-cover").click(function(){
		$("#page-cover").css("display","none").css("opacity","0");
		$("#share").css("top","-700px");
	});
	
};
