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
            'res/img/mercury.png',
            'res/img/venus.png',
            'res/img/earth.png',
            'res/img/mars.png',
            'res/img/desert.png',
            'res/img/hangar.png',
            'res/img/ceiling_lens.png',
            'res/img/you_lose.png',
            'res/img/dont_pop.png',
            "res/img/black_hole.png",
            'res/img/lens.png',
            'res/img/webb.png',
            'res/img/drone.png',
            'res/img/credits.png',
            'res/img/sun.png',
            'res/img/hot_air_balloon_1.png',
            'res/img/hot_air_balloon_2.png',
            'res/img/big_flashlight.png',
            'res/img/desert_front.png',
            'welcome*:https://erty.me/random/Focus-Locus/res/vid/welcome.mp4||https://erty.me/random/Focus-Locus/res/vid/welcome.webm||https://erty.me/random/Focus-Locus/res/vid/welcome.ogg',
            'asteroids-to-stars*:https://erty.me/random/Focus-Locus/res/vid/asteroids-to-stars.mp4||https://erty.me/random/Focus-Locus/res/vid/asteroids-to-stars.webm||https://erty.me/random/Focus-Locus/res/vid/asteroids-to-stars.ogg',
            'bombs-to-asteroids*:https://erty.me/random/Focus-Locus/res/vid/bombs-to-asteroids.mp4||https://erty.me/random/Focus-Locus/res/vid/bombs-to-asteroids.webm||https://erty.me/random/Focus-Locus/res/vid/bombs-to-asteroids.ogg',
            'flashlights-to-bombs*:https://erty.me/random/Focus-Locus/res/vid/flashlights-to-bombs.mp4||https://erty.me/random/Focus-Locus/res/vid/flashlights-to-bombs.webm||https://erty.me/random/Focus-Locus/res/vid/flashlights-to-bombs.ogg',
            'good-job*:https://erty.me/random/Focus-Locus/res/vid/good-job.mp4||https://erty.me/random/Focus-Locus/res/vid/good-job.webm||https://erty.me/random/Focus-Locus/res/vid/good-job.ogg',
         ];
}

function getAudio() {
    return [
        ['static', 'audio/static.mp3', 4],
        ['full', 'audio/I-Can-See-The-Frames-1.0.mp3', 1],
        ['pop', 'audio/pop.mp3', 1],
        ['balloons', 'audio/Battle-Balloons.mp3', 1],

        ['drones', 'audio/Battle-Cars.mp3', 1],
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
