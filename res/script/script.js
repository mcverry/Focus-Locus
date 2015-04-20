
window.ScriptUtil = {

    newVideoTransition : function(videoid, nextState) {
        return  {
            setup : ScriptUtil.videoTransitionSetup(videoid),
            draw : ScriptUtil.videoTransitionDraw(),
            update : ScriptUtil.videoTransitionUpdate(nextState),
            teardown : ScriptUtil.videoTransitionTeardown()
        };
    },

    videoTransitionDraw : function() {
        return function(ctx) {
            if (this.video) {
                if (this.video.currentTime > this.video.duration - 1){
                    this.viddraw.y += 4;
                    this.viddraw.h -= 8;
                    this.audio.play('static');
                }
                if (this.viddraw.h <= 0) {
                    this.viddraw.h = 0;
                }

                ctx.drawImage(this.video, this.viddraw.x,  this.viddraw.y, this.viddraw.w, this.viddraw.h);
            }
        };
    },

    videoTransitionSetup : function(videoid) {
        return function() {
            this.video = this.myLoader.getFile(videoid);
            this.audio.clear();
            this.audio.add("static", {numtracks : 1, playmax : 1});
            this.video.play();

            var ctx = this.coq.renderer._ctx;
            this.viddraw = {
                    w : this.video.videoWidth,
                    h : this.video.videoHeight,
                    x : (ctx.canvas.width - this.video.videoWidth) / 2,
                    y : (ctx.canvas.height - this.video.videoHeight) / 2
            };
        };
    },

    videoTransitionUpdate : function(nextState) {
        return function() {
            if (this.coq.inputter.isDown(this.coq.inputter.SPACE)) {
                this.skipVideoFlag = true;
            }
            if (this.video.ended) {
                this.skipVideoFlag = false;
                this.scriptState = nextState;
            } else if ((this.skipVideoFlag && !this.coq.inputter.isDown(this.coq.inputter.SPACE))) {
                //todo tear down video
                this.scriptState = nextState;
            }
        };
    },

    videoTransitionTeardown : function(){
        return function(){
            this.audio.clear();
            this.video.pause();
        };
    }
};

window.Script = {
    loading : {
        setup : function() {
            this.coq.entities.create(Splash, {
                source : document.getElementById("focussplash"),
                zindex : 2
            });
        },
        teardown : function () {
            this.coq.entities.all().forEach(function(entity) {
                this.coq.entities.destroy(entity);
            }.bind(this));
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
            this.coq.entities.all().forEach(function(entity) {
                this.coq.entities.destroy(entity);
            }.bind(this));
        },
        update : function (frame) {
            this.coq.entities.all(Lens).forEach(function(lens) {
                lens.focalLength = 10 + (Math.sin(frame / 100) * 1.5);
            });
            if (this.flagthing && !(this.coq.inputter.isDown(this.coq.inputter.SPACE))) {
                this.scriptState = "level1Intro";
            } else if (this.coq.inputter.isDown(this.coq.inputter.SPACE)) {
                this.flagthing = true;
            }
        },
        draw : function(ctx) {

        }
    },

    level1Intro : ScriptUtil.newVideoTransition('welcome', 'level1'),

    level1 : {
        setup : function() {

            this.audio.background('balloons');
            this.audio.add('static');

            this.coq.entities.create(Light, {
                center : {x : 100, y : 300},
                color : "rgba(255, 255, 220, 0.2)",
                numRays : 30,
                startAngle : -Math.PI / 8,
                endAngle : Math.PI / 8,
                sprite : this.myLoader.getFile("res/img/flashlight.png")
            });

            this.coq.entities.create(Asteroid, {
                center : {x: 300, y : 400},
                sprite : this.myLoader.getFile("res/img/balloon_orange.png"),
                popSound : 'static',
                cookSound : 'static'
            });

            this.coq.entities.create(Asteroid, {
                center : {x: 450, y : 300},
                sprite : this.myLoader.getFile("res/img/balloon_orange.png"),
                popSound : 'static',
                cookSound : 'static'
            });

            this.coq.entities.create(Asteroid, {
                center : {x: 600, y : 400},
                sprite : this.myLoader.getFile("res/img/balloon_orange.png"),
                popSound : 'static',
                cookSound : 'static'
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
                },
                sprite: this.myLoader.getFile('res/img/ceiling_lens.png'),
                spriteOffset : {
                    x : 0,
                    y : 324
                }
            });

            this.coq.entities.create(Splash, {
                source : this.myLoader.getFile('res/img/hangar.png'),
                zindex : -1
            });
        },
        teardown : function() {

        },
        update : function(frame) {
            if (this.coq.entities.all(Asteroid).length === 0) {
                this.scriptState = "level2";
            }
        },
        draw : function(ctx) {

        }
    },

    level2 : {

    },

    level3 : {

    },

    level4Intro : ScriptUtil.newVideoTransition('flashlights-to-bombs', 'level4'),

    level4 : {

    },

    level5 : {

    },

    level6 : {

    },

    level7Intro : ScriptUtil.newVideoTransition('bombs-to-asteroids', 'level7'),

    level7 : {
        setup : function () {
            this.audio.add('static');

            for (var i = 0; i < 75; i++) {
                this.coq.entities.create(Light, {
                    center : {x : 0, y : i * 8},
                    color : "rgba(255, 255, 220, 0.2)",
                    numRays : 1,
                    lineWidth : 8
                });
            }

            this.coq.entities.create(Lens, {
                center: {x: 100, y : 300},
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

        }
    },

    level8 : {

    },

    level9Intro : ScriptUtil.newVideoTransition('asteroids-to-stars', 'level9'),

    level9 : {

    },

    goodJob : ScriptUtil.newVideoTransition('good-job', 'credits'),

    credits : {

    }
};
