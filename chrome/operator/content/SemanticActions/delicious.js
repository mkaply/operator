var delicious_search_tags = {
  description: "Find bookmarks on del.icio.us",
  shortDescription: "del.icio.us",
  icon: "http://del.icio.us/favicon.ico",
  scope: {
    semantic: {
      "tag" : "tag"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    if (semanticObject.tag) {
      return "http://del.icio.us/tag/" + encodeURIComponent(semanticObject.tag);
    }
  }
};

var delicious_bookmark = {
  description: "Bookmark with del.icio.us",
  shortDescription: "del.icio.us (+)",
  icon: "http://del.icio.us/favicon.ico",
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
        url = 'http://del.icio.us/post?v=4;url=' + encodeURIComponent(xfolk.taggedlink.link);
        if (xfolk.taggedlink.title) {
          url += ';title=' + encodeURIComponent(xfolk.taggedlink.title);
        }
        if (xfolk.description) {
          url += ';notes=' + encodeURIComponent(xfolk.description);
        }
        /*
        if (xfolk.tag) {
          url += ';tags=';
          var j;
          for (j = 0; j < xfolk.tag.length; j++) {
            url += encodeURIComponent(xfolk.tag[j].tag);
            url += "+";
          }
        }
        */
      }
    }
    return url;
  }
};

SemanticActions.add("delicious_search_tags", delicious_search_tags);
SemanticActions.add("delicious_bookmark", delicious_bookmark);
