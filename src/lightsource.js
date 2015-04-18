;(function(exports) {

    exports.LightSource = function(game, options) {
        this.game = game;
        this.size = options.size || {x : 10, y: 10};

        this.lightRays = {};

        this.center = options.center || {
            x: this.size.x >> 1,
            y: this.size.y >> 1
        };

    };

    exports.LightSource.prototype = {
        update  : function () {
           // this is awful
            var entities = this.game.coq.entities.all(Lens);
            for (var i = 0; i < entities.length; i++) {
                if (entities[i].lenslets && !(entities[i] in this.lightRays)) {
                    this.registerObject(entities[i]);
                }
            }
        },
        draw : function (ctx) {
            ctx.fillStyle = "red";
            ctx.fillRect(this.center.x + (this.size.x >> 1), this.center.y + (this.size.y >> 2), this.size.x, this.size.y);
        },
        registerObject : function(obj) {
            for (var i = 0; i < obj.lenslets.length; i++) {
                this.lightRays[obj] = this.game.coq.entities.create(
                    LightRay, {source : this, dest : obj.lenslets[i]}
                );
            }
        }
    };

})(window);
