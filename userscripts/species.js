if (Components.utils.import) {
  try {
    Components.utils.import("rel:Microformats.js");
    EXPORTED_SYMBOLS = ["species"];
  } catch (ex) {}
}

function species(node) {
  if (node) {
    Microformats.parser.newMicroformat(this, node, "species");
  }
}
species.prototype.toString = function() {
  return this.vernacular;
}

var species_definition = {
  version: "0.7",
  description: "Species",
  mfObject: species,
  className: "biota",
  properties: {
    "domain" : {
    },
    "kingdom" : {
    },
    "subkingdom" : {
    },
    "superphylum" : {
    },
    "vernacular" : {
    },
    "binomial" : {
    },
    "genus" : {
    },
    "specific" : {
       plural: true
    }
  }
};

Microformats.add("species", species_definition);

var wikispecies_search = {
  version: 0.8,
  description: "Wikispecies",
  icon: "http://species.wikimedia.org/favicon.ico",
  scope: {
    semantic: {
      "species" : "binomial"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    if (semanticObjectType == "species") {
      return "http://species.wikimedia.org/wiki/Special:Search?search=" + encodeURIComponent(semanticObject.binomial) + "&go=Go";
    }
  }
};

SemanticActions.add("wikispecies_search", wikispecies_search);
