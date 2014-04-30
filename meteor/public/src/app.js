(function() {
  var TestScene;

  cc.game.onStart = function() {
    cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);
    return cc.LoaderScene.preload([], function() {
      return cc.director.runScene(new TestScene());
    });
  };

  TestScene = cc.Scene.extend({
    onEnter: function() {
      this._super();
      return this.addChild(cc.LayerColor.create(cc.color(255, 255, 0, 255)));
    }
  });

}).call(this);
