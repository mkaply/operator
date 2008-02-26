var dominos = {
  description: "Find the nearest Domino's Pizza",
  shortDescription: "Domino's",
  scope: {
    semantic: {
      "hCard" : "adr"
    }
  },
  doAction: function(semanticObject, semanticObjectType, propertyIndex) {
    var url;
    if (semanticObjectType == "hCard") {
      if (propertyIndex) {
        var adr = semanticObject.adr[propertyIndex];
      } else {
        var adr = semanticObject.adr[0];
      }
      url = "http://www.dominos.com/home/findstore/storelocator.jsp?";
      if (adr["street-address"]) {
        url += "street=";
        url += adr["street-address"].join(", ");
      }
      if ((adr.region) || (adr.locality) || (adr["postal-code"])) {
        url += "&cityStateZip=";
      }
      if (adr.region) {
        url += adr.region;
        url += ", ";
      }
      if (adr.locality) {
        url += adr.locality;
        url += " ";
      }
      if (adr["postal-code"]) {
        url += adr["postal-code"];
      }
    }
    return url;
  }
};

SemanticActions.add("dominos", dominos);
