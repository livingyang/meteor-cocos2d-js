cc.game.onStart = ->
	cc.view.setDesignResolutionSize 800, 450, cc.ResolutionPolicy.SHOW_ALL
	cc.view.resizeWithBrowserSize true

	cc.LoaderScene.preload [], ->
		cc.director.runScene new TestScene()

TestScene = cc.Scene.extend
	onEnter: ->
		@_super()
		@addChild cc.LayerColor.create cc.color 255, 255, 0, 255
