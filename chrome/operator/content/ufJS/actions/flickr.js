/*extern ufJS, ufJSActions, ufJSParser, openUILink */ 

ufJSActions.actions.flickr_search_tags = {
  description: "Find photos on flickr",
  icon: "http://flickr.com/favicon.ico",
  scope: {
    semantic: {
      "tag" : "tag"
    }
  },
  doAction: function(node, semanticObjectType) {
    var url;
    if (semanticObjectType == "tag") {
      var tag = ufJSParser.getMicroformatProperty(node, "tag", "tag");
      if (tag) {
        /* Flickr treats spaces as multiple tags - replace space with + */
        tag = tag.replace(/ /g, '+');
        url = "http://flickr.com/photos/tags/" + encodeURIComponent(tag);
      }
    }
    return url;
  }
};
