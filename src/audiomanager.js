;(function(exports) {
    exports.AudioManager = function(game, audio, cbFinish){
        this.audio = {};
        this.playing = {};

        this.cbFinish = cbFinish || function() {};
        this.bg = null;
        this.game = game;
        this.total = audio.length;
        this.loaded = 0;

        console.log(this.total);
        for (var i = 0; i < audio.length; i++){
            this.loads(audio[i]);
        }
    };

    exports.AudioManager.prototype._cbSoundLoaded = function (x){
        var that = this;
        return function(){
            console.log(x, "loaded");
            that.loaded++;
            if (that.loaded >= that.total){
                that.cbFinish.call(that.game);
            }   
        }
    }

    exports.AudioManager.prototype._cbSoundFailedToLoad = function(x){
        return function() {
            console.log(x, "failed to load");
        };
    }

    exports.AudioManager.prototype.loads = function(aud) {
        this.audio[aud[0]] = new Howl({
                urls: [this.game.prefixRes + aud[1]],
                onload : this._cbSoundLoaded(aud),
                onerror : this._cbSoundFailedToLoad(aud)
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

        s.volume(volume); 
        s.loop(loop);  
        s.play(this._cbPlay(s, track));
    };


    exports.AudioManager.prototype.clear = function() {
        for (var a in this.playing){
            this.playing[a].sound.stop();
        }
        this.playing = {};
    };

})(window);
