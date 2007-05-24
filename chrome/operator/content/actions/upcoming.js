var upcoming_search_tags = {
  version: 0.8,
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

Microformats.actions.add("upcoming_search_tags", upcoming_search_tags);
