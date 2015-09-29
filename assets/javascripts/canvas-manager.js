/**
 * @fileoverview Utilities for handling canvases in html page.
 * @author miecowbai@gmail.com (Kino Lien)
 */

/*  畫 Border

*/


 
(function(scope){
	/**
	 * Point object contains x and y coordinates.
	 * @typedef {Object} Point
	 * @property {Number} x The x coordinate.
	 * @property {Number} y The y coordinate.
	 */
	 
	/**
	 * Canvas id and Canvas Instance mapping
	 * @private {Object.<string, CanvasInstance>}
	 */
	var instanceMap_ = {};
	
	/**
	 * Auto increment id number, if canvas element id is empty.
	 * @private {number}
	 */
	var idCount_ = 0;

	/**
	 * The responsive event hooked or not.
	 * @private {Bool}
	 */
	var isHooked_ = false;
	
	/**
	 * The CanvasManager properties definitions.
	 * @typedef {Object} CanvasMgrProp
	 * @property {Number} width The source canvas width.
	 * @property {Number} height The source canvas height.
	 * @property {Number} lineWidth The source canvas line width.
	 * @property {String} lineCap Sets the style of the end caps for a line. values: butt|round|square.
	 * @property {String} lineColor The line stroke color.
	 * @property {Number} targetZoomScale The area scale to target canvases, using vector way.
	 * @property {String|HTMLImageElement} backgroundImage The image url or html element.
	 */
	var prop_ = {
		width: 500,
		height: 500,
		lineWidth: 9,
		lineCap: 'round',
		lineColor: '#00ccff',
		targetZoomScale: 1,
		responsiveByParent: false
		// backgroundLine: '6px #ff0000'
		// backgroundImage
	};
	
	/**
	 * Get exist id or auto increment id.
	 * @private
	 * @param {CanvasHTMLElement} el 
	 * @return {string} canvas id
	 */
	var getId_ = function(el){
		return el.id || (el.id = 'kino-cm-' + ++idCount_);
	};
	
	/**
	 * Get exist canvas html element.
	 * @private
	 * @param {string|CanvasHTMLElement} id The id string or html element
	 * @return {CanvasHTMLElement} 
	 */
	var getEl_ = function(id){
		if(typeof id == 'string' && (id = id.trim()) ){
			var el = document.getElementById(id);
			if(el && el.tagName.toLowerCase() == 'canvas'){
				return el;
			}else{
				console.error('The element is NOT a canvas. (id = '+ id +')');
			}
		}else if(Object.prototype.toString.call(id) == '[object HTMLCanvasElement]'){
			return id;
		}else{
			console.error('CM can not handle the null, undefined, empty id string or non-canvas elements.');
		}
	};

	/**
	 * Do responsive by parent element and redrawing canvases.
	 * @private
	 */
	var doResponse_ = function(){
		var timeCount = 0;
		var timeStep = 2;
		var wait = 12;
		for(var x in instanceMap_){
			setTimeout((function(ins){
				return function(){ ins.responsive(); };
			})(instanceMap_[x]), timeCount++ * timeStep + wait);
		}
	};

	/**
	 * Hook the resposive resizing event.
	 * @private
	 * @param {Bool} hook True to hook the responsive event, otherwise false.
	 */
	var hookResponse_ = function(hook){
		hook = hook === true;
		if(hook == !isHooked_){
			scope[(hook? 'add' : 'remove') + 'EventListener']('resize', doResponse_);
			isHooked_ = hook;
		}		
	};

	var drawSplitLines_ = function(ins, info){
		var backLine = info;
		if(backLine){
			var con = ins.context_;
			var w = ins.width_;
			var h = ins.height_;
			var sourceMinWidth = Math.min(prop_.width, prop_.height);
			var minWidth = Math.min(w, h);
			var splits = backLine.split(' ');
			var px = parseInt(splits[0] || '1px');
			var color = splits[1] || '#000000';
			if(!isNaN(px) && color){
				con.lineWidth = minWidth / (sourceMinWidth / px ) ;
				con.lineCap = 'square';
				con.strokeStyle = color;

				con.beginPath();
				con.moveTo(0, h * 1 / 3);
				con.lineTo(w, h * 1 / 3);
				con.moveTo(0, h * 2 / 3);
				con.lineTo(w, h * 2 / 3);

				con.moveTo(w * 1 / 3, 0);
				con.lineTo(w * 1 / 3, h);
				con.moveTo(w * 2 / 3 , 0);
				con.lineTo(w * 2 / 3 , h);
				con.stroke();

			}
		}
	}

	/**
	 * Initialize the Canvas Empty Instance
	 * @private
	 */
	function CanvasEmptyInstance(){}
	CanvasEmptyInstance.prototype.point = function(){return this;};
	CanvasEmptyInstance.prototype.line = function(){return this;};
	CanvasEmptyInstance.prototype.clear = function(){return this;};
	CanvasEmptyInstance.prototype.responsive = function(){return this;};
	//CanvasEmptyInstance.prototype.prop = function(){return this;};
	
	
	/**
	 * Initialize the Canvas Instance
	 * @constructor
	 * @param {String|HTMLCanvasElement} id A id string or the canvas dom element.
	 * @return {CanvasInstance}
	 */
	function CanvasInstance(id){
		this.el_ = getEl_(id);
		this.id_ = getId_(this.el_);
		this.track_ = [];
		
		this.rootScale_ = Math.pow(prop_.targetZoomScale, 1/2);
		var w = this.width_ = prop_.width * this.rootScale_ ;
		var h = this.height_ = prop_.height * this.rootScale_ ;

		var sourceMinWidth = Math.min(prop_.width, prop_.height);
		var minWidth = Math.min(
			this.el_.width = Math.round(w),
			this.el_.height = Math.round(h)
		);
		
		var con = this.context_ = this.el_.getContext('2d');

		var back = prop_.backgroundImage;
		if(back){
			if(typeof back == 'string'){
				this.backImg_ = new Image();
				this.backImg_.onload = (function(scope, context){
					return function(){
						context.drawImage(this, 0, 0, w, h);
						scope.backImgLoad_ = true;
						scope.responsive();
					}
				})(this, con);
				this.backImg_.src = back;
			}else if(Object.prototype.toString.call(back) == '[object HTMLImageElement]'){
				this.backImg_ = back;
				con.drawImage(back, 0, 0, w, h);
				this.backImgLoad_ = true;
				this.responsive();
			}else{
				console.error('CM can not handle the invalid image url/element.');
			}
		}
		
		this.context_.lineWidth = minWidth / (sourceMinWidth / prop_.lineWidth);
		this.context_.lineCap = prop_.lineCap;
		this.context_.strokeStyle = prop_.lineColor;
	}
	
	/**
	 * Draw a point on specified canvas.
	 * @param {Point} pt A point Object, contains x and y coordinates.
	 * @param {Function|null} callback
	 * @return {CanvasInstance}
	 */
	CanvasInstance.prototype.point = function(pt, callback){
		var con = this.context_;
		var x = this.rootScale_ * pt.x;
		var y = this.rootScale_ * pt.y;
		this.track_.push([[pt.x, pt.y]]);
		con.beginPath();
		con.moveTo(x - 0.1, y - 0.1);
		con.lineTo(x, y);
		con.moveTo(x, y);
		con.stroke();
		if(typeof callback == 'function'){
			setTimeout((function(scope, point){
				return function(){
					callback.call(scope, point);
				};
			})(this, pt), 0);
		}
		return this;
	};
	
	/**
	 * Draw a line on specified canvas, from current point to input point.
	 * @param {Point} pt A point Object, contains x and y coordinates.
	 * @param {Function|null} callback
	 * @return {CanvasInstance}
	 */
	CanvasInstance.prototype.line = function(pt, callback){
		var con = this.context_;
		var x = this.rootScale_ * pt.x;
		var y = this.rootScale_ * pt.y;
		this.track_[this.track_.length-1].push([pt.x, pt.y]);
		con.lineTo(x, y);
		con.moveTo(x, y);
		con.stroke();
		if(typeof callback == 'function'){
			setTimeout((function(scope, point){
				return function(){
					callback.call(scope, point);
				};
			})(this, pt), 0);
		}
		return this;
	};
	
	/**
	 * Clear the canvas to blank or background image if its exist.
	 * @param {Function|null} callback
	 * @return {CanvasInstance}
	 */
	CanvasInstance.prototype.clear = function(callback){
		if(this.backImg_){
			this.context_.save();
			drawSplitLines_(this, prop_.backgroundLine);
			this.context_.restore();
			this.context_.drawImage(this.backImg_, 0, 0, this.width_, this.height_);
		}else{
			this.context_.clearRect(0, 0, this.width_, this.height_);
			this.context_.save();
			drawSplitLines_(this, prop_.backgroundLine);
			this.context_.restore();
		}
		this.track_ = [];
		if(typeof callback == 'function'){
			setTimeout((function(scope){
				return function(){
					callback.call(scope);
				};
			})(this), 0);
		}
		return this;
	};
	
	CanvasInstance.prototype.responsive = function(element ,callback){
		var ins = this;
		var p = element || ins.el_.parentElement;
		if(prop_.responsiveByParent === true && ins && p){
			var styles = getComputedStyle(p);
			var aw = p.clientWidth - (parseFloat(styles['paddingLeft']) + parseFloat(styles['paddingRight']));
			var ah = p.clientHeight - (parseFloat(styles['paddingTop']) + parseFloat(styles['paddingBottom']));
			// p.clientWidth - paddings = actual width
			// p.clientHeight - paddings = actual height

			var squareSize = Math.min(aw, ah);
			//console.log([p.clientWidth, squareSize]);
			ins.width_ = squareSize;
			ins.height_ = squareSize;
			ins.el_.width = Math.round(squareSize);
			ins.el_.height = Math.round(squareSize);
			ins.rootScale_ = ins.width_ / prop_.width;

			var sourceMinWidth = Math.min(prop_.width, prop_.height);
			var con = ins.context_;

			drawSplitLines_(ins, prop_.backgroundLine);

			con.lineWidth = squareSize / (sourceMinWidth / prop_.lineWidth);
			con.lineCap = prop_.lineCap;
			con.strokeStyle = prop_.lineColor;

			if(ins.backImgLoad_){
				ins.context_.drawImage(ins.backImg_, 0, 0, squareSize, squareSize);
			}
			// rewrite cached drawing
			for(var i = 0, len = ins.track_.length; i < len; i++){
				var single = ins.track_[i];
				var pslen = single.length;
				var x = single[0][0] * ins.rootScale_;
				var y = single[0][1] * ins.rootScale_;
				con.beginPath();
				con.moveTo(x - 0.1, y - 0.1);
				con.lineTo(x, y);
				con.moveTo(x, y);
				con.stroke();
				for(var ps = 1; ps < pslen; ps++){
					x = single[ps][0] * ins.rootScale_;
					y = single[ps][1] * ins.rootScale_;
					con.lineTo(x, y);
					con.moveTo(x, y);
					con.stroke();
				}
			}
			if(typeof callback == 'function'){
				setTimeout((function(scope){
					return function(){
						callback.call(scope);
					};
				})(ins), 0);
			}
		}
		return ins;
	};


	/**
	 * Get
	 * @param {CanvasMgrProp} property A canvas manager property object.
	 * @return {CanvasInstance}
	 */
	//CanvasInstance.prototype.prop = function(property){return this;};
	
	/**
	 * Gets the canvas instance or empty object.
	 * @param {String|HTMLCanvasElement} id A id string or the canvas dom element.
	 * @return {CanvasInstance|CanvasEmptyInstance}
	 */
	function CM(id){
		var el = getEl_(id);
		var cid = getId_(el);
		if(!instanceMap_[cid]){
			return new CanvasEmptyInstance();
		}
		return instanceMap_[cid];
	}
	
	/**
	 * Register and new a canvas instance.
	 * @param {String|HTMLCanvasElement|Array.<String|HTMLCanvasElement>} id A id string or the canvas dom element.
	 */
	CM.reg = function(id){
		var ids;
		if(Object.prototype.toString.call(id) == '[object Array]'){
			ids = id.slice(0);
		}else ids = [id];
		for(var i = 0, len = ids.length; i<len; i++){
			var id = ids[i];
			var el = getEl_(id);
			var cid = getId_(el);
			if(!instanceMap_[cid]){
				instanceMap_[cid] = new CanvasInstance(el || cid);
			}	
		}
	};
	
	/**
	 * Unregister and delete the specified canvas id/element.
	 * @param {String|HTMLCanvasElement|Array.<String|HTMLCanvasElement>} id A id string or the canvas dom element.
	 */
	CM.unreg = function(id){
		var ids;
		if(Object.prototype.toString.call(id) == '[object Array]'){
			ids = id.slice(0);
		}else ids = [id];
		for(var i = 0, len = ids.length; i<len; i++){
			var id = ids[i];
			var el = getEl_(id);
			var cid = getId_(el);
			if(instanceMap_[cid]){
				instanceMap_[cid] = null;
			}
		}
	}
	
	/**
	 * Gets or sets the common properties of canvas manager
	 * @param {CanvasMgrProp|null} property A canvas manager properties.
	 * @param {CanvasMgrProp}
	 */
	CM.prop = function(property){
		if(Object.prototype.toString.call(property) == '[object Object]'){
			for(var p in property){
				prop_[p] = property[p];
			}
			hookResponse_(prop_.responsiveByParent);
			var back = prop_.backgroundImage;
			if(back){
				if(typeof back == 'string'){
					var imgEl = new Image();
					imgEl.onload = function(){
						prop_.backgroundImage = this;
					};
					imgEl.src = back;
				}else if(Object.prototype.toString.call(back) == '[object HTMLImageElement]'){
				}else{
					console.error('CM can not handle the invalid image url/element.');
				}
			}
		}
		return prop_;
	};

	CM.doAllResponsive = function(){
		doResponse_();
	};
	
	hookResponse_(prop_.responsiveByParent);
	// return to input scope
	scope.CM = CM;

})(window);
