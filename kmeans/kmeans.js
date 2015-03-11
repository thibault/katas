(function(exports) {
    "use strict";

    var CANVAS_WIDTH = 800;

    var App = function(canvas) {
        this.canvas = canvas;
    };

    App.prototype.displayImage = function(img) {
        var ctx = this.canvas.getContext('2d');

        // Resize the canvas to the correct size
        var ratio = img.width / img.height;
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_WIDTH / ratio;

        ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_WIDTH / ratio);
    };

    var canvas = document.getElementById('canvas');
    var form = document.getElementById('image-form');
    var image_input = document.getElementById('image-input');
    var img = new Image();
    var app = new App(canvas);


    form.addEventListener('submit', function(evt) {
        evt.preventDefault();
        img.src = image_input.value;
    });

    img.addEventListener('load', function(evt) {
        app.displayImage(img);
    });

})(this);
