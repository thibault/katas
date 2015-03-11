(function(exports) {
    "use strict";

    var CANVAS_WIDTH = 800;

    var App = function(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    };

    /**
     * Display the image into the canvas
     */
    App.prototype.displayImage = function(img) {
        // Resize the canvas to the correct size
        var ratio = img.width / img.height;
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_WIDTH / ratio;

        this.ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_WIDTH / ratio);
    };

    /**
     * Separate the image into k clusters using n iterations
     */
    App.prototype.clusterize = function(k, n) {
        var r, g, b;
        var hsl, hue;

        // Initialize random means
        this.means = (Array.apply(null, new Array(k))).map(function() {
            var random_x = Math.floor(Math.random() * this.canvas.width);
            var random_y = Math.floor(Math.random() * this.canvas.height);

            var pixel_data = this.ctx.getImageData(random_x, random_y, 1, 1).data;
            r = pixel_data[0];
            g = pixel_data[1];
            b = pixel_data[2];
            hsl = Utils.rgbToHsl(r, g, b);
            hue = hsl.h * 360;

            return {x: random_x, y: random_y, color: hue};
        }, this);

        this.pixels = new Array(this.canvas.width);

        this.iterate();
    };

    App.prototype.iterate = function() {
        this.drawMeans();
        this.affectPixelsToClusters();
    };

    /**
     * Draw the k means on the canvas
     */
    App.prototype.drawMeans = function() {
        this.means.map(function(mean) {
            this.ctx.fillStyle = 'hsl(' + mean.color + ', 100%, 50%)';
            this.ctx.beginPath();
            this.ctx.arc(mean.x, mean.y, 5, 0, 360);
            this.ctx.fill();
        }, this);
    };

    /**
     * Sort all pixels into the different clusters
     */
    App.prototype.affectPixelsToClusters = function() {
        var mean;

        for (var x = 0 ; x < this.canvas.width ; x++) {
            if (this.pixels[x] === undefined) {
                this.pixels[x] = new Array(this.canvas.height);
            }

            for (var y = 0 ; y < this.canvas.height ; y++) {
                mean = this.getClosestMean(x, y);
                this.pixels[x][y] = mean;
                this.ctx.fillStyle = 'hsl(' + this.means[mean].color + ', 100%, 50%)';
                this.ctx.fillRect(x, y, 1, 1);
            }
        }
    };

    /**
     * get the closest mean for the given coordinates
     */
    App.prototype.getClosestMean = function(x, y) {
        var closest_mean = -1;
        var closest_distance = this.canvas.width * this.canvas.height;

        for (var i = 0 ; i < this.means.length ; i++) {
            var delta_x = this.means[i].x - x;
            var delta_y = this.means[i].y - y;
            var distance = Math.sqrt(Math.pow(delta_x, 2) + Math.pow(delta_y, 2));

            if (distance < closest_distance) {
                closest_mean = i;
                closest_distance = distance;
            }
        }
        return closest_mean;
    }


    var canvas = document.getElementById('canvas');
    var form = document.getElementById('image-form');
    var image_input = document.getElementById('image-input');
    var img = new Image();
    var app = new App(canvas);

    form.addEventListener('submit', function(evt) {
        evt.preventDefault();
        img.crossOrigin = '';
        img.src = image_input.value;
    });

    img.addEventListener('load', function(evt) {
        app.displayImage(img);
        app.clusterize(5, 10);
    });

})(this);
