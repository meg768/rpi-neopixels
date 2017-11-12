var Events  = require('events');
var isArray = require('yow/is').isArray;
var sprintf = require('yow/sprintf');
var Timer   = require('yow/timer');


function debug() {
    console.log.apply(this, arguments);
}



module.exports = class Animation extends Events {



    constructor(pixels, options) {
        super();

        this.options         = Object.assign({}, {priority:'normal'}, options);
        this.pixels          = pixels;
        this.name            = 'None';
        this.cancelled       = false;
        this.renderFrequency = 0;
        this.renderTime      = 0;

    }


    render() {
    }

    start() {
        debug('Starting animation', this.name);

        return new Promise((resolve, reject) => {

            this.cancelled  = false;
            this.renderTime = 0;

            debug('Animation', this.name, 'started.');
            resolve();

            this.emit('started');

        });

    }

    stop() {
        debug('Stopping animation', this.name);

        return new Promise((resolve, reject) => {


            debug('Animation', this.name, 'stopped.');
            resolve();

            this.emit('stopped');
        });
    }

    loop() {
        var self = this;

        debug('Running loop', self.name);

        return new Promise((resolve, reject) => {

            var start = new Date();

            function loop() {

                var now = new Date();

                if (self.cancelled) {
                    resolve();
                }
                else if (self.options.duration == undefined) {

                    // If no duration specified, render only once and stop
                    self.render();

                    resolve();
                }
                else if (self.options.duration >= 0 && now - start > self.options.duration) {
                    resolve();
                }
                else {
                    var now = new Date();

                    if (self.renderFrequency == 0 || now - self.renderTime >= self.renderFrequency) {
                        self.render();
                        self.renderTime = now;
                    }

                    setImmediate(loop);
                }
            }

            loop();
        });
    }



    cancel() {
        debug('Cancelling animation', this.name);
        this.cancelled = true;
    }

    run() {

        return new Promise((resolve, reject) => {


            this.start().then(() => {
                return this.loop();
            })
            .then(() => {
                return this.stop();
            })
            .catch((error) => {
                console.log(error);
            })
            .then(() => {
                resolve();
            });

        });

    }
}
