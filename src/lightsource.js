;(function(exports) {

	exports.LightSource = function(options) {
		this.coq = options.coq;
		this.size = options.size || {x : 10, y: 10};

		this.lightRays = {};

		this.center = options.center || {
			x: this.size.x >> 1,
			y: this.size.y >> 1
		};

	};

	exports.LightSource.prototype = {
		update  : function () {

		},
		draw : function (ctx) {
			ctx.fillStyle = "red";
			ctx.fillRect(this.center.x + (this.size.x >> 1), this.center.y + (this.size.y >> 2), this.size.x, this.size.y);
		},
		registerObject : function(obj) {
			for (var i = 0; i < obj.getLightPoints().length; i++) {
				this.lightRays.push(
					this.coq.elements.create(LightRay, {source :this, dest : obj.getLightPoints()[i]})
				);
			}
		}
	};

})(window);
