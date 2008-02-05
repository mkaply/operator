var dominos = {
  description: "Find the nearest Domino's Pizza",
  shortDescription: "Domino's",
  scope: {
    semantic: {
      "hCard" : "adr"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    var url;
    if (semanticObjectType == "hCard") {
      var adr = semanticObject.adr;
      url = "http://www.dominos.com/apps/storelocator-EN.jsp?";
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
