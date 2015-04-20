
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
                    if (!this.viddraw.staticplay){
                        this.viddraw.staticplay = true;
                        this.audio.play('static', {channel : 'bg'});
                    }
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
            this.video.play();

            var ctx = this.coq.renderer._ctx;
            this.viddraw = {
                    staticplay : false,
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
                //this.scriptState = "level1Intro";
                this.scriptState = "level5"
            } else if (this.coq.inputter.isDown(this.coq.inputter.SPACE)) {
                this.flagthing = true;
            }
        },
        draw : function(ctx) {

        }
    },

    level1Intro : ScriptUtil.newVideoTransition('test', 'level1'),

    level1 : {
        setup : function() {
            this.audio.play('full', {channel : 'bg', loop : true });

            this.coq.entities.create(Light, {
                center : {x : 100, y : 300},
                color : "rgba(255, 255, 220, 0.2)",
                numRays : 30,
                startAngle : -Math.PI / 8,
                endAngle : Math.PI / 8,
                sprite : this.myLoader.getFile("res/img/flashlight.png")
            });

            this.coq.entities.create(Asteroid, {
                center : {x: 300, y : 450},
                sprite : this.myLoader.getFile("res/img/balloon_orange.png"),
                popSound : 'pop',
                cookSound : 'static',
            });

            this.coq.entities.create(Asteroid, {
                center : {x: 450, y : 300},
                sprite : this.myLoader.getFile("res/img/balloon_orange.png"),
                popSound : 'pop',
                cookSound : 'static',
                strength : 3000
            });

            this.coq.entities.create(Asteroid, {
                center : {x: 600, y : 400},
                sprite : this.myLoader.getFile("res/img/balloon_orange.png"),
                popSound : 'pop',
                cookSound : 'static'
            });

            this.coq.entities.create(Lens, {
                center: {x: 200, y : 300},
                movement : {
                    up : {
                        key: this.coq.inputter.UP_ARROW,
                        speed : 0.1
                    },
                    down : {
                        key : this.coq.inputter.DOWN_ARROW,
                        speed : 0.1
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
                    y : 200
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
        setup : function() {

            this.audio.play('full', {channel : "bg", loop : true});

            this.coq.entities.create(Asteroid, {
                center : {x: 400, y : 300},
                sprite : this.myLoader.getFile("res/img/balloon_orange.png"),
                popSound : 'pop',
                cookSound : 'static',
            });

            this.coq.entities.create(Asteroid, {
                center : {x: 500, y : 300},
                sprite : this.myLoader.getFile("res/img/balloon_yellow.png"),
                popSound : 'pop',
                cookSound : 'static',
                friend : true
            });

            this.coq.entities.create(Asteroid, {
                center : {x: 600, y : 400},
                sprite : this.myLoader.getFile("res/img/balloon_orange.png"),
                popSound : 'pop',
                cookSound : 'static',
            });

            this.coq.entities.create(Asteroid, {
                center : {x: 700, y : 400},
                sprite : this.myLoader.getFile("res/img/balloon_yellow.png"),
                popSound : 'pop',
                cookSound : 'static',
                friend : true
            });

            this.coq.entities.create(Splash, {
                source : this.myLoader.getFile('res/img/hangar.png'),
                zindex : -1
            });
        },
        update : function(frame) {
            if (this.coq.entities.all(Asteroid).filter(function(balloon) {
                    return !balloon.friend;
                }).length === 0
            ) {
                this.scriptState = "level3";
            }
        },
        teardown : function() {
            this.coq.entities.all(Asteroid).forEach(function(entity) {
                this.coq.entities.destroy(entity);
            }.bind(this));
        }
    },

    level3 : {
        setup : function() {
            this.audio.play('full', {channel: 'bg', loop:true});

            this.coq.entities.create(Asteroid, {
                center : {x: 800, y : 300},
                sprite : this.myLoader.getFile("res/img/balloon_orange.png"),
                popSound : 'pop',
                cookSound : 'static',
            });

            this.coq.entities.create(Asteroid, {
                center : {x: 900, y : 300},
                sprite : this.myLoader.getFile("res/img/balloon_yellow.png"),
                popSound : 'pop',
                cookSound : 'static',
                friend : true
            });

            this.coq.entities.create(Asteroid, {
                center : {x: 1000, y : 400},
                sprite : this.myLoader.getFile("res/img/balloon_orange.png"),
                popSound : 'pop',
                cookSound : 'static',
            });

            this.coq.entities.create(Asteroid, {
                center : {x: 1100, y : 400},
                sprite : this.myLoader.getFile("res/img/balloon_yellow.png"),
                popSound : 'pop',
                cookSound : 'static',
                friend : true
            });

            this.coq.entities.create(Asteroid, {
                center : {x: 1200, y : 300},
                sprite : this.myLoader.getFile("res/img/balloon_orange.png"),
                popSound : 'pop',
                cookSound : 'static',
            });

            this.coq.entities.create(Asteroid, {
                center : {x: 1300, y : 300},
                sprite : this.myLoader.getFile("res/img/balloon_yellow.png"),
                popSound : 'pop',
                cookSound : 'static',
                friend : true
            });

            this.coq.entities.create(Asteroid, {
                center : {x: 1400, y : 400},
                sprite : this.myLoader.getFile("res/img/balloon_orange.png"),
                popSound : 'pop',
                cookSound : 'static',
            });

            this.coq.entities.create(Asteroid, {
                center : {x: 1500, y : 400},
                sprite : this.myLoader.getFile("res/img/balloon_yellow.png"),
                popSound : 'pop',
                cookSound : 'static',
                friend : true
            });

            this.coq.entities.create(Splash, {
                source : this.myLoader.getFile('res/img/hangar.png'),
                zindex : -1
            });
        },
        update : function(frame) {
            var asteroids = this.coq.entities.all(Asteroid);
            asteroids.forEach(function(balloon){
                balloon.center.x -= 1;
            });

            if (asteroids.filter(function(balloon) {
                    return !balloon.friend;
                }).length === 0
            ) {
                this.scriptState = "level4Intro";
            }
        },
        teardown : function() {
            this.coq.entities.all().forEach(function(entity) {
                this.coq.entities.destroy(entity);
            }.bind(this));
        }
    },

    level4Intro : ScriptUtil.newVideoTransition('flashlights-to-bombs', 'level4'),

    level4 : {
        setup : function () {
            this.coq.entities.create(Splash, {
                source : this.myLoader.getFile('res/img/desert.png'),
                zindex : -2
            });

            this.coq.entities.create(Splash, {
                source : this.myLoader.getFile('res/img/desert_front.png'),
                zindex : 1
            });

            this.coq.entities.create(Light, {
                center : {x : 50, y : 300},
                color : "rgba(255, 255, 220, 0.3)",
                numRays : 32,
                startAngle : Math.PI * 1.6,
                endAngle : Math.PI * 2,
                sprite : this.myLoader.getFile("res/img/big_flashlight.png"),
                spriteOffset : {x: 50, y : 80}
            });

            var hab1 = this.coq.entities.create(Asteroid, {
                size : {x : 32, y : 78 / 2},
                sprite : this.myLoader.getFile("res/img/hot_air_balloon_1.png"),
                popSound : 'static',
                cookSound : 'static',
                friend : true
            });

            this.coq.entities.create(Lens, {
                center: {x: 250, y : 200},
                limits : { top: 50, bottom: 300 },
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
                attachment : hab1,
                attachmentOffset : {x: 0, y : -64},
                sprite: this.myLoader.getFile('res/img/lens.png'),
                spriteOffset : {x : 0, y : 0}
            });

            for (var i = 0; i < 20; i ++) {
                this.coq.entities.create(Asteroid, {
                    center : {x: 800 + i * (100 + Math.random() * 100), y: 50 + Math.random()  * 225},
                    sprite : this.myLoader.getFile("res/img/balloon_orange.png"),
                    popSound : 'static',
                    cookSound : 'static',
                    damageThreshold : 3,
                    strength : 500
                });
            }
        },
        update : function(frame) {
            var notFriends = this.coq.entities.all(Asteroid).filter(function(balloon) {
                return !balloon.friend;
            });
            notFriends.forEach(function(balloon){
                balloon.center.x -= 1;
                if (balloon.center.x <= 0) {
                    this.coq.entities.destroy(balloon);
                }
            }.bind(this));
            if (notFriends.length === 0) {
                this.scriptState = "level5";
            }
        },
        teardown : function () {
            this.coq.entities.all(Lens).forEach(function(entity) {
                this.saveLensPositionForLevel5 = {
                    x : entity.center.x,
                    y : entity.center.y
                };
                this.coq.entities.destroy(entity);
            }.bind(this));

            this.coq.entities.all().forEach(function(entity) {
                this.coq.entities.destroy(entity);
            }.bind(this));
        }
    },

    level5 : {
        setup : function () {

            this.coq.entities.create(Splash, {
                source : this.myLoader.getFile('res/img/desert.png'),
                zindex : -2
            });

            this.coq.entities.create(Splash, {
                source : this.myLoader.getFile('res/img/desert_front.png'),
                zindex : 1
            });

            this.coq.entities.create(Light, {
                center : {x : 50, y : 300},
                color : "rgba(255, 255, 220, 0.3)",
                numRays : 32,
                startAngle : Math.PI * 1.7,
                endAngle : Math.PI * 2,
                sprite : this.myLoader.getFile("res/img/big_flashlight.png"),
                spriteOffset : {x: 50, y : 80}
            });

            var hab1 = this.coq.entities.create(Asteroid, {
                size : {x : 32, y : 78 / 2},
                sprite : this.myLoader.getFile("res/img/hot_air_balloon_1.png"),
                popSound : 'static',
                cookSound : 'static',
                friend : true
            });

            this.coq.entities.create(Lens, {
                center: this.saveLensPositionForLevel5 || {x: 250, y : 200},
                limits : { top: 50, bottom: 300 },
                movement : {
                    up : {
                        key: this.coq.inputter.W,
                        speed : 0.3
                    },
                    down : {
                        key : this.coq.inputter.S,
                        speed : 0.3
                    },
                    left : {
                        key : this.coq.inputter.A,
                        speed : 0.7
                    },
                    right : {
                        key : this.coq.inputter.D,
                        speed : 0.7
                    }
                },
                attachment : hab1,
                attachmentOffset : {x: 0, y : -64},
                sprite: this.myLoader.getFile('res/img/lens.png'),
                spriteOffset : {x : 0, y : 0}
            });

            var hab2 = this.coq.entities.create(Asteroid, {
                size : {x : 32, y : 96 / 2},
                sprite : this.myLoader.getFile("res/img/hot_air_balloon_2.png"),
                popSound : 'static',
                cookSound : 'static',
                friend : true
            });

            this.coq.entities.create(Lens, {
                center: {x: 300, y : 200},
                limits : { top: 50, bottom: 300 },
                movement : {
                    up : {
                        key: this.coq.inputter.I,
                        speed : 0.3
                    },
                    down : {
                        key : this.coq.inputter.K,
                        speed : 0.3
                    },
                    left : {
                        key : this.coq.inputter.J,
                        speed : 0.7
                    },
                    right : {
                        key : this.coq.inputter.L,
                        speed : 0.7
                    }
                },
                attachment : hab2,
                attachmentOffset : {x: 0, y : -64},
                sprite: this.myLoader.getFile('res/img/lens.png'),
                spriteOffset : {x : 0, y : 0}
            });

            delete this.saveLensPositionForLevel5;
        }
    },

    level6 : {

    },

    level7Intro : ScriptUtil.newVideoTransition('bombs-to-asteroids', 'level7'),

    level7 : {
        setup : function () {

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
