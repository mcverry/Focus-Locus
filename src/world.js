;(function(exports) {

    exports.World = function(game, options) {
        this.game = game;
        this.center = options.center || {
            x : 150,
            y : 150
        };

        this.size = options.size || {
            x : 5,
            y : 5
        };

        this.sun = options.sun;

        this.speed = 0.003;
    };

    exports.World.prototype = {
        update : function () {
            var angle = Math.atan2(this.center.y - this.sun.center.y, this.center.x - this.sun.center.x);
            var dist = Math.sqrt(Math.pow(this.center.x - this.sun.center.x, 2) + Math.pow(this.center.y - this.sun.center.y, 2));
            angle += this.speed;
            this.center.x = this.sun.center.x + (dist * Math.cos(angle));
            this.center.y = this.sun.center.y + (dist * Math.sin(angle));
        },
        draw : function(ctx) {
            ctx.fillStyle = "green";
            ctx.beginPath();
            ctx.arc(this.center.x, this.center.y, this.size.x, 0, Math.PI *2);
            ctx.fill();
        },
        getLightSegments : function(source) {
             if (this.center.x == source.center.x) {
                this.center.x += 0.00001;
            }
            var slope = (this.center.y - source.center.y) / (this.center.x - source.center.x);
            var perp = Math.atan(-1 / slope);
            var result = {
                x1 : this.center.x + (this.size.x * Math.cos(perp)),
                y1 : this.center.y + (this.size.y * Math.sin(perp)),
                x2 : this.center.x - (this.size.x * Math.cos(perp)),
                y2 : this.center.y - (this.size.y * Math.sin(perp)),
                src : this
            };
            return [result, {
                x1 : result.x2,
                y1 : result.y2,
                x2 : result.x1,
                y2 : result.y1,
                src : this
            }];
        }
    };

})(window);
