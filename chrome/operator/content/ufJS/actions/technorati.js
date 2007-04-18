/*extern ufJS, ufJSActions, ufJSParser, openUILink */ 

ufJSActions.actions.technorati_search_tags = {
  description: "Find blogs on technorati",
  icon: "http://technorati.com/favicon.ico",
  scope: {
    microformats: {
      "tag" : "tag"
    }
  },
  doAction: function(node, microformatName, event) {
    var url;
    if (microformatName == "tag") {
      var tag = ufJSParser.getMicroformatProperty(node, "tag", "tag");
      if (tag) {
        url = "http://technorati.com/tag/" + encodeURIComponent(tag);
      }
    }
    if (url) {
      openUILink(url, event);
    }
  }
};
