function getAssets(){
    return [
            'res/img/balloon_orange.png',
            'res/img/balloon_yellow.png',
            'res/img/focus_splash.png',
            'res/img/spritesheet_earth.png',
            'res/img/zorq_asteroid_1.png',
            'res/img/zorq_asteroid_2.png',
            'res/img/balloon_pink.png',
            'res/img/flashlight.png',
            'res/img/hubble.png',
            'res/img/earth.png',
            'res/img/desert.png',
            'res/img/hangar.png',
            'res/img/ceiling_lens.png',
            'res/img/lens.png',
            'res/img/hot_air_balloon_1.png',
            'res/img/hot_air_balloon_2.png',
            'res/img/big_flashlight.png',
            'res/img/desert_front.png',
            'welcome*:http://strikesagainst.com/focus-locus/res/vid/welcome.mp4',
            'asteroids-to-stars*:http://strikesagainst.com/focus-locus/res/vid/asteroids-to-stars.mp4',
            'bombs-to-asteroids*:http://strikesagainst.com/focus-locus/res/vid/bombs-to-asteroids.mp4',
            'flashlights-to-bombs*:http://strikesagainst.com/focus-locus/res/vid/flashlights-to-bombs.mp4',
            'good-job*:http://strikesagainst.com/focus-locus/res/vid/good-job.mp4',
            'static*:res/audio/static.mp3',
            'test*:/res/vid/empire.mp4',
        ];
}

function getAudio() {
    return [
        ['static', 'audio/static.mp3', 4],
        ['full', 'audio/I-Can-See-The-Frames-1.0.mp3', 1],
        ['pop', 'audio/pop.mp3', 1],
        ['balloons', 'audio/Battle-Balloons.mp3', 1],

        ['drone', 'audio/Battle-Cars.mp3', 1],
        ['stars', 'audio/Battle-Stars.mp3', 1],
        ['asteroids', 'audio/Battle-Asteroids.mp3', 1],
        ['curious', 'audio/Curious-Development.mp3', 1]
    ];
}

function getTimings() {
    return {
        balloons : 26000,
        epic : 26500,
    };
}
