var goto_url = {
  description: "Go to web page",
  shortDescription: "Web page",
  scope: {
    semantic: {
      "hCard" : "url",
      "hCalendar" : "url",
      "hAtom-hEntry" : "bookmark.link",
      "XFN" : "link"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    var url;
    var property = this.scope.semantic[semanticObjectType];
    if (property.indexOf(".") != -1) {
      var props = property.split(".");
      url = semanticObject[props[0]][props[1]];
    } else {
      url = semanticObject[property];
    }
    if (url) {
      if (url instanceof Array) {
        return url[0];
      } else {
        return url;
      }
    }
  } 
};

SemanticActions.add("goto_url", goto_url);
