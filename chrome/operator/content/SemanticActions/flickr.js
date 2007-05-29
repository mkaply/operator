var flickr_search_tags = {
  version: 0.8,
  description: "Find photos on flickr",
  icon: "http://flickr.com/favicon.ico",
  scope: {
    semantic: {
      "tag" : "tag"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    if (semanticObject.tag) {
      /* Flickr treats spaces as multiple tags - replace space with + */
      var tag = semanticObject.tag.replace(/ /g, '+');
      return "http://flickr.com/photos/tags/" + encodeURIComponent(tag);
    }
  }
};

SemanticActions.add("flickr_search_tags", flickr_search_tags);
