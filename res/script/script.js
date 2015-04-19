window.Script = {
    loading : {
        setup : function() {
            this.coq.entities.create(Splash, {
                source : document.getElementById("focussplash"),
                zindex : 2
            });
        }
    },
    titleScreen : {
        setup : function() {
            this.coq.entities.create(Light, {
                center : {x : 150, y : 200},
                color : "rgba(255, 0, 0, 0.3)",
                numRays : 10,
                startAngle : -Math.PI / 8,
                endAngle : Math.PI / 8,
                sprite : this.myLoader.getFile("res/img/hubble.png")
            });

            this.coq.entities.create(Light, {
                center : {x : 150, y : 400},
                color : "rgba(0, 255, 0, 0.3)",
                numRays : 10,
                startAngle : -Math.PI / 8,
                endAngle : Math.PI / 8,
                sprite : this.myLoader.getFile("res/img/hubble.png")
            });

            this.coq.entities.create(Lens, {center: {x: 200, y : 200}});
            this.coq.entities.create(Lens, {center: {x: 300, y : 200}});
            this.coq.entities.create(Lens, {center: {x: 400, y : 200}});
            this.coq.entities.create(Lens, {center: {x: 500, y : 200}});
            this.coq.entities.create(Lens, {center: {x: 580, y : 200}});

            this.coq.entities.create(Lens, {center: {x: 200, y : 400}});
            this.coq.entities.create(Lens, {center: {x: 300, y : 400}});
            this.coq.entities.create(Lens, {center: {x: 400, y : 400}});
            this.coq.entities.create(Lens, {center: {x: 500, y : 400}});
            this.coq.entities.create(Lens, {center: {x: 580, y : 400}});

            this.coq.entities.create(Splash, {
                source : this.myLoader.getFile('res/img/focus_splash.png'),
                zindex : 2
            });
        },
        teardown : function() {
            this.focusSplash = null;
            this.coq.entities.all().forEach(function(entity) {
                this.coq.entities.destroy(entity);
            }.bind(this));
        },
        update : function (frame) {
            this.coq.entities.all(Lens).forEach(function(lens) {
                lens.focalLength = 10 + (Math.sin(frame / 100) * 1.5);
            });
            if (this.flagthing && !(this.coq.inputter.isDown(this.coq.inputter.SPACE))) {
                this.scriptState = "welcome";
            } else if (this.coq.inputter.isDown(this.coq.inputter.SPACE)) {
                this.flagthing = true;
            }
        },
        draw : function(ctx) {

        }
    },
    welcome : {
        setup : function(){
            this.video = this.myLoader.getFile("welcome");
            console.log(this.video);
            this.video.play();
        },

        draw : function(ctx) {
            
            //this.video
            if (this.video) {
                ctx.drawImage(this.video, 200, 150);
            }
        },

        update : function() {
            if (this.video.ended) {
                this.scriptState = "intro";
            }
        }
    },
    intro : {
        setup : function() {
            this.coq.entities.create(Light, {
                center : {x : 150, y : 300},
                color : "rgba(255, 255, 220, 0.2)",
                numRays : 30,
                startAngle : -Math.PI / 8,
                endAngle : Math.PI / 8,
                sprite : this.myLoader.getFile("res/img/flashlight.png")
            });

            this.coq.entities.create(Asteroid, {
                center : {x: 300, y : 400},
                sprite : this.myLoader.getFile("res/img/balloon_orange.png")
            });

            this.coq.entities.create(Asteroid, {
                center : {x: 450, y : 300},
                sprite : this.myLoader.getFile("res/img/balloon_orange.png")
            });

            this.coq.entities.create(Asteroid, {
                center : {x: 600, y : 400},
                sprite : this.myLoader.getFile("res/img/balloon_orange.png")
            });

            this.coq.entities.create(Lens, {
                center: {x: 200, y : 300},
                movement : {
                    up : {
                        key: this.coq.inputter.UP_ARROW,
                        speed : 0.3
                    },
                    down : {
                        key : this.coq.inputter.DOWN_ARROW,
                        speed : 0.3
                    },
                    left : {
                        key : this.coq.inputter.LEFT_ARROW,
                        speed : 0.7
                    },
                    right : {
                        key : this.coq.inputter.RIGHT_ARROW,
                        speed : 0.7
                    }
                }
            });
        },
        teardown : function() {

        },
        update : function(frame) {

        },
        draw : function(ctx) {

        }
    }
};
