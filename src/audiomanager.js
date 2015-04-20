;(function(exports) {
    exports.AudioManager = function(game, audio, cbFinish){
        this.audio = {};
        this.playing = {};

        this.cbFinish = cbFinish || function() {};
        this.bg = null;
        this.game = game;
        this.total = audio.length;
        this.loaded = 0;

        for (var i = 0; i < audio.length; i++){
            this.loads(audio[i]);
        }
    };

    exports.AudioManager.prototype._cbSoundLoaded = function (){
        var that = this;
        return function(){
            that.loaded++;
            if (that.loaded >= that.total){
                that.cbFinish.call(that.game);
            }   
        }
    }

    exports.AudioManager.prototype.loads = function(aud) {
        this.audio[aud[0]] = new Howl({
                urls: [this.game.prefixRes + aud[1]],
                onload : this._cbSoundLoaded()
            });
    }

    exports.AudioManager.prototype._cbPlay = function(sound, track){
        var that = this;
        return function(id){
            var c = that.playing[track]
            if (c) {
                c.sound.stop(c.id);
            }
            that.playing[track] = {sound : sound, id : id};
        }
    }

    exports.AudioManager.prototype.play = function(aid, options){
        if (options === undefined){
            options = {};
        };

        var volume = options.volume || 1.0;
        var loop = options.loop || false;
        var track = options.channel || "global";

        var s = this.audio[aid]
        if (!s){
            console.log("no such sound with audio id ", aid);
            return false;
        }

        console.log("playing ", aid, " on channel ", track, ":", loop, volume);
        s.play(this._cbPlay(s, track));
        s.volume(volume); 
        s.loop(loop);  
    };


    exports.AudioManager.prototype.clear = function() {
        for (var a in this.audio){
            for (var t in a.playing){
                a.sound.stop(t);
            }
        }
    };

})(window);