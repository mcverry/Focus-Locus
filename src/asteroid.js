;(function(exports) {

    exports.Asteroid = function(game, options){
        this.game = game;
        this.size = options.size || {x : 16, y : 16};

        this.center = options.center || {
            x: this.size.x >> 1,
            y: this.size.y >> 1
        };

        this.maxStrength = options.strength || 1000;
        this.strength = this.maxStrength;
        this.damageThreshold = options.damageThreshold || 5;
        this.healingFactor = options.healingFactor || 5;

        this.sprite = options.sprite;
        this.currentSprite = 0;
        this.spriteOffset = {
            x : 16,
            y : 16
        };
        this.numSprites = options.numSprites || this.sprite.height / ((this.size.y) + this.spriteOffset.y);

        this.popSound = options.popSound || null;
        this.cookSound = options.cookSound || null;
    };

    exports.Asteroid.prototype = {
        update : function(){
            if (this.strength <= 0) {
                console.log(this);
                console.log(this.popSound);
                console.log(this.game.audio.play(this.popSound));
                this.game.coq.entities.destroy(this);
            }
            if (this.newDamage > this.damageThreshold) {
                this.strength -= this.newDamage;
            } else if (this.strength < this.maxStrength) {
                this.strength += this.healingFactor;
            }
            this.newDamage = 0;

            this.currentSprite += 0.6;
            if (this.currentSprite > this.numSprites) {
                this.currentSprite = 0;
            }

            for (var i = 0; i < this.getDamageLevel(); i ++) {
                if (Math.random() < 0.5) {
                    return;
                }
                this.game.coq.entities.create(Smoke, {
                    center: {
                        x : this.center.x,
                        y : this.center.y
                    }
                });
            }
        },

        getDamageLevel : function() {
            var damagePercent = (10 - ((this.strength / this.maxStrength) * 10)) | 0;
            if (damagePercent >= 10) damagePercent = 9;
            return damagePercent;
        },

        draw : function (ctx) {
            if (this.game.debugMode) {
                ctx.beginPath();
                ctx.arc(this.center.x, this.center.y, this.size.x, 0, Math.PI *2);
                ctx.strokeStyle = '#FFF';
                ctx.stroke();
            }

            if (this.sprite) {
                ctx.drawImage(
                    this.sprite, //img
                    this.getDamageLevel() * (this.size.x + this.spriteOffset.x), //sx
                    (this.currentSprite | 0) * (this.size.y + this.spriteOffset.y), //sy
                    this.size.x << 1, //swidth
                    this.size.y << 1, //sheight
                    this.center.x - (this.size.x), //x
                    this.center.y - (this.size.y), //y
                    this.size.x << 1, //width
                    this.size.y << 1//height
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
