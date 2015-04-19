var Game = function() {
    this.coq = new Coquette(this, "canvas", 800, 600, "#111");

    this.scriptState = "titleScreen";
    this.oldScriptState = "";
    this.frame = 0;

    this.debugMode = false;

    this.update = function() {
        if (this.scriptState != this.oldScriptState) {
            if (Script[this.oldScriptState]) {
                if (Script[this.oldScriptState].teardown) {
                    Script[this.oldScriptState].teardown.call(this);
                }
            }
            if (Script[this.scriptState]) {
                if (Script[this.scriptState].setup) {
                    Script[this.scriptState].setup.call(this);
                }
            }
            this.oldScriptState = this.scriptState;
        }
        if (Script[this.scriptState]) {
            if (Script[this.scriptState].update) {
                Script[this.scriptState].update.call(this, this.frame);
            }
        }
        this.frame += 1;
    };

    this.draw = function(ctx) {
        if (Script[this.scriptState]) {
            if (Script[this.scriptState].draw) {
                Script[this.scriptState].draw.call(this, ctx);
            }
        }
    };
};

window.addEventListener('load', function() {
    new Game();
});
