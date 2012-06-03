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

    getIndex: function(spriteName) {
      var i;
      for (i = 0; i < this._sprites.length; i++) {
        if (this._sprites[i].name == spriteName) {
          return i;
        }
      }
    },

    getOffset: function(index) {
      //Go through all sprites to find the required one
      var sprite = this._sprites[index];

      //To get the offset, multiply by sprite width
      //Sprite-specific x and y offset is then added into it.
      return {
        x: (index * this._width) + (sprite.x||0),
        y: (sprite.y||0),
        width: this._width,
        height: this._height
      };

      return null;
    }
  };

  var Animation = function(data, sprites, offset) {
    this.load(data, sprites, offset);
    this._sprites = sprites;
  };

  Animation.prototype = {
    _frames: [],
    _frameIndex: null,
    _frameDuration: 0,
    _playing: true,

    load: function(data, sprites, offset) {
      var i;
      offset = offset || 0;
      this._frames = data;
      for (i = 0; i < this._frames.length; i++) {
        this._frames[i].index = sprites.getIndex(this._frames[i].sprite);
      } 

      this.goTo(offset);
    },

    goTo: function(frame) {
      this._frameIndex = frame;
      this._frameDuration = this._frames[frame].time;
    },

    toggle: function () {
      this._playing = !this._playing;
    },

    play: function () {
      this._playing = true;
    },

    pause: function () {
      this._playing = false;
    },

    stop: function () {
      this._playing = false;
      this.goTo(0);
    },

    animate: function(deltaTime) {
      if (!this._playing)
        return;

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
      return this._sprites.getOffset(this._frames[this._frameIndex].index);
    }
  }

  return {
    Animation: Animation,
    SpriteSheet: SpriteSheet,
    FrameTimer: FrameTimer
  };

})();
