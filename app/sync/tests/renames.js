describe("update", function() {
  var sync = require("../index");
  var fs = require("fs-extra");
  var async = require("async");

  it("detects a renamed file across multiple syncs", function(done) {
    var path = this.fake.path(".txt");
    var newPath = this.fake.path(".txt");
    var content = this.fake.file();

    var ctx = this;

    ctx.writeAndSync(path, content, function(err) {
      if (err) return done.fail(err);
      ctx.writeAndSync(newPath, content, function(err) {
        if (err) return done.fail(err);
        ctx.removeAndSync(path, function(err) {
          if (err) return done.fail(err);
          ctx.checkRename(path, newPath, done);
        });
      });
    });
  });

  it("detects a renamed file", function(testDone) {
    var path = this.fake.path(".txt");
    var newPath = this.fake.path(".txt");
    var content = this.fake.file();
    var checkRename = this.checkRename;

    sync(this.blog.id, function(err, folder, done) {
      if (err) return testDone.fail(err);

      fs.outputFileSync(folder.path + path, content, "utf-8");

      folder.update(path, function(err) {
        if (err) return testDone.fail(err);

        fs.moveSync(folder.path + path, folder.path + newPath);

        async.series(
          [folder.update.bind(this, path), folder.update.bind(this, newPath)],
          function(err) {
            if (err) return testDone.fail(err);

            done(null, function(err) {
              if (err) return testDone.fail(err);
              checkRename(path, newPath, testDone);
            });
          }
        );
      });
    });
  });

  // Set up a test blog before each test
  global.test.blog();

  // Expose methods for creating fake files, paths, etc.
  beforeEach(function() {
    this.fake = global.test.fake;
  });

  // helper functions
  beforeEach(function() {
    var blog = this.blog;
    var checkEntry = global.test.CheckEntry(blog.id);
    this.checkEntry = checkEntry;

    this.checkRename = function(oldPath, newPath, callback) {
      checkEntry({ path: oldPath, deleted: true }, function(err, entry) {
        if (err) return callback(err);

        checkEntry(
          {
            path: newPath,
            url: entry.permalink,
            created: entry.created,
            deleted: false
          },
          function(err) {
            if (err) return callback(err);
            callback();
          }
        );
      });
    };

    this.removeAndSync = function(path, callback) {
      sync(blog.id, function(err, folder, done) {
        if (err) return callback(err);

        fs.removeSync(folder.path + path);

        folder.update(path, function(err) {
          if (err) return callback(err);

          done(null, function(err) {
            if (err) return callback(err);

            checkEntry({ path: path, deleted: true }, callback);
          });
        });
      });
    };
    this.writeAndSync = function(path, contents, callback) {
      sync(blog.id, function(err, folder, done) {
        if (err) return callback(err);

        fs.outputFileSync(folder.path + path, contents, "utf-8");

        folder.update(path, function(err) {
          if (err) return callback(err);

          done(null, function(err) {
            if (err) return callback(err);

            checkEntry({ path: path, deleted: false }, callback);
          });
        });
      });
    };
  });
});
