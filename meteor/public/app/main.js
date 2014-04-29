(function() {
  cc.game.prepare();

}).call(this);

(function() {
  var TestScene;

  TestScene = cc.Scene.extend({
    onEnter: function() {
      this._super();
      return this.addChild(cc.LayerColor.create(cc.color(255, 255, 0, 255)));
    }
  });

  cc.game.onStart = function() {
    cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);
    return cc.LoaderScene.preload({}, function() {
      return cc.director.runScene(new TestScene());
    });
  };

}).call(this);

(function() {
  var ResourceSynchronizer;

  cc.game.run();

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
      cc.log(arguments);
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
      if (xhr.readyState === 4 && xhr.status === 200) {
        for (filePath in xhr.response) {
          downloadFile(serverUrl, filePath, xhr.response[filePath], localBusters[filePath], cc.sys.localStorage.getItem(filePath));
        }
        checkDownloadCount();
      } else {
        cc.log("ResourceSynchronizer get resource version faild.");
        cc.log("See how to start server at: https://github.com/livingyang/ResourceSynchronizerServer");
      }
    };
    return xhr.send();
  };

  ResourceSynchronizer('http://localhost:3000/', 'busters.json', function() {
    return cc.log("resourece synchronize done, see dir: " + (cc.FileUtils.getInstance().getWritablePath()));
  });

}).call(this);
