var cx = 620;
var cy = 620;
var svgns = "http://www.w3.org/2000/svg";

window.onload = function() {
	var d = document.getElementsByClassName("svg_circle")[0];
	var w=getViewportSize().w,
		h=getViewportSize().h;
	d.setAttribute("width",w+"px");
	d.setAttribute("height",h+"px");

	var circles = document.createElementNS(svgns,"svg:svg");
	circles.setAttribute("viewBox","0 0 1300 1000");
	circles.setAttribute("overflow-y","hidden");
	for(var i=0;i<5;i++) {
		var rx = 120*(i+1),
			ry = 120*(i+1),
			n = 25*Math.pow(1.3,i);
		draw_g(rx,ry,n,"svgjs"+i,function(g) {
			circles.appendChild(g);
		});
	}
	d.appendChild(circles);
	displaydot();
}

function draw_g(rx,ry,n,g_id,callback) {
	var g = document.createElementNS(svgns,"g");
	var circles = 
	g.setAttribute("id",g_id);

	var ellipse = document.createElementNS(svgns,"ellipse");
	ellipse.setAttribute("id",g_id+"g");
	ellipse.setAttribute("cx",cx);
	ellipse.setAttribute("cy",cy);
	ellipse.setAttribute("rx",rx);
	ellipse.setAttribute("ry",ry);
	g.appendChild(ellipse);

	compute(rx,n,function(poss){
		var pos;
		for (i in poss) {
			var pos=poss[i];
			var dot = document.createElementNS(svgns,"ellipse");
			dot.setAttribute("id",g_id+""+pos[2]);
			dot.setAttribute("class","point");
			dot.setAttribute("cx",pos[0]);
			dot.setAttribute("cy",pos[1]);
			dot.setAttribute("rx",5);
			dot.setAttribute("ry",5	);
			dot.setAttribute("opacity","0");
			g.appendChild(dot);
		}
	});
	callback(g);
}

function compute(r,n,callback) {
	var pi = Math.PI,
		sin = Math.sin,
		cos = Math.cos;
	var delta_a = 2*pi/(n*4/3);
	var angs=[];
	for(var i=0;i<n;i++) {
		angs[i]=i*delta_a;
	}
	var poss = angs.map(function(x,index) {
		var p_cy = r*sin(x)+cy;
		var p_cx = r*cos(x)+cx;
		return [p_cx,p_cy,index];
	});
	callback(poss)
}

function displaydot() {
	var dots = $(".point");
	dots = dots.slice(0,-1);
	for (var i = dots.length - 1;i>=0;i--) {
		var ran = Math.random();
		var index = Math.floor(i*ran);
		dots[index].style.cssText = "animation-delay: "+(4*ran)+"s";
		dots[index].style.cssText = "-webkit-animation-delay: "+(6*ran)+"s";
		//dots[index].setAttribute("webkitAnimationDelay",(5*ran)+"s");
	}
}


function getViewportSize() {
	w=window;
	if (w.innerWidth != null) return {w: w.innerWidth,h:innerHeight};

	var d=w.document;
	if (document.compatMode == "CSS1Compat")
		return {
			w: d.documentElement.clientWidth,
			h: d.documentElement.clientHeight
		};
	return {w:d.body.clientWidth, h: d.body.clientHeight};
}