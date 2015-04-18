;(function(exports){

    exports.Light = function(game, options) {

        this.game = game;

        this.center = options.center;
        this.color = options.color || "white";

        this.intersects = [];

        this.maxDistance = 1000;
    };

    exports.Light.prototype = {
        update : function() {
            var entities = this.game.coq.entities.all();
            var segments = entities.map(function(ent) {
                return ent.getLightPoints ? ent.getLightPoints(this) : false;
            }).filter(function(segs) {
                return !!segs;
            });
            segments = segments.filter(function(seg) {
                return Math.sqrt(Math.pow(this.center.x - seg.x1, 2) + Math.pow(this.center.y - seg.y1, 2)) < this.maxDistance;
            }.bind(this));
            var points = boxSegmentsToPoints(segments);
            var angles = this.getAllAngles(points);
            this.getSortedIntersects(angles, segments);
        },

        getSortedIntersects : function(angles, segments) {
            var i, j, dx, dy, ray, closest, intersect;
            this.intersects = [];
            for(i = 0; i < angles.length; i++) {
                dx = Math.cos(angles[i]);
                dy = Math.sin(angles[i]);

                ray = {
                    x1: this.center.x,
                    y1: this.center.y,
                    x2: this.center.x + dx,
                    y2: this.center.y + dy
                };

                closest = null;
                for (j = 0; j < segments.length; j++) {
                    intersect = getIntersection(ray, segments[j]);
                    if (!intersect) continue;
                    if (!closest || intersect.param < closest.param) {
                        closest = intersect;
                    }
                }

                if (!closest) continue;
                closest.angle = angles[i];

                this.intersects.push(closest);
            }

            this.intersects = pareIntersects(this.intersects);

            this.intersects = this.intersects.sort(function(a,b) {
                return a.angle - b.angle;
            });
        },

        getAllAngles : function(points) {
            var i, angles = [];
            for (i = 0; i < points.length; i++) {
                var angle = Math.atan2(points[i].y - this.center.y,
                    points[i].x - this.center.x);
                points[i].angle = angle;
                angles.push(angle - 0.00001, angle, angle + 0.00001);
            }
            return angles;
        },

        draw : function(ctx) {
            if(this.intersects.length === 0) return;
            //draw polygon
            var i;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(this.intersects[0].x, this.intersects[0].y);
            for (i = 1; i < this.intersects.length; i++) {
                ctx.lineTo(this.intersects[i].x, this.intersects[i].y);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }
    };

    var pareIntersects = function(intersects) {
        var set = {};
        return intersects.filter(function(i) {
            var key = (i.x | 0) + "," + (i.y | 0);
            if (key in set) {
                return false;
            } else {
                set[key] = true;
                return true;
            }
        });
    };

    var boxSegmentsToPoints = function(segArr) {
        var points = [];

        segArr.forEach(function(seg) {
            points.push({
                x: seg.x1,
                y: seg.y1
            });
        });

        return points;
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
        var T1 = (spx + sdx * T2 - rpx) / rdx;

        if(T1 < 0) return null;
        if(T2 < 0 || T2 > 1) return null;

        return {
            x: rpx + rdx * T1,
            y: rpy + rdy * T1,
            param: T1
        };
    };
})(this);
