;(function(exports) {

    exports.LightRay = function(game, options) {
        this.game = game;
        this.source = options.source;
        this.dest = options.dest;
    };

    exports.LightRay.prototype = {
        update : function () {

        },
        draw : function (ctx) {
            ctx.lineWidth = 3;
            ctx.strokeStyle = "blue";
            ctx.beginPath();
            ctx.moveTo(this.source.center.x, this.source.center.y);
            ctx.lineTo(this.dest.center.x, this.dest.center.y);
            ctx.stroke();
        }
    };

})(window);
