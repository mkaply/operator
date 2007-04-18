/*extern ufJS, ufJSActions, ufJSParser, openUILink */ 

ufJSActions.actions.yedda_search_tags = {
  description: "Find answers on Yedda",
  icon: "http://yedda.com/favicon.ico",
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
        url = "http://yedda.com/questions/tags/" + encodeURIComponent(tag) + "?source=operator";
      }
    }
    if (url) {
      openUILink(url, event);
    }
  }
};
