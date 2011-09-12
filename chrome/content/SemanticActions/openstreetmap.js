/* localizeISO8601 */ 

var open_street_map = {
  description: "Find with Open Street Map",
  shortDescription: "Open Street Map",
  icon: "http://www.openstreetmap.org/favicon.ico",
  scope: {
    semantic: {
      "geo" : "geo",
      "hCard" : "label",
      "hCard" : "geo",
      "hCard" : "adr"
    }
  },
  doAction: function(semanticObject, semanticObjectType, propertyIndex) {
    var url;
    if ((semanticObjectType == "hCard") || (semanticObjectType == "adr")) {
      var adr;
      if (semanticObjectType == "hCard") {
        if (!propertyIndex) {
          propertyIndex = 0;
        }
        if (semanticObject.adr) {
          adr = semanticObject.adr[propertyIndex];
        } else {
		  /* label */
          return "http://nominatim.openstreetmap.org/search?q=" + Microformats.simpleEscape(semanticObject.label[propertyIndex]);  
        }
      } else {
        adr = semanticObject;
      }
      if (adr) {
        url = "http://nominatim.openstreetmap.org/search?q=";
        if (adr["street-address"]) {
          url += Microformats.simpleEscape(adr["street-address"].join(", "));
          url += ", ";
        }
        if (adr.region) {
          url += adr.region;
          url += ", ";
        }
        if (adr.locality) {
          url += adr.locality;
          url += ", ";
        }
        if (adr["postal-code"]) {
          url += adr["postal-code"];
          url += ", ";
        }
        if (adr["country-name"]) {
          url += adr["country-name"];
        }
        if (url.lastIndexOf(", ") == (url.length - ", ".length)) {
          url = url.substring(0, url.lastIndexOf(", "));
        }
      }
	  if (semanticObjectType == "hCard") {
		url += " (" + semanticObject.toString().replace("(", "[").replace(")", "]") + ")";
	  }
    } else if (semanticObjectType == "geo") {
      if (semanticObject.latitude && semanticObject.longitude) {
        url = "http://www.openstreetmap.org/?mlat=" + semanticObject.latitude + "&mlon=" + semanticObject.longitude + "&layers=B000FTF";
      }
    }
    return url
  }
};

var open_street_map_search = {
  description: "Find with Nominatim",
  shortDescription: "Nominatim",
  icon: "http://www.openstreetmap.org/favicon.ico",
  scope: {
    semantic: {
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    var searchstring;
    var property = open_street_map_search.scope.semantic[semanticObjectType];
    if (property.indexOf(".") != -1) {
      var props = property.split(".");
      searchstring = semanticObject[props[0]][props[1]];
    } else {
      searchstring = semanticObject[property];
    }
    if (searchstring) {
      return  "http://nominatim.openstreetmap.org/search?q=" + encodeURIComponent(searchstring);
    }
    return null;
  }
};

SemanticActions.add("open_street_map", open_street_map);
SemanticActions.add("open_street_map_search", open_street_map_search);

