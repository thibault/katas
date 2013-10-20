var WIDTH = 640,
    HEIGHT = 480;

var app = (function(cellautomaton) {
    "use strict";

    var App = function(canvas, nb_cells, nb_rows) {
        this.canvas = canvas;
        this.canvas.width = nb_cells * 5;
        this.canvas.height = nb_rows * 5;
        this.nb_cells = nb_cells;
        this.nb_rows = nb_rows;
        this.automaton = new cellautomaton.CellularAutomaton(nb_cells);
        this.automaton_interval = 0;
    }

    /**
     * Set the cellular automaton evolving rule from it's wolfram code.
     */
    App.prototype.setWolframCode = function(rule_number) {
        var binary = rule_number.toString(2);
        var pad = "00000000";
        var mask = pad.substring(0, pad.length - binary.length) + binary;
        var rule = {
            '000': mask[7],
            '001': mask[6],
            '010': mask[5],
            '011': mask[4],
            '100': mask[3],
            '101': mask[2],
            '110': mask[1],
            '111': mask[0]
        }
        this.automaton.setRule(rule);
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
    App.prototype.run = function(rule, random_mode) {
        this.clear();
        this.setWolframCode(rule);

        if (random_mode) {
            this.automaton.initRandom();
        } else {
            this.automaton.initSingleCell(parseInt(this.nb_cells / 2));
        }

        var step = 0;
        clearInterval(this.automaton_interval);
        this.automaton_interval = setInterval(function(automaton) {
            automaton.drawOn(canvas, step /*% this.nb_rows*/);
            automaton.nextStep();
            step++;
        }, 50, this.automaton);
    }

    return {
        App: App
    }

})(cellautomaton);


var canvas = document.getElementById('main_canvas');
var nb_cells = parseInt(WIDTH / 5);
var nb_rows = parseInt(HEIGHT / 5);
var main_app = new app.App(canvas, nb_cells, nb_rows);

var submitHandler = function(evt) {
    evt.preventDefault();
    var input = document.getElementById('rule_number');

    var mode_random_input = document.getElementById('mode_random');
    var mode_random = mode_random_input.checked;

    var rule = parseInt(input.value);

    main_app.run(rule, mode_random);
}
document.addEventListener('submit', submitHandler);
