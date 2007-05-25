var goto_url = {
  version: 0.8,
  description: "Go to web page",
  scope: {
    semantic: {
      "hCard" : "url",
      "hCalendar" : "url",
      "hAtom-hEntry" : "bookmark.link"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    var url = semanticObject[this.scope.semantic[semanticObjectType]];
    if (url instanceof Array) {
      return url[0];
    } else {
      return url;
    }
  } 
};

Microformats.actions.add("goto_url", goto_url);
