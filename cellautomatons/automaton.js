var cellautomaton = (function() {
    "use strict";

    var CellularAutomaton = function(width) {
        this.width = width;
        this.cells = new Array(width);
        this.colors = {
            0: "white",
            1: "blue"
        }
    }

    CellularAutomaton.prototype.setRule = function(rule) {
        this.rule = rule;
    }

    /**
     * Initialize the grid with random values
     */
    CellularAutomaton.prototype.initRandom = function() {
        for (var i = 0 ; i < this.width ; i++) {
            this.cells[i] = Math.floor(Math.random() * 2);
        }
    }

    /**
     * Initialize the grid with a single cell in the middle of the row
     */
    CellularAutomaton.prototype.initSingleCell = function(cell_index) {
        for (var i = 0 ; i < this.width ; i++) {
            this.cells[i] = i == cell_index ? 1 : 0;
        }
    }

    /**
     * Apply the rule to move to the automaton's next step
     */
    CellularAutomaton.prototype.nextStep = function() {
        // The slice() method without argument clones the array
        var nextStep = this.cells.slice();
        for (var i = 0 ; i < this.width ; i++) {
            nextStep[i] = this.getNextStepValue(i);
        }

        this.cells = nextStep;
    }

    /**
     * Get the next step value for given cell index
     */
    CellularAutomaton.prototype.getNextStepValue = function(index) {
        var left_index = index - 1;
        if (left_index < 0) {
            left_index = this.width - 1;
        }

        var right_index = index + 1;
        if (right_index >= this.width) {
            right_index = 0;
        }

        var key = [
            this.cells[left_index],
            this.cells[index],
            this.cells[right_index]
        ].join('');
        return this.rule[key];
    }

    /**
     * Use the canvas API to render the grid
     */
    CellularAutomaton.prototype.drawOn = function(canvas, y) {
        var ctx = canvas.getContext('2d');
        for (var i = 0 ; i < this.width ; i++) {
            ctx.fillStyle = this.colors[this.cells[i]];
            ctx.fillRect(i * 5, y * 5, 5, 5);
        }
    }

    return {
        CellularAutomaton: CellularAutomaton
    }
})();
