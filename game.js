var Game = function() {
    this.coq = new Coquette(this, "canvas", 800, 600, "#111");

    this.lensA = this.coq.entities.create(Lens, {center: {x: 300, y : 100}});
    this.lensB = this.coq.entities.create(Lens, {center: {x: 500, y : 100}});

    this.sunA = this.coq.entities.create(Light, {center : {x : 50, y : 30}, color : "rgba(255, 0, 0, 0.3)"});
    this.sunB = this.coq.entities.create(Light, {center : {x : 220, y : 220}, color : "rgba(0, 255, 0, 0.3)"});

};

window.addEventListener('load', function() {
    new Game();
});
