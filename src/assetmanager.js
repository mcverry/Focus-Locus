;(function(exports) {

    exports.AssetManager = function(){

        this.imageQueue = [
            'res/img/balloon_orange.png',
            'res/img/balloon_yellow.png',
            'res/img/focus_splash.png',
            'res/img/spritesheet_earth.png',
            'res/img/balloon_pink.png',
            'res/img/flashlight.png',
            'res/img/hubble.png'
        ];

        this.videos = [
            'res/vid/empire.mp4'
        ];

        this.total = this.imageQueue.length;
        this.successCount = 0;
        this.errorCount = 0;
        this.cache = {};
    }

    exports.AssetManager.prototype.isDone = function() {
        return (this.successCount + this.errorCount >= this.total);
    };

    exports.AssetManager.prototype.getAsset = function(path){
        return this.cache[path];
    };

    exports.AssetManager.prototype.loadVideo = function(level){
        var player = document.getElementById('videoplayer');
        var mp4vid = document.getElementById('mp4vid');

        if (level >= this.videos.length || level < 0) {
            level = this.videos.length - 1;
        }

        player.pause();
        mp4vid.setAttribute('src', this.videos[level]);
        player.load();
    };

    exports.AssetManager.prototype.playVideo = function(level) {
        var player = document.getElementById('videoplayer');
        player.play();
    };

    exports.AssetManager.prototype.downloadAll = function(downloadCallback, progressCallback) {
        
        for(var i = 0; i < this.imageQueue.length; i++) {
            var path = this.imageQueue[i];
            var img = new Image;
            var that = this;
            img.addEventListener("load", function() {
                that.successCount += 1;
                if (that.isDone()) {
                    downloadCallback();
                } else {
                    progressCallback(that.successCount, that.total);
                }
            }, false);
            img.addEventListener("error", function() {
                that.errorCount += 1;
                console.log(this.src, ' failed to load');
                if (that.isDone()) {
                    downloadCallback();
                } else {
                    progressCallback(that.successCount, that.total);
                }
            }, false);
            img.src = path;
            this.cache[path] = img;
        }
    }

})(window);
