(function(){cc.game.prepare()}).call(this);
(function(){var e;e=cc.Scene.extend({onEnter:function(){return this._super(),this.addChild(cc.LayerColor.create(cc.color(255,255,0,255)))}}),cc.game.onStart=function(){return cc.view.setDesignResolutionSize(800,450,cc.ResolutionPolicy.SHOW_ALL),cc.view.resizeWithBrowserSize(!0),cc.LoaderScene.preload({},function(){return cc.director.runScene(new e)})}}).call(this);
(function(){cc.game.run()}).call(this);