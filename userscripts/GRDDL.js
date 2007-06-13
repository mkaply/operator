if (Components.utils.import) {
  try {
    Components.utils.import("resource://gre/modules/Microformats.js");
    EXPORTED_SYMBOLS = ["GRDDL"];
  } catch (ex) {}
}

function GRDDL(node) {
  if (node) {
    Microformats.parser.newMicroformat(this, node, "GRDDL");
  }
}
GRDDL.prototype.toString = function() {
  if (this.node.ownerDocument) {
    return this.node.ownerDocument.title;
  } else {
    return this.node.title;
  }
}

GRDDL_definition = {
  mfVersion: 0.8,
  mfObject: GRDDL,
  attributeName: "rel",
  attributeValues: "transformation",
  properties: {
    "transformation" : {
      virtual: true,
      virtualGetter: function(propnode) {
        return "foo";
      }
    }
  }
};

Microformats.add("GRDDL", GRDDL_definition);

var extract_rdf = {
  description: "Extract RDF",
  scope: {
    semantic: {
      "GRDDL" : "GRDDL"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    if (semanticObjectType == "GRDDL") {
      var url = "http://www.w3.org/2005/08/online_xslt/xslt?xslfile=http%3A%2F%2Fwww.w3.org%2F2003%2F11%2Frdf-in-xhtml-processor&xmlfile=";
      var pageurl;
      if (semanticObject.node.ownerDocument) {
        pageurl = semanticObject.node.ownerDocument.URL;
      } else {
        pageurl = semanticObject.node.URL;
      }
      url += encodeURIComponent(pageurl);
      return url;
    }
  }
};

SemanticActions.add("extract_rdf", extract_rdf);
