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
            1: "blue",
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
    }

    CellularAutomaton.prototype.nbNeighbors = function(x, y) {
        var real_i, real_j;
        var nbNeighbors = 0;

        for (var i = x - 1 ; i <= x + 1 ; i++) {
            for (var j = y - 1 ; j <= y + 1 ; j++) {
                if (i == x && j == y) continue;
                real_i = mod(i, this.width);
                real_j = mod(j, this.height);
                if (this.valueAt(real_i, real_j) == 1) nbNeighbors++;
            }
        }
        return nbNeighbors;
    }

    /**
     * Apply the rule to move to the automaton's next step
     */
    CellularAutomaton.prototype.nextStep = function() {
        var nextStep = this.cells.slice();
        var nbNeighbors, currentValue;

        for (var x = 0 ; x < this.width ; x++) {
            for (var y = 0 ; y < this.height ; y++) {
                currentValue = this.valueAt(x, y);
                nbNeighbors = this.nbNeighbors(x, y);

                if (nbNeighbors == 3) {
                    nextStep[this.indexAt(x, y)] = 1;
                } else if (nbNeighbors == 2) {
                    nextStep[this.indexAt(x, y)] = currentValue;
                } else {
                    nextStep[this.indexAt(x, y)] = 0;
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

    CellularAutomaton.prototype.isFinished = function() {
        return false;
    }

    return {
        CellularAutomaton: CellularAutomaton
    }
})();
