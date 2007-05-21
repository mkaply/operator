ufJSActions.actions.corkd_search_tags = {
  description: "Find wines on Cork'd",
  icon: "http://corkd.com/favicon.ico",
  scope: {
    semantic: {
      "tag" : "tag"
    },
    url: "http://corkd.com"
  },
  doAction: function(semanticObject, semanticObjectType) {
    if (semanticObject.tag) {
      return("http://corkd.com/tags/" + encodeURIComponent(semanticObject.tag));
    }
  }
};
