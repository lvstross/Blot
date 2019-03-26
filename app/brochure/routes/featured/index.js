// This middleware appends the list of featured sites
// to the view used to render a page. It filters the
// list asynchronously to ensure that featured sites
// still point to Blot. This filtering should not block
// the server's boot. This filtering is also rescheduled
// once per day to ensure sites are fresh.

var schedule = require("node-schedule").scheduleJob;
var filter = require("./filter");
var config = require("config");

var Cache = require("express-disk-cache");
var cache = new Cache(config.cache_directory);

var featured = require("./featured.json");

// Check the list of featured sites when the server starts
check();

console.log("Featured sites: scheduled check each midnight!");
schedule({ hour: 8, minute: 0 }, check);

function check() {
  if (config.environment === "development") {
    console.log("Featured sites: not checking in development environment");
    return;
  }

  console.log("Featured sites: checking which sites point to Blot");
  filter(featured, function(err, filtered) {
    if (err) return console.warn(err);

    featured = filtered;

    cache.flush(config.host, function(err) {
      if (err) console.warn(err);

      console.log("Featured sites: check completed!");
    });
  });
}

module.exports = function(req, res, next) {
  res.locals.featured = featured;
  next();
};
