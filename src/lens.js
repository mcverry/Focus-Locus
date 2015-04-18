;(function(exports) {
    exports.Lens = function(game, options) {
        this.game = game;

        this.center = options.center || {x : 500, y: 100};
        this.size = options.size || {x : 40, y : 40};

        this.focalLength = 16;
        this.focalLights = [];

        this.light = this.game.coq.entities.create(Light,
            {center : this.center,
             color : "rgba(255, 0, 0, 0.3)",
             radial : true,
             rays : [],
             source : this});
        this.rays = [];
        this.bounce = 1;
    };

    exports.Lens.prototype = {
        refract: function(incoming, point){

            var neg = -1;
            var dir = Math.atan2(point.y - this.center.y, point.x - this.center.x);
            if (dir < 0){
                neg = 1;
            }
            var d = Math.sqrt(Math.pow(point.x - this.center.x, 2) + Math.pow(point.y - this.center.y, 2));
            d = 2 * (d / this.size.x);

            var a = incoming.angle + (Math.PI / this.focalLength) * d * neg;
            var dx = Math.cos(a);
            var dy = Math.sin(a);

            var ray = {
                angle : a,
                x1 : point.x,
                y1 : point.y,
                x2 : point.x + dx,
                y2 : point.y + dy,
                strength : incoming.strength - 1
            };

            if (ray.strength > 0) {
                this.light.rays.push(ray);
            }
        },

        update: function() {
            this.center.y += this.bounce;
            if (this.center.y > 600) {
                this.center.y = 600;
                this.bounce *= -1;
            } else if (this.center.y < 0) {
                this.center.y = 0;
                this.bounce *= -1;
            }

            //grab new lights
            var self = this;

            //update existing lights

        },
        draw : function(ctx) {
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.arc(this.center.x, this.center.y, this.size.x, 0, Math.PI *2);
            ctx.stroke();
            //draw points
            if (this.lt) {
                ctx.strokeStyle = this.color;
                ctx.beginPath();
                ctx.moveTo(this.lt[0].x, this.lt[0].y);
                for (var i = 1; i < this.lt.length; i++) {
                    ctx.lineTo(this.lt[i].x, this.lt[i].y);
                }
                ctx.stroke();
            }
        },
        getFocusPoint : function(source) {
            var lightDist = Math.sqrt(Math.pow(this.center.x - source.center.x, 2) + Math.pow(this.center.y - source.center.y, 2));
            var s2 = (this.focalLength * this.focalLength) * (lightDist - this.focalLength) - this.focalLength;
            var slope = (this.center.y - source.center.y) / (this.center.x - source.center.x);
            var theta = Math.atan(slope);
            return {
                x : this.center.x + (Math.cos(theta) * this.focalLength),
                y : this.center.y + (Math.sin(theta) * this.focalLength)
            };
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
            this.lt = [
                {
                    x : result.x1,
                    y : result.y1
                },
                {
                    x : result.x2,
                    y : result.y2
                }
            ];
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
