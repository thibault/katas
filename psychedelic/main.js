var app = (function() {
    "use strict";

    var Drawing = function(canvas, width, height) {
        this.canvas = canvas;
        this.width = width;
        this.height = height;
    }

    /**
     * Clear the canvas
     */
    Drawing.prototype.clear = function() {
        var ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    Drawing.prototype.render = function() {


    }

    return {
        Drawing: Drawing
    }

})();
