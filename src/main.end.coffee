cc.game.run()

ResourceSynchronizer = (serverUrl, versionFile, onComplete) ->
	downloadFile = (serverUrl, filePath, fileHash) ->
		fileUrl = serverUrl + filePath
		xhr = cc.loader.getXMLHttpRequest()
		xhr.open "GET", fileUrl
		xhr.onreadystatechange = ->
			if xhr.readyState is 4 and xhr.status is 200
				cc.log "ResourceSynchronizer success download file: " + fileUrl
				xhr.writeToFile cc.FileUtils.getInstance().getWritablePath() + filePath
				cc.sys.localStorage.setItem filePath, fileHash
			else
				cc.log "ResourceSynchronizer faild download file: " + fileUrl
			return

		xhr.send()

	xhr = cc.loader.getXMLHttpRequest()
	xhr.open "GET", serverUrl + versionFile
	xhr.onreadystatechange = ->
		if xhr.readyState is 4 and xhr.status is 200
			for filePath of xhr.response
				fileHash = xhr.response[filePath]
				if cc.sys.localStorage.getItem(filePath) isnt fileHash
					downloadFile serverUrl, filePath, fileHash
				else
					cc.log filePath + " at local is newest."
		else
			cc.log "ResourceSynchronizer get resource version faild."
			cc.log "See how to start server at: https://github.com/livingyang/ResourceSynchronizerServer"
		return

	xhr.send()

ResourceSynchronizer 'http://localhost:3000/', 'busters.json', -> 'done'
cc.log "Resource dir: #{cc.FileUtils.getInstance().getWritablePath()}"
