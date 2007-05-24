ufJSActions.actions.upcoming_search_tags = {
  description: "Find events on Upcoming.org",
  icon: "http://upcoming.org/favicon.ico",
  scope: {
    semantic: {
      "tag" : "tag"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    if (semanticObject.tag) {
      return "http://upcoming.org/tag/" + encodeURIComponent(semanticObject.tag);
    }
  }
};
