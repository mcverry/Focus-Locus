;(function(exports) {

    exports.Asteroid = function(game, options){
        this.game = game;
        this.size = options.size || {x : 16, y : 16};

        this.center = options.center || {
            x: this.size.x >> 1,
            y: this.size.y >> 1
        };

        this.id = "a" + this.game.scriptState + "_" +this.game.coq.entities.all().length;

        this.maxStrength = options.strength || 1000;
        this.strength = this.maxStrength;
        this.damageThreshold = options.damageThreshold || 5;
        this.healingFactor = options.healingFactor || 2;

        this.sprite = options.sprite;
        this.currentSprite = 0;
        this.spriteOffset = {
            x : 16,
            y : 16
        };
        this.numSprites = options.numSprites || this.sprite.height / ((this.size.y) + this.spriteOffset.y);

        this.popSound = options.popSound || null;
        this.cookSound = options.cookSound || null;

        this.sizeAdjust = options.sizeAdjust || 1;

        this.zindex = 3;

        this.sun = options.sun || null;
        this.speed = options.speed || 0.01;

        this.friend = options.friend || false;
    };

    exports.Asteroid.prototype = {
        update : function(){
            if (this.strength <= 0) {
                //console.log(this.popSound);
                this.game.audio.play(this.popSound, {channel : this.id});
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

            if (this.sun) {
                var angle = Math.atan2(this.center.y - this.sun.center.y, this.center.x - this.sun.center.x);
                var dist = Math.sqrt(Math.pow(this.center.x - this.sun.center.x, 2) + Math.pow(this.center.y - this.sun.center.y, 2));
                angle += this.speed;
                this.center.x = this.sun.center.x + (dist * Math.cos(angle));
                this.center.y = this.sun.center.y + (dist * Math.sin(angle));
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
            var sx, sy, shake;
            if (this.game.debugMode) {
                ctx.beginPath();
                ctx.arc(this.center.x, this.center.y, this.size.y, 0, Math.PI *2);
                ctx.strokeStyle = '#FFF';
                ctx.stroke();
            }

            if (this.sprite.width > this.size.x * 2) {
                sx = this.getDamageLevel() * (this.size.x + this.spriteOffset.x);
            } else {
                sx = 0;
            }

            if (this.sprite.height > this.size.y * 2) {
                sy = (this.currentSprite | 0) * (this.size.y + this.spriteOffset.y);
            } else {
                sy = 0;
            }

            shake = {
                x : Math.random() * this.getDamageLevel(),
                y : Math.random() * this.getDamageLevel()
            };

            if (this.sprite) {
                ctx.drawImage(
                    this.sprite, //img
                    sx, //sx
                    sy, //sy
                    this.size.x << 1, //swidth
                    this.size.y << 1, //sheight
                    this.center.x - this.size.x + shake.x, //x
                    this.center.y - this.size.y + shake.y, //y
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
                x1 : this.center.x + (this.size.x  * this.sizeAdjust * Math.cos(perp)),
                y1 : this.center.y + (this.size.y * this.sizeAdjust * Math.sin(perp)),
                x2 : this.center.x - (this.size.x * this.sizeAdjust * Math.cos(perp)),
                y2 : this.center.y - (this.size.y * this.sizeAdjust * Math.sin(perp)),
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
