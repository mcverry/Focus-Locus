;(function(exports) {
    exports.Lens = function(game, options) {
        this.game = game;

        this.center = options.center || {x : 500, y: 100};
        this.size = options.size || {x : 40, y : 40};

        this.focalLength = 40;
        this.focalLights = [];

        this.bounce = 1;
    };

    exports.Lens.prototype = {
        update: function() {
            this.center.y += this.bounce;
            if (this.center.y > 200) {
                this.center.y = 200;
                this.bounce *= -1;
            } else if (this.center.y < 100) {
                this.center.y = 100;
                this.bounce *= -1;
            }

            //grab new lights
            var self = this;
            self.game.coq.entities.all(Light).filter(function(light) {
                for (var i = 0; i < self.focalLights.length; i++) {
                    if (self.focalLights[i].source === light || self.focalLights[i].parent === self) {
                        return false;
                    }
                }
                return true;
            }).forEach(function(light) {
                self.focalLights.push({
                    source : light,
                    focalLight : self.game.coq.entities.create(Light, {parent : self, color : "rgba(100, 0, 0, 0.1)"})
                });
            });

            //update existing lights
            for(var i = 0; i < this.focalLights.length; i++) {
                this.focalLights[i].focalLight.center = this.getFocusPoint(this.focalLights[i].source);
            }
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
