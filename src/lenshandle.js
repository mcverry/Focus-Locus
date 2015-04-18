;(function(exports) {

    exports.LensHandle = function(game, options) {
        this.game = game;
        this.center = options.center || {x : 200, y :100};
        this.size = options.size || {x : 10, y : 10};
        this.hover = false;
        this.clicked = false;
        this.alpha = 0.15
        this.trackpos = [];
    };

    exports.LensHandle.prototype = {

        update: function() {
            var inp = this.game.coq.inputter;
            var pos = inp.getMousePosition();
            if (pos === undefined) {
                this.alpha = 0.15;
                return;
            }
            if (Math.sqrt((this.center.x - pos.x) *
                          (this.center.x - pos.x) +
                          (this.center.y - pos.y) *
                          (this.center.y - pos.y)) < this.size.y * 2) {
                this.hover = true;
                this.alpha = 0.8;
            } else {
                this.hover = false;
            }

            if (this.hover && inp.isDown(inp.LEFT_MOUSE)){
                this.clicked = true;

                if (this.trackedpos.length === 0){
                    this.trackedpos.push(pos);
                } else {
                    this.trackedpos[1] = pos;
                }

            } else {
                this.clicked = false;
            }

            if (this.alpha > 0.15) {
                this.alpha = this.alpha - 0.025;
            }
            if (this.alpha < 0.15){
                this.alpha = 0.15;
            }
        },

        draw: function(ctx) {
            if (this.clicked) {
                ctx.strokeStyle = 'rgb(102,204,0)';
            }else{
                ctx.strokeStyle = 'rgba(218,112,214,' +  this.alpha +')';
            }
            ctx.beginPath();
            ctx.arc(
                this.center.x,
                this.center.y,
                this.size.y,
                0,
                Math.PI * 2
            );
            ctx.stroke();
        }
    };

})(window);
