;(function(exports) {

    exports.Splash = function(game, options){
        this.game = game;
        this.size = options.size || {x : 800, y : 600};
        this.pos = options.pos || {x : 0, y : 0};
        this.center = {
            x : this.pos.x + (this.size >> 1),
            y : this.pos.y + (this.size >> 1)
        };
        this.image = false;

        this.zindex = options.zindex || 2;

        var loading = new Image();
        loading.onload = function (){
            this.image = loading;
        }.apply(this);
        if (options.source){
            loading.src = options.source;
        }
    };

    exports.Splash.prototype = {
        update : function(){

        },

        draw : function (ctx) {
            if (!this.image) {
                return;
            }
            ctx.drawImage(
                this.image,
                this.pos.x,
                this.pos.y,
                this.size.x,
                this.size.y
            );
        }
    };
})(window);
