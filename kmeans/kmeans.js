(function(exports) {
    "use strict";

    var CANVAS_WIDTH = 500;

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

        this.extractColors();
        this.pixels = new Array(this.canvas.width);
    };

    /**
     * Extract all hues for the image.
     */
    App.prototype.extractColors = function() {
        var data;
        var r, g, b;
        var hsl;

        this.hues = new Array(this.canvas.width * this.canvas.height);
        this.saturations = new Array(this.canvas.width * this.canvas.height);
        this.luminosities = new Array(this.canvas.width * this.canvas.height);

        data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
        for (var x = 0 ; x < this.canvas.width ; x++) {
            for (var y = 0 ; y < this.canvas.height ; y++) {
                var index = (y * this.canvas.width + x) * 4;
                r = data[index];
                g = data[index + 1];
                b = data[index + 2];
                hsl = Utils.rgbToHsl(r, g, b);
                this.hues[x * this.canvas.width + y] = hsl.h * 360;
                this.saturations[x * this.canvas.width + y] = hsl.s * 100;
                this.luminosities[x * this.canvas.width + y] = hsl.l * 100;
            }
        }
    };

    /**
     * Separate the image into k clusters using n iterations
     */
    App.prototype.clusterize = function(k, n) {

        // Initialize random means
        this.means = (Array.apply(null, new Array(k))).map(function() {
            var random_x = Math.floor(Math.random() * this.canvas.width);
            var random_y = Math.floor(Math.random() * this.canvas.height);
            var hue = this.hues[random_x * this.canvas.width + random_y];
            var saturation = this.saturations[random_x * this.canvas.width + random_y];
            var luminosity = this.luminosities[random_x * this.canvas.width + random_y];
            return {
                x: random_x,
                y: random_y,
                hue: hue,
                saturation: saturation,
                luminosity: luminosity,
                nb_pixels: 0,
                total_x: 0,
                total_y: 0,
                total_hue: 0,
                total_saturation: 0,
                total_luminosity: 0
            };
        }, this);

        this.iterationCounter = n;
        var that = this;
        this.intervalId = setInterval(function() {
            that.iterate();
        }, 1000);
    };

    App.prototype.iterate = function() {
        this.affectPixelsToClusters();
        this.drawClusters();
        this.updateMeans();

        this.iterationCounter--;
        if (this.iterationCounter <= 0) {
            clearInterval(this.intervalId);
        }
    };

    /**
     * Draw the k means on the canvas
     */
    App.prototype.drawMeans = function() {
        this.means.map(function(mean) {
            this.ctx.fillStyle = 'hsl(' + mean.hue + ', 100%, 50%)';
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

                this.means[mean].nb_pixels++;
                this.means[mean].total_x += x;
                this.means[mean].total_y += y;
                this.means[mean].total_hue += this.hues[x * this.canvas.width + y];
                this.means[mean].total_saturation += this.saturations[x * this.canvas.width + y];
                this.means[mean].total_luminosity += this.luminosities[x * this.canvas.width + y];

            }
        }
    };

    App.prototype.drawClusters = function() {
        var mean;
        for (var x = 0 ; x < this.canvas.width ; x++) {
            for (var y = 0 ; y < this.canvas.height ; y++) {
                mean = this.means[this.pixels[x][y]];
                this.ctx.fillStyle = 'hsl(' + mean.hue + ',' + mean.saturation + '%,' + mean.luminosity + '%)';
                this.ctx.fillRect(x, y, 1, 1);
            }
        }
    };

    /**
     * get the closest mean for the given coordinates
     */
    App.prototype.getClosestMean = function(x, y) {
        var closest_mean = -1;
        var closest_distance = Infinity;
        var hue = this.hues[x * this.canvas.width + y];
        var saturation = this.saturations[x * this.canvas.width + y];
        var luminosity = this.luminosities[x * this.canvas.width + y];

        for (var i = 0 ; i < this.means.length ; i++) {
            var mean = this.means[i];

            var delta_x = mean.x - x;
            var delta_y = mean.y - y;
            var delta_hue = mean.hue - hue;
            var delta_saturation = mean.saturation - saturation;
            var delta_luminosity = mean.luminosity - luminosity;
            var distance = [
                //2 * Math.pow(delta_x, 2),
                //2 * Math.pow(delta_y, 2),
                2 * Math.pow(delta_hue, 2),
                Math.pow(delta_saturation, 2),
                Math.pow(delta_luminosity, 2)
            ].reduce(function(a, b) {
                return a + b;
            });

            if (distance < closest_distance) {
                closest_mean = i;
                closest_distance = distance;
            }
        }
        return closest_mean;
    };

    App.prototype.updateMeans = function() {
        this.means = this.means.map(function(mean) {
            mean.x = mean.total_x / mean.nb_pixels;
            mean.y = mean.total_y / mean.nb_pixels;
            mean.hue = mean.total_hue / mean.nb_pixels;
            mean.saturation = mean.total_saturation / mean.nb_pixels;
            mean.luminosity = mean.total_luminosity / mean.nb_pixels;
            mean.nb_pixels = 0;
            mean.total_x = 0;
            mean.total_y = 0;
            mean.total_hue = 0;
            mean.total_saturation = 0;
            mean.total_luminosity = 0;
            return mean;
        }, this);
    };


    var canvas = document.getElementById('canvas');
    var form = document.getElementById('image-form');
    var next_btn = document.getElementById('next-button');
    var image_input = document.getElementById('image-input');
    var k_input = document.getElementById('k');
    var n_input = document.getElementById('n');
    var img = new Image();
    img.crossOrigin = '';
    var app = new App(canvas);

    form.addEventListener('submit', function(evt) {
        evt.preventDefault();
        img.src = image_input.value;
    });

    img.addEventListener('load', function(evt) {
        app.displayImage(img);
        app.clusterize(+k.value, +n.value);
    });


})(this);
