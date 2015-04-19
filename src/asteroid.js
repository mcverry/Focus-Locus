;(function(exports) {

    exports.Asteroid = function(game, options){
        this.game = game;
        this.size = options.size || {x : 10, y : 10};

        this.center = options.center || {
            x: this.size.x >> 1,
            y: this.size.y >> 1
        };

        this.maxStrength = options.strength || 1000;
        this.strength = this.maxStrength;
        this.damageThreshold = options.damageThreshold || 5;
        this.healingFactor = options.healingFactor || 1;

        this.sprite = options.sprite;
    };

    exports.Asteroid.prototype = {

        update : function(){
            if (this.strength <= 0) {
                this.game.coq.entities.destroy(this);
            }
            if (this.newDamage > this.damageThreshold) {
                this.strength -= this.newDamage;
            } else if (this.strength < this.maxStrength) {
                this.strength += this.healingFactor;
            }
            this.newDamage = 0;
        },

        draw : function (ctx) {
            ctx.beginPath();
            ctx.arc(this.center.x, this.center.y, this.size.x, 0, Math.PI *2);
            ctx.strokeStyle = '#FFF';
            ctx.stroke();

            if (this.sprite) {
                ctx.drawImage(
                    this.sprite,
                    0,
                    0,
                    this.sprite.width,
                    this.sprite.height,
                    this.center.x - (this.sprite.width >> 1),
                    this.center.y - (this.sprite.height >> 1),
                    this.sprite.width,
                    this.sprite.height
                );
            }
        },

        damage : function (dmg) {
            this.newDamage += dmg;
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
