;(function(exports) {
    exports.AudioManager = function(game, audio, cbFinish){
        this.audio = {};
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
        this.audio[aud[0]] = {
            sound : new Howl({
                urls: [this.game.prefixRes + aud[1]],
                onload : this._cbSoundLoaded()
            }),
            playing : {}
        };
    }

    exports.AudioManager.prototype.play = function(aid, myid, options){
        if (options === undefined){
            options = {};
        };
        var volume = options.volume || 1.0;
        var loop = options.loop || false;
        var track = myid || "global";

        var s = this.audio[aid]
        if (!s){
            console.log("no such sound with audio id ", aid);
            return false;
        }

        if (s.playing[track] !== undefined){
            console.log("sound already playing on track", aid, track);
            return false;
        }

        s.playing[track] = -1;
        s.sound.play(this._cbPlay(s, track));
        s.sound.volume(volume); 
        s.sound.loop(loop);  
    };

})(window);
