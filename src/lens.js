;(function(exports) {
    exports.Lens = function(game, options) {
        this.game = game;

        this.center = options.center || {x : 500, y: 100};
        this.size = options.size || {x : 10, y : 40};

        this.bounce = 1;
    };

    exports.Lens.prototype = {
        update: function() {
            this.center.y += this.bounce;
            if (this.center.y > 200) {
                this.center.y = 200;
                this.bounce *= -1;
            } else if (this.center.y < 100) {
                this.center.y = 100;
                this.bounce *= -1;
            }
        },
        draw : function(ctx) {
            //draw points
            if (this.lt) {
                ctx.strokeStyle = this.color;
                ctx.beginPath();
                ctx.moveTo(this.lt[0].x, this.lt[1].y);
                for (var i = 0; i < this.lt.length; i++) {
                    ctx.lineTo(this.lt[i].x, this.lt[i].y);
                }
                ctx.stroke();
            }
        },
        getLightSegments : function(source) {
            if (this.center.x == source.center.x) {
                this.center.x += 0.00001;
            }
            var slope = (this.center.y - source.center.y) / (this.center.x - source.center.x);
            var perp = Math.atan(-1 / slope);
            var results = [
                {
                    x1 : this.center.x + (this.size.x * Math.cos(perp)),
                    y1 : this.center.y + (this.size.y * Math.sin(perp)),
                    x2 : this.center.x + (this.size.x * Math.cos(-perp)),
                    y2 : this.center.y + (this.size.y * Math.sin(-perp))
                }, {
                    x1 : this.center.x + (this.size.x * Math.cos(-perp)),
                    y1 : this.center.y + (this.size.y * Math.sin(-perp)),
                    x2 : this.center.x + (this.size.x * Math.cos(perp)),
                    y2 : this.center.y + (this.size.y * Math.sin(perp))
                }
            ];
            this.lt = [
                {
                    x : results[0].x1,
                    y : results[0].y1
                },
                {
                    x : results[1].x1,
                    y : results[1].y1
                }
            ];
            return results;
        }
    };
})(window);
