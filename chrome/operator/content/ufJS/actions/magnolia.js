/*extern ufJS, ufJSActions, ufJSParser, openUILink */ 

ufJSActions.actions.magnolia_search_tags = {
  description: "Find bookmarks on Ma.gnolia",
  icon: "http://ma.gnolia.com/favicon.ico",
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
        url = "http://ma.gnolia.com/tags/" + encodeURIComponent(tag);
      }
    }
    return url;
  }
};

ufJSActions.actions.magnolia_bookmark = {
  description: "Bookmark with Ma.gnolia",
  icon: "http://ma.gnolia.com/favicon.ico",
  scope: {
    semantic: {
      "xFolk" : "taggedlink"
    }
  },
  doAction: function(node, semanticObjectType) {
    var url;
    if (semanticObjectType == "xFolk") {
      var xfolk = ufJSParser.createMicroformat(node, "xFolk");
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

