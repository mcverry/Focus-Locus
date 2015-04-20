;(function(exports) {
    exports.AudioManager = function(game, timings){
        this.audio = {};
        this.bg = null;
        this.game = game;
        this.timings = timings;
    };

    exports.AudioManager.prototype.clear = function(){
        this.audio = {};
    };

    exports.AudioManager.prototype.add = function(aid, options) {
        if (options === undefined) {
            options = {};
        }
        var numtracks = options.numtracks || 4;
        var playmax = options.numtracks || 0;

        var aud = {
            tracks : [],
            playmax : playmax,
            playcount : 0
        };

        var a = this.game.myLoader.getFile(aid);
        if (a === undefined || a === null) {
            return undefined;
        }

        for (var i = 0; i < numtracks; i++) {
            aud.tracks.push(a.cloneNode(true));
        }
        this.audio[aid] = aud;
    };

    exports.AudioManager.prototype.background = function(aid) {

    },


    exports.AudioManager.prototype.play = function(aid) {

        var a = this.audio[aid];
        if (a === undefined) {
            return undefined;
        }

        if (a.playmax > 0 && a.playcount >= a.playmax) {
            return false;
        }

        for (var i = 0; i < a.tracks.length; i++){
            if (a.tracks[i].paused) {
                a.tracks[i].play();
                a.playcount++;
                return true;
            }
        }
        return false;
    };

})(window);
