//
//--------------------------------circle---------------------------------------
	var cx = 620;
	var cy = 620;
	var svgns_circle = "http://www.w3.org/2000/svg";

	function draw_svg_circles() {
		var d = document.getElementsByClassName("svg_circle")[0];
		var w=getViewportSize().w,
			h=getViewportSize().h;
		d.setAttribute("width",w+"px");
		d.setAttribute("height",h+"px");

		var circles = document.createElementNS(svgns_circle,"svg:svg");
		circles.setAttribute("viewBox","0 430 1250 1000");
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
				dot.setAttribute("rx",4);
				dot.setAttribute("ry",4);
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
			dots[index].style.cssText = "-webkit-animation-delay: "+(4*ran)+"s";
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

//---------------------------------topo----------------------------------------
	//
	var svgns_topo = "http://www.w3.org/2000/svg";
	function draw_svg_topo() {
	}

//-----------------------------INVESTMENTS--------------------------------------
if ( !Modernizr.svg || isMobile ) {
		$('#companies').addClass('no-svg');
    }
    else {
	  	  
  		$(function(){
  
  			var SVG_INSTANCE = SVG('investment-canvas').size('100%', '100%')
  			var CANVAS = SVG_INSTANCE.group();
  
  			// ----------------------------------------
  			// PAGE RESIZING
  			// Only runs on initial load, not window resize
        
  			if ($(window).width() >= 1000) {
    			var CANVAS_SIZE = 1000;
    			var CANVAS_OFFSET_X = 500;
    			var CANVAS_OFFSET_Y = 500;
    			$('.investments').addClass('initial-large');
  			} else {
    			var CANVAS_SIZE = 800;
    			var CANVAS_OFFSET_X = 400;
    			var CANVAS_OFFSET_Y = 400;
    			$('.investments').addClass('initial-small');
  			}
  
  			function setCanvasOffsets() {
  				CANVAS_OFFSET_X = $('.investments').innerWidth() / 2;
  				CANVAS_OFFSET_Y = $('.investments').innerHeight() / 2;
  				CANVAS.transform({x:CANVAS_OFFSET_X, y:CANVAS_OFFSET_Y});
  			}
  			setCanvasOffsets();
  			$(window).resize(setCanvasOffsets);
  
  			// ----------------------------------------
  			// VECTORS
  
  			var Vector = function(_x, _y) {
  			  
  			  this.x = _x || 0;
  			  this.y = _y || 0;
  			  
  			  this.dist = function(vector) {
  			    var dx = this.x - vector.x;
  			    var dy = this.y - vector.y;
  			    return Math.sqrt(dx*dx + dy*dy);
  			  };
  
  			  this.minus = function(vector) {
  			    return new Vector(
  			      this.x - vector.x,
  			      this.y - vector.y);
  			  };
  			  
  			  this.scale = function(scale) {
  			    this.x *= scale;
  			    this.y *= scale;
  			  };
  			  
  			  this.apply = function(vector) {
  			    this.x += vector.x;
  			    this.y += vector.y;
  			  };
  
  			  this.length = function() {
  			  	return Math.sqrt(this.x*this.x + this.y*this.y);
  			  }
  
  			};
  
  
  			// ----------------------------------------
  			// NODES
  
  			var NODES = [];
  			if ($(window).width() >= 1000) {
  			  	var RADIUS_SMALL = 25;
    			var RADIUS_MEDIUM = 45;
    			var RADIUS_LARGE = 60;
  			} else {
    			var RADIUS_SMALL = 18;
    			var RADIUS_MEDIUM = 38;
    			var RADIUS_LARGE = 50;
  			}
  			var RADIUS_ANIMATION_SPEED = 0.15;
  			var TEXT_ANIMATION_SPEED = 0.10;
  			var BLUE = "#03C4EB";
  			var GRAY = "#bdbecf"
  			var GRAY_TXT = "#8183A4"
  			var Node = function(_home, _label) {
  				this.home = _home; // Home position
  				this.pos = new Vector(_home.x, _home.y); // Current position
  				this.radius = RADIUS_SMALL;
  				this.targetRadius = this.radius;
  				this.textOpacity = 0;
  				this.targetTextOpacity = 0;
  				this.label = _label;
  				this.defaultStyle = 'small';
  				this.currentStyle = 'small';
  				this.url = null;
  				NODES.push(this);
  
  				// Initialize
  				this.svgGroup = CANVAS.group();
  				this.svgCircle = this.svgGroup.circle()
  				this.svgCircle.fill("#fff").stroke(GRAY);
  				this.svgText = this.svgGroup.text(this.label);
  				this.svgText.font({
  				 	family:   'open-sans, helvetica neue, helvetica',
  					size:     12,
  					anchor:   'middle',
  					leading:  '1.2em',
  				})
  				if (this.label.indexOf('\n') == -1) {
  					this.svgText.transform({
  						y: -9,
  					});
  				}
  				else {
  					this.svgText.transform({
  						y: -16,
  					});
  				}
  
  
  				// Click events:
  				var self = this;
  				this.svgGroup.click(function() {
  					if (self.url) {
  						var win = window.open(self.url, '_blank');
  					}
  				})
  
  
  				this.setStyle = function(style) {
  
  					if (this.currentStyle == style) return;
  
  					var targetStyle = style;
  					if (targetStyle == 'default') targetStyle = this.defaultStyle;
  
  					if (targetStyle == 'large') {
  						this.targetRadius = RADIUS_LARGE;
  						this.targetTextOpacity = 1;  
  						this.svgText.fill(BLUE);
  						this.svgCircle.stroke(BLUE);
  					}
  					else if (targetStyle == 'medium') {
  						this.targetRadius = RADIUS_MEDIUM;
  						this.targetTextOpacity = 1;
  						this.svgText.fill(GRAY_TXT);
  						this.svgCircle.stroke(GRAY);
  
  					}
  					else if (targetStyle == 'small') {
  						this.targetRadius = RADIUS_SMALL;
  						this.targetTextOpacity = 0;
  						this.svgText.fill(GRAY_TXT);
  						this.svgCircle.stroke(GRAY);
  					}
  
  					this.currentStyle = targetStyle;
  
  				}
  
  				this.draw = function() {
  					// size
  					this.radius += (this.targetRadius - this.radius) * RADIUS_ANIMATION_SPEED;
  					var d = this.radius*2;
  					this.svgCircle.size(d, d);
  					// text
  					this.textOpacity += (this.targetTextOpacity - this.textOpacity) * TEXT_ANIMATION_SPEED;
					this.svgText.opacity(this.textOpacity);
            // position
  					this.svgGroup.transform({
  						x: this.pos.x,
  						y: this.pos.y,
  					})
  				}
  			}
  
  
  			var EDGES = [];
  			var Edge = function(_n1, _n2) {
  			  this.n1 = _n1;
  			  this.n2 = _n2;
  			  this.homeLength = this.n1.home.dist(this.n2.home);
  			  EDGES.push(this);
  
  			  this.length = function() {
  			    return this.n1.pos.dist(this.n2.pos);
  			  };
  			};
  
  
  			// ----------------------------------------
  			// INITIAL NODE & EDGE CREATION
  
  			var HOME_RADIUS = 0.36 * CANVAS_SIZE;
  			var RADIUS_VARIANCE = 0.1;
  			var INITIAL_RADIUS_SCALE = 0.1;
  
  			var elements = $(".investments li");
  			elements.each(function(i, e) {
  
  				var el = $(e);
  				var p = (i / elements.length)*Math.PI*2;
  				var r = HOME_RADIUS + Math.random()*RADIUS_VARIANCE - RADIUS_VARIANCE/2;
  
  				var home = new Vector(
  					Math.sin(p)*r,
  					Math.cos(p)*r );
  
  				var label =  el.text();
  				label = label.replace(" ", "\n");
  				var n = new Node(home, label);
  
  				n.pos = new Vector(
  					Math.sin(p)*r*INITIAL_RADIUS_SCALE,
  					Math.cos(p)*r*INITIAL_RADIUS_SCALE);
  
  				if (el.hasClass('medium')) {
  					n.defaultStyle = 'medium'
  				}
  				else if (el.hasClass('large')) {
  					n.defaultStyle = 'large'
  				}
  
  				url = $("a",e).attr('href');
  				if (url) {
  					n.url = url;
  				}
  
  				n.setStyle('default');
  				n.draw();
  
  			});
  
  
  			// Create Edges
  			var EDGE_SPAN = 12;
  			for (var i=0; i<NODES.length; i++) {
  				var n1 = NODES[i]
  				for (var j=1; j<EDGE_SPAN; j++) {
  					var n2 = NODES[(i+j) % NODES.length];
  					new Edge(n1,n2);
  				}
  			}
  
  			// ----------------------------------------
  			// FORCES & ANIMATION
  
  			var EDGE_FORCE = 0.3;
  			var EDGE_PADDING = 30;
  
  			function applyEdgeForces() {
  				for (e in EDGES) {
  					var edge = EDGES[e];
  
  					// Edge lengths
  					var min_length = edge.n1.radius + edge.n2.radius;
  					min_length += EDGE_PADDING;
  					var target_length = min_length;
  					var length = edge.length();
  
  					// Collisions
  					if (length < min_length) {
  						// Calculate forces
  						var force = edge.n1.pos.minus(edge.n2.pos);
  						var stretch = length - min_length;
  						force.scale( stretch / length * EDGE_FORCE );
  						// Apply forces
  						edge.n2.pos.apply(force);
  				    	force.scale(-1);
  				    	edge.n1.pos.apply(force);  
  					}
  				}
  			}
  
  			function applyHomeForces() {
  				var HOME_FORCE = 0.1;
  				for (n in NODES) {
  					var node = NODES[n];
  				    var diff = node.home.minus(node.pos);
  				    diff.scale(HOME_FORCE);
  				    node.pos.apply(diff);
  				}
  			}
  
  			function redraw() {
  				for (n in NODES) {
  					NODES[n].draw();
  				}
  			}
  
  			var ANIMATION_TIMER = null;

  			function startAnimation() {
  				if (ANIMATION_TIMER != null) return;
  				ANIMATION_TIMER = setInterval(function() {
	  				applyHomeForces();
	  				applyEdgeForces();
	  				redraw();
  				},1000/30)//16.76ms!!!
  			};

  			setTimeout(function() {
  				startAnimation();
  			},300);
  
  
  			// ----------------------------------------
  			// MOUSE MOVEMENTS
  
  			$("#investment-canvas").mousemove(function(e) {
  
  				var offset = $("#investment-canvas").offset();
  				var mouse = new Vector(
  					e.pageX - offset.left - CANVAS_OFFSET_X,
  					e.pageY - offset.top - CANVAS_OFFSET_Y
  				);
  
  				for (n in NODES) {
  					var node = NODES[n];
  					var dist = mouse.dist(node.pos);
  
  					if (dist < 150) {
  						node.setStyle('large');
  					}
  					else if (dist < 210 && node.defaultStyle != 'large') {
  						node.setStyle('medium');
  					}
  					else {
  						node.setStyle('default');
  					}
  				}
  
  			});
  
  		});
  		
    }