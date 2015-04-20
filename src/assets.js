function getAssets(){
    return [
            'res/img/balloon_orange.png',
            'res/img/balloon_yellow.png',
            'res/img/focus_splash.png',
            'res/img/spritesheet_earth.png',
            'res/img/zorq_asteroid_1.png',
            'res/img/balloon_pink.png',
            'res/img/flashlight.png',
            'res/img/hubble.png',
            'res/img/hangar.png',
            'res/img/ceiling_lens.png',
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
        ['balloons', 'audio/Battle-Balloons.mp3', 1]
    ];

}

function getTimings() {
    return {
        balloons : 26000,
        epic : 26500,
    };
}
