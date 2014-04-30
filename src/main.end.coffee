cc.game.run()

ResourceSynchronizer = (serverUrl, versionFile, onComplete) ->
	downloadCount = 0
	checkDownloadCount = ->
		if downloadCount is 0
			onComplete?()
			onComplete = null

	downloadFile = (serverUrl, filePath, serverFileHash, localFileHash, cacheFileHash) ->
		downloadCount++

		if serverFileHash is cacheFileHash or (serverFileHash is localFileHash and cacheFileHash is '')
			cc.log filePath + " at local is newest."
			downloadCount--
			return

		cc.log arguments

		fileUrl = serverUrl + filePath
		xhr = cc.loader.getXMLHttpRequest()
		xhr.open "GET", fileUrl
		xhr.onreadystatechange = ->
			if xhr.readyState is 4 and xhr.status is 200
				cc.log "ResourceSynchronizer success download file: " + fileUrl
				xhr.writeToFile cc.FileUtils.getInstance().getWritablePath() + filePath
				cc.sys.localStorage.setItem filePath, serverFileHash
			else
				cc.log "ResourceSynchronizer faild download file: " + fileUrl

			downloadCount--
			checkDownloadCount()

		xhr.send()

	xhr = cc.loader.getXMLHttpRequest()
	xhr.open "GET", serverUrl + versionFile
	xhr.onreadystatechange = ->
		localBusters = (JSON.parse cc.FileUtils.getInstance().getStringFromFile 'project.json').busters
		if xhr.readyState is 4 and xhr.status is 200 and typeof xhr.response is 'object'
			for filePath of xhr.response
				downloadFile serverUrl, filePath, xhr.response[filePath], localBusters[filePath], cc.sys.localStorage.getItem(filePath)
			checkDownloadCount()
		else
			cc.log "ResourceSynchronizer get resource version faild."
			cc.log "See how to start server at: https://github.com/livingyang/meteor-cocos2d-js"
		return

	xhr.send()

ResourceSynchronizer 'http://localhost:3000/', 'busters.json', -> cc.log "resourece synchronize done, see dir: #{cc.FileUtils.getInstance().getWritablePath()}"
