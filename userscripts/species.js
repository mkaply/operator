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
  if (this.vernacular) {
    return this.vernacular;
  } else if (this.binomial) {
    return this.binomial;
  } else if (this.binominal) {
    return this.binominal;
  } else if (this.variety) {
    return this.variety;
  } else if (this.cultivar) {
    return this.cultivar;
  } else if (this.breed) {
    return this.breed;
  } else if (this.genus) {
    return this.genus;
  } else if (this.family) {
    return this.family;
  } else if (this.order) {
    return this.order;
  } else if (this["class"]) {
    return this["class"];
  } else if (this.phylum) {
    return this.phylum;
  } else if (this.kingdom) {
    return this.kingdom;
  }
}

var species_definition = {
  mfVersion: 0.8,
  description: "Species",
  mfObject: species,
  className: "biota",
  properties: {
    "domain" : {
    },
    "kingdom" : {
    },
    "phylum" : {
    },
    "subphylum" : {
    },
    "order" : {
    },
    "superorder" : {
    },
    "suborder" : {
    },
    "infraorder" : {
    },
    "parvorder" : {
    },
    "taxoclass" : {
    },
    "subkingdom" : {
    },
    "superphylum" : {
    },
    "vernacular" : {
    },
    "binomial" : {
    },
    "binominal" : {
    },
    "genus" : {
    },
    "variety" : {
    },
    "cultivar" : {
    },
    "breed" : {
    },
    "class" : {
    },
    "subclass" : {
    },
    "infraclass" : {
    },
    "family" : {
    },
    "superfamily" : {
    },
    "subfamily" : {
    },
    "specific" : {
       plural: true
    }
  }
};

Microformats.add("species", species_definition);

var wikispecies_search = {
  description: "Search Wikispecies",
  shortDescription: "Wikispecies",
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
