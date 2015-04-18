;(function(exports) {
    exports.Lens = function(game, options) {
        this.game = game;

        this.center = options.center || {x : 500, y: 100};
        this.size = options.size || {x : 10, y : 40};
    };

    exports.Lens.prototype = {
        update: function() {

        },
        draw : function(ctx) {
            //draw lines
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.arc(
                this.center.x,
                this.center.y,
                this.size.y,
                0,
                Math.PI * 2
            );
            ctx.stroke();
            ctx.beginPath();

            ctx.stroke();
            //draw points
            ctx.strokeStyle = "green";
            for (var i = 0; i < this.getLightPoints().length; i++) {
                ctx.beginPath();
                ctx.arc(
                    this.getLightPoints()[i].x,
                    this.getLightPoints()[i].y,
                    2,
                    0,
                    Math.PI * 2
                );
                ctx.stroke();
            }
        },
        getLightPoints : function(source) {
            return {
                x1 : this.center.x,
                y1 : this.center.y + this.size.y,
                x2 : this.center.x,
                y2 : this.center.y - this.size.y
            };
        }
    };
})(window);
