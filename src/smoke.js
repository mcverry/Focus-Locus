;(function(exports) {
	exports.Smoke = function(game, options) {

		this.game = game;

		this.center = options.center || {
			x : 100,
			y : 100
		};

		this.size = options.size || {
			x : 3 + (Math.random() * 6),
			y : 3 + (Math.random() * 6)
		};

		this.velocity = options.velocity || {
			x : 0.5 - (Math.random() * 1),
			y : -3 + (Math.random() * 2)
		};

		this.strength = options.strength || (Math.random() * 30) | 0;
	};

	exports.Smoke.prototype = {
		update : function() {
			this.strength -= 1;
			if (this.strength <= 0) {
				this.game.coq.entities.destroy(this);
			}

			this.center.x += this.velocity.x;
			this.center.y += this.velocity.y;
		},
		draw : function(ctx){
			ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
			ctx.beginPath();
			ctx.arc(this.center.x, this.center.y, this.size.x, 0, Math.PI * 2);
			ctx.closePath();
			ctx.fill();
		}
	};

})(window);
