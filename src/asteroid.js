;(function(exports) {

    exports.Asteroid = function(options){
        this.coq = options.coq;
        this.size = options.size || {x : 10, y : 10};
        console.log(options);
        this.center = options.center || {
            x: this.size.x >> 1,
            y: this.size.y >> 1
        }
    };

    exports.Asteroid.prototype = {

        update : function(){

        },

        draw : function (ctx) {
            ctx.beginPath();
            ctx.arc(this.center.x, this.center.y, this.size.x, 0, Math.PI *2);
            ctx.strokeStyle = '#FFF'; 
            ctx.stroke(); 
        },

    }
})(window);
