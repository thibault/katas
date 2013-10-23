var cellautomaton = (function() {
    "use strict";

    var CONCENTRATION = 5;

    var mod = function mod(n, m) {
        return ((n % m) + m) % m;
    }

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

    CellularAutomaton.prototype.indexAt = function(x, y) {
        return this.width * y + x;
    }

    /**
     * Initialize the grid with random values
     */
    CellularAutomaton.prototype.init = function() {
        var random_val;
        for (var x = 0 ; x < this.width ; x++) {
            for (var y = 0 ; y < this.height ; y++) {
                random_val = Math.floor(Math.random() * CONCENTRATION);
                this.setValueAt(x, y, random_val == 1 ? 1 : 0);
            }
        }

        this.setValueAt(this.width / 2, this.height / 2, 2);
    }

    CellularAutomaton.prototype.isEmptyCell = function(x, y) {
        return this.valueAt(x, y) == 0;
    }

    CellularAutomaton.prototype.isMovingCell = function(x, y) {
        return this.valueAt(x, y) == 1;
    }

    CellularAutomaton.prototype.isStaticCell = function(x, y) {
        return this.valueAt(x, y) == 2;
    }

    CellularAutomaton.prototype.hasStaticNeighbor = function(x, y) {
        var real_i, real_j;

        for (var i = x - 1 ; i <= x + 1 ; i++) {
            for (var j = y - 1 ; j <= y + 1 ; j++) {
                real_i = mod(i, this.width);
                real_j = mod(j, this.height);
                if (this.isStaticCell(real_i, real_j)) return true;
            }
        }
        return false;
    }

    /**
     * Apply the rule to move to the automaton's next step
     */
    CellularAutomaton.prototype.nextStep = function() {
        var nextStep = this.cells.slice();

        for (var x = 0 ; x < this.width ; x++) {
            for (var y = 0 ; y < this.height ; y++) {
                if (this.isMovingCell(x, y)) {
                    if (this.hasStaticNeighbor(x, y)) {
                        nextStep[this.indexAt(x, y)] = 2;
                    } else {
                        var x_delta = Math.floor(Math.random() * 3) - 1;
                        var new_x = mod(x + x_delta, this.width);
                        var y_delta = Math.floor(Math.random() * 3) - 1;
                        var new_y = mod(y + y_delta, this.height);
                        if (nextStep[this.indexAt(new_x, new_y)] == 0) {
                            nextStep[this.indexAt(new_x, new_y)] = 1;
                            nextStep[this.indexAt(x, y)] = 0;
                        }
                    }
                }
            }
        }
        this.cells = nextStep;
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
