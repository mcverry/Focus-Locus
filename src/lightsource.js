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
            //this is awful
            var entities = this.game.coq.entities.all();
            for (var i = 0; i < entities.length; i++) {
                if (entities[i].getLightPoints && !(entities[i] in this.lightRays)) {
                    this.registerObject(entities[i]);
                }
            }
        },
        draw : function (ctx) {
            ctx.fillStyle = "red";
            ctx.fillRect(this.center.x + (this.size.x >> 1), this.center.y + (this.size.y >> 2), this.size.x, this.size.y);
        },
        registerObject : function(obj) {
            if (obj.getLightPoints) {
                for (var i = 0; i < obj.getLightPoints().length; i++) {
                    this.lightRays.push(
                        this.game.coq.elements.create(LightRay, {source :this, dest : obj.getLightPoints()[i]})
                    );
                }
            }
        }
    };

})(window);
