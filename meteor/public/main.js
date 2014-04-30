(function() {
  var ResourceSynchronizer;

  ResourceSynchronizer = function(serverUrl, versionFile, onComplete) {
    var checkDownloadCount, downloadCount, downloadFile, xhr;
    downloadCount = 0;
    checkDownloadCount = function() {
      if (downloadCount === 0) {
        if (typeof onComplete === "function") {
          onComplete();
        }
        return onComplete = null;
      }
    };
    downloadFile = function(serverUrl, filePath, serverFileHash, localFileHash, cacheFileHash) {
      var fileUrl, xhr;
      downloadCount++;
      if (serverFileHash === cacheFileHash || (serverFileHash === localFileHash && cacheFileHash === '')) {
        cc.log(filePath + " at local is newest.");
        downloadCount--;
        return;
      }
      fileUrl = serverUrl + filePath;
      xhr = cc.loader.getXMLHttpRequest();
      xhr.open("GET", fileUrl);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          cc.log("ResourceSynchronizer success download file: " + fileUrl);
          xhr.writeToFile(cc.FileUtils.getInstance().getWritablePath() + filePath);
          cc.sys.localStorage.setItem(filePath, serverFileHash);
        } else {
          cc.log("ResourceSynchronizer faild download file: " + fileUrl);
        }
        downloadCount--;
        return checkDownloadCount();
      };
      return xhr.send();
    };
    xhr = cc.loader.getXMLHttpRequest();
    xhr.open("GET", serverUrl + versionFile);
    xhr.onreadystatechange = function() {
      var filePath, localBusters;
      localBusters = (JSON.parse(cc.FileUtils.getInstance().getStringFromFile('project.json'))).busters;
      if (xhr.readyState === 4 && xhr.status === 200 && typeof xhr.response === 'object') {
        for (filePath in xhr.response.busters) {
          downloadFile(serverUrl, filePath, xhr.response.busters[filePath], localBusters[filePath], cc.sys.localStorage.getItem(filePath));
        }
        checkDownloadCount();
      } else {
        cc.log("ResourceSynchronizer get resource version faild.");
        cc.log("See how to start server at: https://github.com/livingyang/meteor-cocos2d-js");
      }
    };
    return xhr.send();
  };

  if (cc.sys.isNative) {
    ResourceSynchronizer('http://localhost:3000/', 'project.json', function() {
      cc.log("resourece synchronize done, see dir: " + (cc.FileUtils.getInstance().getWritablePath()));
      return cc.game.run();
    });
  } else {
    cc.game.run();
  }

}).call(this);
