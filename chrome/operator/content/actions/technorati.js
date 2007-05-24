ufJSActions.actions.technorati_search_tags = {
  description: "Find blogs on technorati",
  icon: "http://technorati.com/favicon.ico",
  scope: {
    semantic: {
      "tag" : "tag"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    if (semanticObject.tag) {
      return "http://technorati.com/tag/" + encodeURIComponent(semanticObject.tag);
    }
  }
};
