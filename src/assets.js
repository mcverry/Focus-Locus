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
            'welcome*:http://strikesagainst.com/focus-locus/res/vid/welcome.mp4',
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
