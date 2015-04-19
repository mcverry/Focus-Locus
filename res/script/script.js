window.Script = {
    titleScreen : {
        setup : function() {
            this.sunA = this.coq.entities.create(Light, {
                center : {x : 150, y : 200},
                color : "rgba(255, 0, 0, 0.3)",
                numRays : 70,
                startAngle : -Math.PI / 8,
                endAngle : Math.PI / 8
            });

            this.sunB = this.coq.entities.create(Light, {
                center : {x : 150, y : 400},
                color : "rgba(0, 255, 0, 0.3)",
                numRays : 70,
                startAngle : -Math.PI / 8,
                endAngle : Math.PI / 8
            });

            this.coq.entities.create(Lens, {center: {x: 200, y : 200}});
            this.coq.entities.create(Lens, {center: {x: 300, y : 200}});
            this.coq.entities.create(Lens, {center: {x: 400, y : 200}});
            this.coq.entities.create(Lens, {center: {x: 500, y : 200}});
            this.coq.entities.create(Lens, {center: {x: 560, y : 200}});

            this.coq.entities.create(Lens, {center: {x: 200, y : 400}});
            this.coq.entities.create(Lens, {center: {x: 300, y : 400}});
            this.coq.entities.create(Lens, {center: {x: 400, y : 400}});
            this.coq.entities.create(Lens, {center: {x: 500, y : 400}});
            this.coq.entities.create(Lens, {center: {x: 560, y : 400}});

            this.coq.entities.create(Splash, {
                source : "./res/img/focus_splash.png",
                zindex : 2
            });
        },
        teardown : function() {
            this.focusSplash = null;
        },
        update : function (frame) {
            this.coq.entities.all(Lens).forEach(function(lens) {
                lens.focalLength = 10 + (Math.sin(frame / 100) * 1.5);
            });
        },
        draw : function(ctx) {
        }
    },
};
