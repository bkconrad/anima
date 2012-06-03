var animation = (function () {
var FrameTimer = function() {
    this._lastTick = (new Date()).getTime();
};
 
FrameTimer.prototype = {
    getSeconds: function() {
        var seconds = this._frameSpacing / 1000;
        if(isNaN(seconds)) {
            return 0;
        }
 
        return seconds;
    },
 
    tick: function() {
        var currentTick = (new Date()).getTime();
        this._frameSpacing = currentTick - this._lastTick;
        this._lastTick = currentTick;
    }
};

var SpriteSheet = function(data) {
    this.load(data);
};
 
SpriteSheet.prototype = {
    _sprites: [],
    _width: 0,
    _height: 0,
 
    load: function(data) {
        this._height = data.height;
        this._width = data.width;
        this._sprites = data.sprites;
    },
 
    getOffset: function(spriteName) {
        //Go through all sprites to find the required one
        for(var i = 0, len = this._sprites.length; i < len; i++) {
            var sprite = this._sprites[i];
 
            if(sprite.name == spriteName) {
                //To get the offset, multiply by sprite width
                //Sprite-specific x and y offset is then added into it.
                return {
                    x: (i * this._width) + (sprite.x||0),
                    y: (sprite.y||0),
                    width: this._width,
                    height: this._height
                };
            }
        }
 
        return null;
    }
};

var Animation = function(data, sprites) {
    this.load(data);
    this._sprites = sprites;
};
 
Animation.prototype = {
    _frames: [],
    _frame: null,
    _frameDuration: 0,
 
    load: function(data) {
        this._frames = data;
 
        //Initialize the first frame
        this._frameIndex = 0;
        this._frameDuration = data[0].time;
    },
 
    animate: function(deltaTime) {
        //Reduce time passed from the duration to show a frame        
        this._frameDuration -= deltaTime;
 
        //When the display duration has passed
        if(this._frameDuration <= 0) {
            //Change to next frame, or the first if ran out of frames
            this._frameIndex++;
            if(this._frameIndex == this._frames.length) {
                this._frameIndex = 0;
            }
 
            //Change duration to duration of new frame
            this._frameDuration = this._frames[this._frameIndex].time;
        }
    },
 
    getSprite: function() {
        //Return the sprite for the current frame
        return this._sprites.getOffset(this._frames[this._frameIndex].sprite);
    }
}

window.onload = function() {
            var timer = new FrameTimer();
            timer.tick();
 
            var sprites = new SpriteSheet({
                width: 32,
                height: 32,
                sprites: [
                    { name: 'stand' },
                    { name: 'walk_1', x: 0, y: 1 },
                    { name: 'walk_2', x: 0, y: 1 },
                ]
            });
            var ctx = document.getElementById('canvas').getContext('2d');
            var walk = new Animation([
                    { sprite: 'walk_1', time: 0.2 },
                    { sprite: 'stand', time: 0.2 },
                    { sprite: 'walk_2', time: 0.2 },
                    { sprite: 'stand', time: 0.2 }
            ], sprites);
            var kunioImage = new Image();
 
            kunioImage.onload = function() {
                setInterval(function(){
                    walk.animate(timer.getSeconds());
                    var frame = walk.getSprite();
                    ctx.clearRect(0, 0, 300, 300);
                    ctx.drawImage(kunioImage, frame.x, frame.y, 32, 32, 0, 0, 32, 32);
                    timer.tick();
                }, 5);
            };
 
            kunioImage.src = 'animation.gif';
        };

})();
