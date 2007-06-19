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
  doAction: function(semanticObject, semanticObjectType, propertyIndex) {
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
        if (propertyIndex) {
          return url[propertyIndex];
        } else {
          return url[0];
        }
      } else {
        return url;
      }
    }
  },
  getActionName: function(semanticObject, semanticObjectType, propertyIndex) {
    var url;
    var property = this.scope.semantic[semanticObjectType];
    if (property.indexOf(".") != -1) {
      var props = property.split(".");
      url = semanticObject[props[0]][props[1]];
    } else {
      url = semanticObject[property];
    }
    if (url && url instanceof Array && url.length > 1) {
      var name = semanticObject.toString() + " (";
      var split_url = url[propertyIndex].split(":");
      if (split_url[0] == "aim") {
        name += "AIM";
      } else if (split_url[0] == "ymsgr") {
        name += "Yahoo! Messenger";
      } else {
        name += url[propertyIndex];
      }
      name += ")";
      return name;
    } else {
      return semanticObject.toString();
    }
  }
};

SemanticActions.add("goto_url", goto_url);
