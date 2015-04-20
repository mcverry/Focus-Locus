;(function(exports) {
    exports.Lens = function(game, options) {
        this.game = game;

        this.center = options.center || {x : 500, y: 100};
        this.size = options.size || {x : 30, y : 30};

        this.movement = options.movement || 0;

        this.minFocalLength = options.minFocalLength || 4;
        this.focalLength = 16;
        this.focalLights = [];
        this.mirrormode = false;
        this.light = this.game.coq.entities.create(Light,
            {center : this.center,
             color : "rgba(255, 0, 0, 0.3)",
             radial : true,
             rays : [],
             source : this});
        this.rays = [];
        this.bounce = 1;

        this.attachment = options.attachment || null;
        this.attachmentOffset = options.attachmentOffset || {x : 0, y : -100};

        this.limits = options.limits || {
            top : 200,
            bottom : 400
        };

        this.velocity = {x : 0, y : 0};
        this.friction = options.friction || {x : 0.9, y : 0.9};

        this.sprite = options.sprite;
        this.spriteOffset = options.spriteOffset || {x : 0, y : 0};

        this.zindex = options.zindex || 5;
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

            if (this.mirrormode) {
                a += Math.PI;
            }

            var dx = Math.cos(a);
            var dy = Math.sin(a);

            var ray = {
                angle : a,
                x1 : point.x,
                y1 : point.y,
                x2 : point.x + dx,
                y2 : point.y + dy,
                strength : incoming.strength - 1,
                color : incoming.color,
                refracted : true
            };

            if (ray.strength > 0) {
                this.light.rays.push(ray);
            }
        },

        update: function() {

            var inp = this.game.coq.inputter;

            if (this.movement) {
                if (inp.isDown(this.movement.up.key)) {
                    this.velocity.y -= this.movement.up.speed;
                }
                if (inp.isDown(this.movement.down.key)) {
                    this.velocity.y += this.movement.down.speed;
                }
                if (inp.isDown(this.movement.left.key)){
                    this.focalLength -= this.movement.left.speed;
                }
                if (inp.isDown(this.movement.right.key)){
                    this.focalLength += this.movement.right.speed;
                }
            }

            this.center.x += this.velocity.x;
            this.center.y += this.velocity.y;

            this.velocity.x = this.velocity.x * this.friction.x;
            this.velocity.y = this.velocity.y * this.friction.y;

            if (this.center.y > this.limits.bottom) {
                this.center.y = this.limits.bottom;
            } else if (this.center.y < this.limits.top) {
                this.center.y = this.limits.top;
            }

            if (this.attachment) {
                this.attachment.center = {
                    x : this.center.x + this.attachmentOffset.x,
                    y : this.center.y + this.attachmentOffset.y
                };
                if (this.attachment.strength <= 0) {
                    //todo
                    this.game.coq.entities.destroy(this);
                }
            }

            if (this.focalLength < this.minFocalLength && this.focalLength > 0) {
                this.focalLength = -this.minFocalLength;
            } else if (this.focalLength > -this.minFocalLength && this.focalLength < 0) {
                this.focalLength = this.minFocalLength;
            }

            this.mirrormode = this.focalLength <= 0;
        },
        draw : function(ctx) {
            if (this.game.debugMode) {
                ctx.strokeStyle = "white";
                ctx.beginPath();
                ctx.arc(this.center.x, this.center.y, this.size.x, 0, Math.PI *2);
                ctx.stroke();
            }
            if (this.sprite) {
                ctx.drawImage(
                    this.sprite,
                    0,
                    0,
                    this.sprite.width,
                    this.sprite.height,
                    this.center.x - (this.sprite.width >> 1) - this.spriteOffset.x,
                    this.center.y - (this.sprite.height >> 1) - this.spriteOffset.y,
                    this.sprite.width,
                    this.sprite.height
                );
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
            var offset = this.center.x == source.center.x ? 0.00001 : 0;

            var slope = (this.center.y - source.center.y) / (this.center.x + offset - source.center.x);
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
