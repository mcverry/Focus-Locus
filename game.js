var Game = function() {
    this.coq = new Coquette(this, "canvas", 800, 600, "#111");

    this.coq.entities.create(LightSource, {coq : this.coq});

    this.coq.entities.create(Lens, {coq: this.coq});

};

window.addEventListener('load', function() {
    new Game();
});
