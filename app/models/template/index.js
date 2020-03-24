var siteOwner = "SITE";

module.exports = {
  create: require("./create"),
  update: require("./update"),
  getMetadata: require("./getMetadata"),
  setMetadata: require("./setMetadata"),

  getFullView: require("./getFullView"),
  getView: require("./getView"),
  getViewByURL: require("./getViewByURL"),
  getViewByRoute: require("./getViewByRoute"),
  setView: require("./setView"),
  dropView: require("./dropView"),
  getPartials: require("./getPartials"),
  getAllViews: require("./getAllViews"),
  getTemplateList: require("./getTemplateList"),

  drop: require("./drop"),

  makeID: require("./util/makeID"),
  isOwner: require("./isOwner"),
  siteOwner: siteOwner,
  defaultTemplate: require("./util/makeID")(siteOwner, "diary"),

  buildFromFolder: require("./buildFromFolder"),
  readFromFolder: require("./readFromFolder"),
  writeToFolder: require("./writeToFolder"),

  viewModel: require("./viewModel"),
  metadataModel: require("./metadataModel")
};
