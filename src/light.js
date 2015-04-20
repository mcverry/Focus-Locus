;(function(exports){

    exports.Light = function(game, options) {

        this.game = game;

        this.center = options.center;
        this.color = options.color || "red";
        this.strength = options.strength || 6;
        this.intersects = [];

        this.radial = options.radial || false;
        this.source = options.source || null;

        this.startAngle = options.startAngle % (Math.PI * 2) || 0;
        this.endAngle = options.endAngle % (Math.PI * 2) || Math.PI * 2;

        this.rays = [];
        if (! options.rays) {
            this.makeRadial(options.numRays || 100);
        } else {
            this.rays = options.rays;
        }

        this.sprite = options.sprite;
    };

    exports.Light.prototype = {

        makeRadial : function(n) {
            if (this.startAngle > this.endAngle) {
                var temp = this.startAngle;
                this.startAngle = this.endAngle;
                this.endAngle = temp;
            }

            for(var angle = this.startAngle; angle < this.endAngle; angle += (this.endAngle - this.startAngle) / n){
                // Calculate dx & dy from angle
                var dx = Math.cos(angle);
                var dy = Math.sin(angle);

                var ray = {
                        angle : angle,
                        x1 : this.center.x,
                        y1 : this.center.y,
                        x2 : this.center.x + dx,
                        y2 : this.center.y + dy,
                        strength : this.strength,
                        color : this.color
                };
                this.rays.push(ray);
            }
        },

        update : function() {
            this.intersects = [];
            var segments = [];

            this.game.coq.entities.all().forEach(function(ent) {
                if (ent.getLightSegments) {
                    var seg =  ent.getLightSegments(this);

                    if (seg[0].src != this.source){
                        segments = segments.concat(seg);
                    }
                }
            }.bind(this));

            //add outside of box
            var buffer = 10;
            segments.push({x1 : -buffer, y1 : -buffer, x2 : 800 + buffer, y2: -buffer, src: false});
            segments.push({x1 : 800 + buffer, y1 : -buffer, x2 : 800 + buffer, y2: 600 + buffer, src : false});
            segments.push({x1 : 800 + buffer, y1 : 600 + buffer, x2 : -buffer, y2: 600 + buffer, src : false});
            segments.push({x1 : -buffer, y1 : 600 + buffer, x2 : -buffer, y2: -buffer, src : false});

            for(var j = 0; j < this.rays.length; j++){
                ray = this.rays[j];
                // Find CLOSEST intersection
                var closestIntersect = null;

                for(var i = 0; i < segments.length; i++){
                    var intersect = getIntersection(ray, segments[i]);
                    if(!intersect) continue;
                    if(!closestIntersect || intersect.param < closestIntersect.param){
                        closestIntersect = intersect;
                    }
                }

                if (closestIntersect.segment.src && closestIntersect.segment.src instanceof Lens) {
                    closestIntersect.segment.src.refract(this.rays[j], closestIntersect);
                }

                if (closestIntersect.segment.src && closestIntersect.segment.src instanceof Asteroid) {
                    closestIntersect.segment.src.damage(1);
                }

                // Add to list of intersects
                this.intersects.push(closestIntersect);
            }
        },

        draw : function(ctx) {
            if(this.intersects.length === 0) return;
            //draw polygon
            var i;

            if (this.game.debugMode) {
                ctx.fillRect(this.center.x - 3, this.center.y - 3, 6, 6);
            }

            ctx.lineWidth = 20;

            if (this.radial) {
                for (i = 0; i < this.intersects.length; i++) {
                    ctx.beginPath();
                    ctx.strokeStyle = this.rays[i].color;
                    ctx.moveTo(this.rays[i].x1, this.rays[i].y1);
                    ctx.lineTo(this.intersects[i].x, this.intersects[i].y);
                    ctx.stroke();
                }
            } else {
                ctx.strokeStyle = this.color;
                for (i = 0; i < this.intersects.length; i++) {
                    ctx.beginPath();
                    ctx.moveTo(this.center.x, this.center.y);
                    ctx.lineTo(this.intersects[i].x, this.intersects[i].y);
                    ctx.stroke();
                }
            }

            //clear out dynamic lighting
            if (this.radial) {
                this.rays = [];
            }

            if (this.sprite) {
                ctx.drawImage(
                    this.sprite,
                    0,
                    0,
                    this.sprite.width,
                    this.sprite.height,
                    this.center.x - (this.sprite.width),
                    this.center.y - (this.sprite.height >> 1),
                    this.sprite.width,
                    this.sprite.height
                );
            }
        }
    };

    var getIntersection = function(ray, seg) {
        var rpx = ray.x1;
        var rpy = ray.y1;
        var rdx = ray.x2 - ray.x1;
        var rdy = ray.y2 - ray.y1;
        var rmagnitude = Math.sqrt(
            rdx * rdx +
            rdy * rdy
        );

        var spx = seg.x1;
        var spy = seg.y1;
        var sdx = seg.x2 - seg.x1;
        var sdy = seg.y2 - seg.y1;
        var smagnitude = Math.sqrt(
            sdx * sdx +
            sdy * sdy
        );

        if (rdx / rmagnitude == sdx / smagnitude &&
            rdy / rmagnitude == sdy / smagnitude ) {
            //parallel
            return null;
        }
        var T2 = (rdx * (spy - rpy) + rdy * (rpx - spx)) /
            (sdx * rdy - sdy * rdx);
        if (rdx === 0) {
            rdx = 0.000001;
        }
        var T1 = (spx + sdx * T2 - rpx) / rdx;

        if(T1 < 0) {
            return null;
        }
        if(T2 < 0 || T2 > 1) {
            return null;
        }

        return {
            x: rpx + rdx * T1,
            y: rpy + rdy * T1,
            param: T1,
            segment: seg
        };
    };
})(this);
