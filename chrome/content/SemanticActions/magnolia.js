var magnolia_search_tags = {
  description: "Find bookmarks on Ma.gnolia",
  shortDescription: "Ma.gnolia",
  icon: "http://ma.gnolia.com/favicon.ico",
  scope: {
    semantic: {
      "tag" : "tag"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    if (semanticObject.tag) {
      return "http://ma.gnolia.com/tags/" + encodeURIComponent(semanticObject.tag);
    }
    return null;
  }
};

var magnolia_bookmark = {
  description: "Bookmark with Ma.gnolia",
  shortDescription: "Ma.gnolia (+)",
  icon: "http://ma.gnolia.com/favicon.ico",
  scope: {
    semantic: {
      "xFolk" : "taggedlink"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    var url;
    if (semanticObjectType == "xFolk") {
      var xfolk = semanticObject;
      if (xfolk && xfolk.taggedlink && xfolk.taggedlink.link) {
        url = 'http://ma.gnolia.com/bookmarklet/add?url=' + encodeURIComponent(xfolk.taggedlink.link);
        if (xfolk.taggedlink.title) {
          url += '&title=' + encodeURIComponent(xfolk.taggedlink.title);
        }
        if (xfolk.description) {
          url += '&description=' + encodeURIComponent(xfolk.description);
        }
        if (xfolk.tag) {
          url += '&tags=';
          for (var i = 0; i < xfolk.tag.length; i++) {
            url += encodeURIComponent(xfolk.tag[i]);
            url += ",";
          }
        }
      }
    }
    return url;
  }
};

SemanticActions.add("magnolia_search_tags", magnolia_search_tags);
SemanticActions.add("magnolia_bookmark", magnolia_bookmark);
