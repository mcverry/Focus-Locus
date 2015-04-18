;(function(exports) {
    exports.Lens = function(game, options) {
        this.game = game;

        this.pos = options.pos || {x : 200, y: 200};
        this.size = options.size || {x : 20, y : 100};
    };

    exports.Lens.prototype = {
        update: function() {

        },
        draw : function(ctx) {
            //draw lines
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.arc(
                this.pos.x,
                this.pos.y,
                this.size.y,
                Math.PI * 2/3,
                Math.PI *  4/3
            );
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(
                this.pos.x + this.size.x,
                this.pos.y,
                this.size.y + (this.size.x >> 1),
                Math.PI * 2/3,
                Math.PI *  4/3
            );
            ctx.stroke();
            //draw points
            ctx.strokeStyle = "green";
            for (var i = 0; i < this.getLightPoints().length; i++) {
                ctx.beginPath();
                ctx.arc(
                    this.getLightPoints()[i].x,
                    this.getLightPoints()[i].y,
                    10,
                    0,
                    Math.PI * 2
                );
                ctx.stroke();
            }
        },
        getLightPoints : function() {
            return [
                {
                    x : this.pos.x + 10,
                    y : this.pos.y + 10
                }, {
                    x : this.pos.x + this.size.x - 10,
                    y : this.pos.y + this.size.y - 10
                }
            ];
        }
    };
})(window);
