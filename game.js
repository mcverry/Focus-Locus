var Game = function() {
    this.coq = new Coquette(this, "canvas", 800, 600, "#111");

    this.lensA = this.coq.entities.create(Lens, {center: {x: 300, y : 100}});
    this.lensB = this.coq.entities.create(Lens, {center: {x: 500, y : 100}});

    this.sun = this.coq.entities.create(Light, {center : { x : 50, y : 30}});

};

window.addEventListener('load', function() {
    new Game();
});
