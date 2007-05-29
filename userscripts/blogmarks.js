/*extern ufJS, ufJSActions, ufJSParser, openUILink */ 

var blogmarks_search_tags = {
  version: 0.8,
  description: "Find bookmarks on BlogMarks",
  icon: "http://blogmarks.net/favicon.ico",
  scope: {
    semantic: {
      "tag" : "tag"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    if (semanticObject.tag) {
      return "http://blogmarks.net/marks/tag/" + encodeURIComponent(semanticObject.tag);
    }
  }
};

SemanticActions.add("blogmarks_search_tags", blogmarks_search_tags);
