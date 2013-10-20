var cellautomaton = (function() {
    "use strict";

    var CONCENTRATION = 0.25;

    var CellularAutomaton = function(width, height) {
        this.width = width;
        this.height = height;
        this.cells = new Array(width * height);
        this.colors = {
            0: "white",
            1: "rgb(200, 200, 200)",
            2: "red",
        }
    }

    CellularAutomaton.prototype.valueAt = function(x, y) {
        return this.cells[this.width * y + x];
    }

    CellularAutomaton.prototype.setValueAt = function(x, y, value) {
        this.cells[this.width * y + x] = value;
    }

    /**
     * Initialize the grid with random values
     */
    CellularAutomaton.prototype.init = function() {
        var random_val;
        for (var x = 0 ; x < this.width ; x++) {
            for (var y = 0 ; y < this.height ; y++) {
                random_val = Math.floor(Math.random() * 4);
                this.setValueAt(x, y, random_val == 1 ? 1 : 0);
            }
        }

        this.setValueAt(this.width / 2, this.height / 2, 2);
    }

    /**
     * Apply the rule to move to the automaton's next step
     */
    CellularAutomaton.prototype.nextStep = function() {
        // The slice() method without argument clones the array
        var nextStep = this.cells.slice();
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
    CellularAutomaton.prototype.drawOn = function(canvas, cell_size) {
        var ctx = canvas.getContext('2d');
        for (var x = 0 ; x < this.width ; x++) {
            for (var y = 0 ; y < this.height ; y++) {
                ctx.fillStyle = this.colors[this.valueAt(x, y)];
                ctx.fillRect(x * cell_size, y * cell_size, cell_size, cell_size);
            }
        }
    }

    return {
        CellularAutomaton: CellularAutomaton
    }
})();
