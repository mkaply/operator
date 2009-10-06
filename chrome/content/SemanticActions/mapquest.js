/* localizeISO8601 */ 

var mapquest = {
description: "Find with MapQuest",
  shortDescription: "MapQuest",
  icon: "http://www.mapquest.com/favicon.ico",
  scope: {
    semantic: {
      "geo" : "geo",
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
        adr = semanticObject.adr[propertyIndex];
      } else {
        adr = semanticObject;
      }
      if (adr) {
        url = "http://www.mapquest.com/maps/map.adp?searchtype=address";
        if (adr["street-address"]) {
          url += "&address=" + Microformats.simpleEscape(adr["street-address"].join(", "));
        }
        if (adr.locality) {
          url += "&city=" + adr.locality;
        }
        if (adr.region) {
          url += "&state=" + adr.region;
        }
        if (adr["postal-code"]) {
          url += "&zipcode=" + adr["postal-code"];
        }
        if (adr["country-name"]) {
          url += "&country=" + adr["country-name"];
        }
      }
    } else if (semanticObjectType == "geo") {
      if (semanticObject.latitude && semanticObject.longitude) {
        url = "http://www.mapquest.com/maps/map.adp?latlongtype=decimal&latitude=" +
              semanticObject.latitude + "&longitude=" + semanticObject.longitude;
      }
    }
    return url;
  }
};

SemanticActions.add("mapquest", mapquest);

