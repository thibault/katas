var app = (function(cellautomaton) {
    "use strict";

    var App = function(grid_width, grid_height, canvas, cell_width) {
        this.grid_width = grid_width;
        this.grid_height = grid_height;
        this.cell_width = cell_width;
        this.canvas = canvas;
        this.canvas.width = grid_width * cell_width;
        this.canvas.height = grid_height * cell_width;
        this.automaton = new cellautomaton.CellularAutomaton(grid_width, grid_height);
        this.automaton_interval = 0;
    }

    /**
     * Clear the canvas
     */
    App.prototype.clear = function() {
        var ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Start the automaton
     *
     * We will also clear any previously running automaton
     */
    App.prototype.run = function() {
        clearInterval(this.automaton_interval);
        this.clear();
        this.automaton.init();

        this.automaton_interval = setInterval(function(app) {
            app.automaton.drawOn(app.canvas, app.cell_width);
            app.automaton.nextStep();
            if (app.automaton.isFinished()) {
                app.automaton.init();
            }
        }, 50, this);
    }

    return {
        App: App
    }

})(cellautomaton);
