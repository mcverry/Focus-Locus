;(function(exports){

    exports.Light = function(game, options) {

        console.log("created light");
        this.game = game;

        this.center = options.center;
        this.color = options.color || "white";
        this.strength = options.strength || 5;
        this.intersects = [];

        this.radial = options.radial || false
        this.source = options.source || null;

        this.rays = [];
        if (! options.rays) {
            this.makeRadial(options.numRays || 100);
        } else {
            this.rays = options.rays;
        }
    };

    exports.Light.prototype = {
        
        makeRadial : function(n) {  
         
            for(var angle = 0; angle < Math.PI * 2; angle += (Math.PI * 2) / n){
                // Calculate dx & dy from angle
                var dx = Math.cos(angle);
                var dy = Math.sin(angle);

                var ray = {
                        angle : angle,
                        x1 : this.center.x,
                        y1 : this.center.y,
                        x2 : this.center.x + dx,
                        y2 : this.center.y + dy,
                        strength : this.strength
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
                    
                    console.log(seg[0].src);
                    console.log(this.source);
                    if (seg[0].src != this.source){
                        segments = segments.concat(seg);
                    } else {
                        console.log("not targeting self");
                    }
                }
            }.bind(this));

            //add outside of box
            segments.push({x1 : 0, y1 : 0, x2 : 800, y2: 0, src: false});
            segments.push({x1 : 800, y1 : 0, x2 : 800, y2: 600, src : false});
            segments.push({x1 : 800, y1 : 600, x2 : 0, y2: 600, src : false});
            segments.push({x1 : 0, y1 : 600, x2 : 0, y2: 0, src : false});


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

                if (closestIntersect.segment.src){
                    closestIntersect.segment.src.refract(this.rays[j], closestIntersect)
                }

                // Add to list of intersects
                this.intersects.push(closestIntersect);
            }
        },

        draw : function(ctx) {
            if(this.intersects.length === 0) return;
            //draw polygon
            var i;

            ctx.strokeStyle = "white";
            ctx.fillRect(this.center.x - 3, this.center.y - 3, 6, 6);

            if (this.radial) {
                for (i = 0; i < this.intersects.length; i++) {
                    ctx.moveTo(this.rays[i].x1, this.rays[i].y1);
                    ctx.lineTo(this.intersects[i].x, this.intersects[i].y);
                }
            } else {
                for (i = 0; i < this.intersects.length; i++) {
                    ctx.moveTo(this.center.x, this.center.y);
                    ctx.lineTo(this.intersects[i].x, this.intersects[i].y);
                }
            }
            ctx.stroke();
            
            //clear out dynamic lighting 
            if (this.radial) {
                this.rays = [];
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
