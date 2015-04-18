;(function(exports) {
    exports.Lens = function(game, options) {
        this.game = game;

        this.center = options.center || {x : 200, y: 200};
        this.size = options.size || {x : 20, y : 100};

        this.lensletCount = options.lensletCount || 10;
        this.theta = options.theta || 2;

        this.lenslets = [];
        for ( i = 0; i < this.lensletCount; i++) {
            this.lenslets.push({
                center : {
                    x : this.center.x,
                    y : this.center.y + (i * (this.size.y / this.lensletCount))
                },
                theta : (i - (this.lensletCount >> 1)) / (this.lensletCount >> 1)
            });
        }
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
                Math.PI * 2/3,
                Math.PI *  4/3
            );
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(
                this.center.x + this.size.x,
                this.center.y,
                this.size.y + (this.size.x >> 1),
                Math.PI * 2/3,
                Math.PI *  4/3
            );
            ctx.stroke();
            //draw points
            ctx.strokeStyle = "green";
            for (var i = 0; i < this.lenslets.length; i++) {
                ctx.beginPath();
                ctx.arc(
                    this.lenslets[i].center.x,
                    this.lenslets[i].center.y,
                    3,
                    0,
                    Math.PI * 2
                );
                ctx.stroke();
            }
        },
        getLightPoints : function(source) {

        }
    };
})(window);
