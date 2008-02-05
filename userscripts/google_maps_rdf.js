var google_maps_rdf = {
  scope: {
    semantic: {
      "RDF" :  {
        property : "http://www.w3.org/2003/01/geo/wgs84_pos#lat",
        defaultNS : "http://www.w3.org/2003/01/geo/wgs84_pos#"
      }
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    if (semanticObjectType == "RDF") {
      var geo = semanticObject;
      if (geo.lat && geo["long"]) {
        return "http://maps.google.com/maps?ll=" + geo.lat + "," + geo["long"] + "&q=" + geo.lat + "," + geo["long"];
      }
    }
  }
};

SemanticActions.add("google_maps", google_maps_rdf);
