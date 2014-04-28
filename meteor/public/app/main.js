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
    var downloadFile, xhr;
    downloadFile = function(serverUrl, filePath, fileHash) {
      var fileUrl, xhr;
      fileUrl = serverUrl + filePath;
      xhr = cc.loader.getXMLHttpRequest();
      xhr.open("GET", fileUrl);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          cc.log("ResourceSynchronizer success download file: " + fileUrl);
          xhr.writeToFile(cc.FileUtils.getInstance().getWritablePath() + filePath);
          cc.sys.localStorage.setItem(filePath, fileHash);
        } else {
          cc.log("ResourceSynchronizer faild download file: " + fileUrl);
        }
      };
      return xhr.send();
    };
    xhr = cc.loader.getXMLHttpRequest();
    xhr.open("GET", serverUrl + versionFile);
    xhr.onreadystatechange = function() {
      var fileHash, filePath;
      if (xhr.readyState === 4 && xhr.status === 200) {
        for (filePath in xhr.response) {
          fileHash = xhr.response[filePath];
          if (cc.sys.localStorage.getItem(filePath) !== fileHash) {
            downloadFile(serverUrl, filePath, fileHash);
          } else {
            cc.log(filePath + " at local is newest.");
          }
        }
      } else {
        cc.log("ResourceSynchronizer get resource version faild.");
        cc.log("See how to start server at: https://github.com/livingyang/ResourceSynchronizerServer");
      }
    };
    return xhr.send();
  };

  ResourceSynchronizer('http://localhost:3000/', 'busters.json', function() {
    return 'done';
  });

  cc.log("Resource dir: " + (cc.FileUtils.getInstance().getWritablePath()));

}).call(this);
