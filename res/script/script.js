
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
            this.skipVideoFlag = false;
            var ctx = this.coq.renderer._ctx;
            this.viddraw = {
                    staticplay : false,
                    w : this.video.videoWidth,
                    h : this.video.videoHeight,
                    x : (ctx.canvas.width - this.video.videoWidth) / 2,
                    y : (ctx.canvas.height - this.video.videoHeight) / 2
            };
            console.log(this)
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
                this.skipVideoFlag = false;
                this.scriptState = nextState;
                console.log("video skipped")
            }
        };
    },

    videoTransitionTeardown : function(){
        return function(){
            this.audio.clear();
            this.video.pause();
            this.video.currentTime = 0;
        };
    },

    loadScreenRedLight : function(strength){ 
        return this.coq.entities.create(Light, {
            center : {x : 150, y : 200},
            color : "rgba(255, 0, 0, 0.3)",
            numRays : 10,
            startAngle : -Math.PI / 8,
            endAngle : Math.PI / 8,
            strength : strength,
            sprite : this.myLoader.getFile("res/img/hubble.png")
        });
    },
    loadScreenGreenLight : function(strength) { 
        return this.coq.entities.create(Light, {
            center : {x : 150, y : 400},
            color : "rgba(0, 255, 0, 0.3)",
            numRays : 10,
            startAngle : -Math.PI / 8,
            endAngle : Math.PI / 8,
            strength : strength,
            sprite : this.myLoader.getFile("res/img/hubble.png")
        });
    },

    loadScreenLenses : function() {
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
    }

};

window.Script = {
    loading : {
        setup : function() {
            this.light1 = ScriptUtil.loadScreenRedLight.call(this,1);
            this.light2 = ScriptUtil.loadScreenGreenLight.call(this,1);
               this.coq.entities.create(Splash, {
                source : document.getElementById("focussplash"),
                zindex : 2
            });
        },

        update : function(frame) {
            var s = Math.ceil(game.loadPercent * 12);
            var s2 = 1
            if (s > 6) {
                s2 = s - 6; 
                s = 6;
            }
            if (s2 != this.s2p)
            {
                this.coq.entities.destroy(this.light2);
                this.coq.entities.all(Lens).forEach(function(entity) {
                    this.coq.entities.destroy(entity);
                }.bind(this));
                this.light2 = ScriptUtil.loadScreenGreenLight.call(this,s2);
                ScriptUtil.loadScreenLenses.call(this);
            }
            if (s != this.sp){
                this.coq.entities.destroy(this.light1);
                this.coq.entities.all(Lens).forEach(function(entity) {
                    this.coq.entities.destroy(entity);
                }.bind(this));
                this.light1 = ScriptUtil.loadScreenRedLight.call(this,s);
                ScriptUtil.loadScreenLenses.call(this);
            }
            this.sp = s;
            this.s2p = s2;
        },
        teardown : function () {
            this.coq.entities.all(Splash).forEach(function(entity) {
                this.coq.entities.destroy(entity);
            }.bind(this));
        }
    },
    titleScreen : {
        setup : function() {
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
                this.scriptState = this.startHere;
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
            this.audio.play('balloons', {channel : 'bg', loop : true });

            this.coq.entities.create(Light, {
                center : {x : 100, y : 300},
                color : "rgba(255, 255, 220, 0.2)",
                numRays : 30,
                startAngle : -Math.PI / 8,
                endAngle : Math.PI / 8,
                sprite : this.myLoader.getFile("res/img/flashlight.png")
            });

            this.coq.entities.create(Asteroid, {
                center : {x: 300, y : 425},
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
                        key: this.coq.inputter.W,
                        speed : 0.1
                    },
                    down : {
                        key : this.coq.inputter.S,
                        speed : 0.1
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
            this.audio.play('balloons', {channel : "bg", loop : true});

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
            this.audio.play('balloons', {channel: 'bg', loop:true});

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
            this.audio.play('drones', {channel : 'bg', loop : true });
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

            for (var i = 0; i < 20; i ++) {
                this.coq.entities.create(Asteroid, {
                    center : {x: 800 + i * (100 + Math.random() * 50), y: 50 + Math.random()  * 225},
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
            var lens = this.coq.entities.all(Lens)[0];
            this.saveLensPositionForLevel5 = {
                x : lens.center.x,
                y : lens.center.y
            };

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

            for (var i = 0; i < 25; i ++) {
                this.coq.entities.create(Asteroid, {
                    center : {x: 800 + i * (100 + Math.random() * 50), y: 50 + Math.random()  * 225},
                    sprite : this.myLoader.getFile("res/img/balloon_orange.png"),
                    popSound : 'static',
                    cookSound : 'static',
                    damageThreshold : 3,
                    strength : 500
                });
            }

            delete this.saveLensPositionForLevel5;
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
                this.scriptState = "level6";
            }
        },
        teardown : function() {
            this.coq.entities.all().forEach(function(entity) {
                this.coq.entities.destroy(entity);
            }.bind(this));
        }
    },

    level6 : {
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

            this.coq.entities.create(Light, {
                center : {x : 50, y : 200},
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

            for (var i = 0; i < 25; i ++) {
                this.coq.entities.create(Asteroid, {
                    center : {x: 800 + i * (100 + Math.random() * 50), y: 50 + Math.random()  * 225},
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
                this.scriptState = "level7Intro";
            }
        },
        teardown : function() {
            this.coq.entities.all().forEach(function(entity) {
                this.coq.entities.destroy(entity);
            }.bind(this));
        }
    },

    level7Intro : ScriptUtil.newVideoTransition('bombs-to-asteroids', 'level7'),

    level7 : {
        setup : function () {
            var i;
            this.audio.play('asteroids', {channel : 'bg', loop : true });

            this.coq.entities.create(Splash, {
                source : this.myLoader.getFile('res/img/earth.png'),
                zindex : -1
            });

            this.coq.entities.create(Light, {
                center : {x : 0, y : 550},
                color : "rgba(255, 255, 220, 0.2)",
                numRays : 65,
                startAngle : Math.PI * 3/4,
                endAngle : Math.PI * 1.9
            });

            this.coq.entities.create(Lens, {
                center: {x: 100, y : 300},
                limits : {top : 50, bottom : 500},
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
                sprite : this.myLoader.getFile("res/img/hubble.png")
            });

            for (i = 0; i < 25; i ++) {
                this.coq.entities.create(Asteroid, {
                    center : {x: 800 + i * (100 + Math.random() * 50), y: 50 + Math.random()  * 225},
                    sprite : this.myLoader.getFile("res/img/zorq_asteroid_1.png"),
                    popSound : 'static',
                    cookSound : 'static',
                    damageThreshold : 2,
                    strength : 300
                });
            }
        },
        update : function(frame) {
            var notFriends = this.coq.entities.all(Asteroid).filter(function(asteroid) {
                return !asteroid.friend;
            });
            notFriends.forEach(function(asteroid){
                asteroid.center.x -= 1;
                if (asteroid.center.x <= 0) {
                    this.coq.entities.destroy(asteroid);
                }
            }.bind(this));
            if (notFriends.length === 0) {
                this.scriptState = "level8";
            }
        },
        teardown : function(frame) {
            var lens = this.coq.entities.all(Lens)[0];
            this.saveLensPositionForLevel8 = {
                x : lens.center.x,
                y : lens.center.y
            };
            this.coq.entities.all().forEach(function(entity) {
                this.coq.entities.destroy(entity);
            }.bind(this));
        }
    },

    level8 : {
        setup : function() {
            this.audio.play('asteroids', {channel : 'bg', loop : true });

            this.coq.entities.create(Light, {
                center : {x : 0, y : 550},
                color : "rgba(255, 255, 220, 0.2)",
                numRays : 65,
                startAngle : Math.PI * 3/4,
                endAngle : Math.PI * 1.9
            });

            this.coq.entities.create(Lens, {
                center: this.saveLensPositionForLevel8 || {x: 100, y : 300},
                limits : {top : 50, bottom : 500},
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
                sprite : this.myLoader.getFile("res/img/hubble.png")
            });

            this.coq.entities.create(Lens, {
                center: {x: 200, y : 300},
                limits : {top : 50, bottom : 500},
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
                sprite : this.myLoader.getFile("res/img/webb.png")
            });

            for (i = 0; i < 30; i ++) {
                this.coq.entities.create(Asteroid, {
                    center : {x: 800 + i * (100 + Math.random() * 50), y: 30 + Math.random()  * 225},
                    sprite : this.myLoader.getFile("res/img/zorq_asteroid_1.png"),
                    popSound : 'static',
                    cookSound : 'static',
                    damageThreshold : 2,
                    strength : 300
                });
            }

            delete this.saveLensPositionForLevel8;
        },
        update : function(frame) {
            var notFriends = this.coq.entities.all(Asteroid).filter(function(asteroid) {
                return !asteroid.friend;
            });
            notFriends.forEach(function(asteroid){
                asteroid.center.x -= 1;
                if (asteroid.center.x <= 0) {
                    this.coq.entities.destroy(asteroid);
                }
            }.bind(this));
            if (notFriends.length === 0) {
                this.scriptState = "level9Intro";
            }
        },
        teardown : function () {
            this.coq.entities.all().forEach(function(entity) {
                this.coq.entities.destroy(entity);
            }.bind(this));
        }
    },

    level9Intro : ScriptUtil.newVideoTransition('asteroids-to-stars', 'level9'),

    level9 : {
        setup : function() {
            this.audio.play('stars', {channel : 'bg', loop : true });
            var hereComesTheSunDoDoDoDo = this.coq.entities.create(Light, {
                center : {x : 50, y : 300},
                color : "rgba(255, 255, 220, 0.05)",
                numRays : 179,
                sprite : this.myLoader.getFile("res/img/sun.png"),
                spriteOffset : {x : 24, y : 0}
            });

            this.coq.entities.create(Asteroid, {
                center : {x: 55, y : 300},
                size : {x : 8, y : 8},
                sprite : this.myLoader.getFile("res/img/mercury.png"),
                popSound : 'static',
                cookSound : 'static',
                damageThreshold : 3,
                strength : 500,
                sun : hereComesTheSunDoDoDoDo,
                speed : 0.02,
                sizeAdjust : 0.01,
                friend : true
            });

            this.coq.entities.create(Asteroid, {
                center : {x: 80, y : 300},
                size : {x : 16, y : 16},
                sprite : this.myLoader.getFile("res/img/venus.png"),
                popSound : 'static',
                cookSound : 'static',
                damageThreshold : 3,
                strength : 500,
                sun : hereComesTheSunDoDoDoDo,
                speed : 0.015,
                sizeAdjust : 0.1,
                friend : true
            });

            this.coq.entities.create(Asteroid, {
                center : {x: 190, y : 300},
                size : {x : 16, y : 16},
                sprite : this.myLoader.getFile("res/img/spritesheet_earth.png"),
                popSound : 'static',
                cookSound : 'static',
                damageThreshold : 3,
                strength : 500,
                sun : hereComesTheSunDoDoDoDo,
                speed : 0.01,
                sizeAdjust : 0.33,
                friend : true
            });

            this.coq.entities.create(Asteroid, {
                center : {x: 300, y : 300},
                size : {x : 16, y : 16},
                sprite : this.myLoader.getFile("res/img/mars.png"),
                popSound : 'static',
                cookSound : 'static',
                damageThreshold : 3,
                strength : 500,
                sun : hereComesTheSunDoDoDoDo,
                speed : 0.008,
                sizeAdjust : 0.33,
                friend : true
            });

            for (i = 0; i < 25; i ++) {
                this.coq.entities.create(Asteroid, {
                    center : {x: 800 + i * (100 + Math.random() * 50), y: 50 + Math.random()  * 225},
                    sprite : this.myLoader.getFile("res/img/sun.png"),
                    size : {x : 32, y: 32},
                    popSound : 'static',
                    cookSound : 'static',
                    light : this.coq.entities.create(Light, {
                        numRays : 179,
                        color : "rgba(255, 220, 220, 0.1)",
                        startAngle : 0,
                        endAngle : Math.PI * 2,
                        off : true
                    })
                });
            }

            this.coq.entities.create(Lens, {
                zindex : 0,
                center : {x: 400, y : 300},
                size : {x : 128, y : 128},
                limits : {top : 50, bottom : 550},
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
                friction : {x : 0.95, y: 0.95},
                sprite : this.myLoader.getFile("res/img/black_hole.png")
            });
        },
        update : function(frame) {
            var notFriends = this.coq.entities.all(Asteroid).filter(function(asteroid) {
                return !asteroid.friend;
            });
            notFriends.forEach(function(asteroid){
                asteroid.center.x -= 1;
                if (asteroid.center.x <= 0) {
                    if (asteroid.light) {
                        this.coq.entities.destroy(asteroid.light);
                    }
                    this.coq.entities.destroy(asteroid);
                } else if (asteroid.light && asteroid.center.x < 832 && !asteroid.light.on) {
                    asteroid.light.on = true;
                }
            }.bind(this));
            if (notFriends.length === 0) {
                this.scriptState = "goodJob";
            }
        },
        teardown : function () {
            this.coq.entities.all().forEach(function(entity) {
                this.coq.entities.destroy(entity);
            }.bind(this));
        }
    },

    goodJob : ScriptUtil.newVideoTransition('good-job', 'credits'),

    credits : {
        setup : function () {
            this.coq.entities.create(Splash, {
                    source : this.myLoader.getFile('res/img/credits.png'),
                    zindex : 2
            });
        }
    }
};
