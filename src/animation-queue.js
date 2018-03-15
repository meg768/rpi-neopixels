
var sprintf     = require('yow/sprintf');
var isObject    = require('yow/is').isObject;
var isFunction  = require('yow/is').isFunction;
var Events      = require('events');

function debug() {
}


module.exports = class AnimationQueue extends Events {

        constructor(options) {
            super();

            this.currentAnimation = undefined;
            this.animationQueue   = [];
            this.busy             = false;
            this.options         = Object.assign({}, options);

            if (this.options.debug) {
        		debug = function() {
        			console.log.apply(this, arguments);
        		}
        	}
        }



		dequeue() {
			return new Promise((resolve, reject) => {
				if (this.animationQueue.length > 0) {

					this.currentAnimation = this.animationQueue.splice(0, 1)[0];

					this.currentAnimation.run().then(() => {
						return this.dequeue();
					})
					.then(() => {
						this.currentAnimation = undefined;
						resolve();
					})
					.catch((error) => {
						this.currentAnimation = undefined;
						reject(error);
					});
				}
				else {
					resolve();
				}

			});
		}


		enqueue(animation) {

			var priority = animation.options.priority;

			if (priority == 'low' && this.busy)
				return;

			if (priority == '!') {
				this.animationQueue = [animation];

				if (this.currentAnimation != undefined) {
					this.currentAnimation.cancel();
				}
			}
			else if (priority == 'high') {
				this.animationQueue.unshift(animation);
			}
			else {
                // NY KOD BEGIN
                if (this.currentAnimation != undefined) {
                    if (this.currentAnimation.options.duration < 0)
                        this.currentAnimation.cancel();
				}
                // END


				this.animationQueue.push(animation);
			}

			if (!this.busy) {
				this.busy = true;

				this.dequeue().catch((error) => {
					console.log(error);
				})
				.then(() => {
					this.busy = false;

                    this.emit('idle');
					debug('Entering idle mode...');

				})

			}
		}

}
