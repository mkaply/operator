var good_relations = {
  /* description : will be shown as an action for a given subject */
  description: "Google Product Search (by Label)",
  /* icon : ? */
  /* icon: "http://xml.mfd-consult.dk/images/foaf-explorer.32.png", */
  scope: {
    semantic: {
      "RDF" : {
        /* property which is concerned by this action */
        property : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
	      defaultNS : "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      }
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    if (semanticObjectType == "RDF") {
      so = semanticObject;

      try {
        if (so.name && so.name.toString().replace(/^\s+|\s+$/g, '')) {
          return "http://www.google.com/search?q=" + encodeURIComponent(so.name.toString().replace(/^\s+|\s+$/g, '')) + "&hl=en&tbm=shop";
        }

        if (so.toString() && so.toString().replace(/^\s+|\s+$/g, '').substring(0, 4) != 'http') {
          return "http://www.google.com/search?q=" + encodeURIComponent(so.toString().replace(/^\s+|\s+$/g, '')) + "&hl=en&tbm=shop";
        }

        for(var member in so){ dump(member + "\n"); };
      } catch (e) {
        dump(e + "\n");
        if (Operator.debug) {
          alert(e);
        }
      }
    }
  }
};

var good_relations2 = {
  /* description : will be shown as an action for a given subject */
  description: "Google Product Search (by Name)",
  /* icon : ? */
  /* icon: "http://xml.mfd-consult.dk/images/foaf-explorer.32.png", */
  scope: {
    semantic: {
      "RDF" : 
      {
        /* property which is concerned by this action */
        property : "http://purl.org/goodrelations/v1#name",
	      defaultNS : "http://purl.org/goodrelations/v1#",
      }
    }
  },
  doAction: good_relations.doAction
};

SemanticActions.add("good_relations", good_relations);
SemanticActions.add("good_relations2", good_relations2);
