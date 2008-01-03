if (Components.utils.import) {
  try {
    Components.utils.import("resource://gre/modules/Microformats.js");
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
  } else if (this.trinomial) {
    return this.trinomial;
  } else if (this.trinominal) {
    return this.trinominal;
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
  } else if (this.subfamily) {
    return this.subfamily;
  } else if (this.family) {
    return this.family;
  } else if (this.superfamily) {
    return this.superfamily;
  } else if (this.parvorder) {
    return this.parvorder;
  } else if (this.infraorder) {
    return this.infraorder;
  } else if (this.suborder) {
    return this.suborder;
  } else if (this.order) {
    return this.order;
  } else if (this.superorder) {
    return this.superorder;
  } else if (this.infraclass) {
    return this.infraclass;
  } else if (this.subclass) {
    return this.subclass;
  } else if (this.taxoclass) {
    return this.taxoclass;
  } else if (this.subphylum) {
    return this.subphylum;
  } else if (this.phylum) {
    return this.phylum;
  } else if (this.superphylum) {
    return this.superphylum;
  } else if (this.subkingdom) {
    return this.subkingdom;
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
    "trinomial" : {
    },
    "trinominal" : {
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
      "species" : "species"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    var searchstring;
    if (semanticObject.binomial) {
      searchstring = semanticObject.binomial;
    } else if (semanticObject.binominal) {
      searchstring = semanticObject.binominal;
    } else {
      searchstring = semanticObject.toString();
    }
    return "http://species.wikimedia.org/wiki/Special:Search?search=" + Microformats.simpleEscape(searchstring) + "&go=Go";
  }
};

SemanticActions.add("wikispecies_search", wikispecies_search);

var wikipedia_search = {
  description: "Search Wikipedia",
  shortDescription: "Wikipedia",
  icon: "http://en.wikipedia.org/favicon.ico",
  scope: {
    semantic: {
      "species" : "species"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    var searchstring;
    if (semanticObject.binomial) {
      searchstring = semanticObject.binomial;
    } else if (semanticObject.binominal) {
      searchstring = semanticObject.binominal;
    } else {
      searchstring = semanticObject.toString();
    }
    return "http://wikipedia.org/wiki/Special:Search?search=" + Microformats.simpleEscape(searchstring) + "&go=Go";
  }
};

SemanticActions.add("wikipedia_search", wikipedia_search);

var nbn_search = {
  description: "Search NBN Species dictionary",
  shortDescription: "NBN Species",
  scope: {
    semantic: {
      "species" : "species"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    var searchstring;
    if (semanticObject.binomial) {
      searchstring = semanticObject.binomial;
    } else {
      searchstring = semanticObject.toString();
    }
    return "http://nbn.nhm.ac.uk/nhm/bin/nbntaxa.dll/search?&fsearchfor=" + encodeURIComponent(searchstring);
  }
};

SemanticActions.add("nbn_search", nbn_search);

var bioimages_search = {
  description: "Search BioImages",
  shortDescription: "BioImages",
  scope: {
    semantic: {
      "species" : "species"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    var searchstring;
    if (semanticObject.binomial) {
      searchstring = semanticObject.binomial;
    } else {
      searchstring = semanticObject.toString();
    }
    return "http://www.google.co.uk/search?ie=UTF-8&oe=UTF-8&domains=www.bioimages.org.uk&sitesearch=www.bioimages.org.uk&q=" + encodeURIComponent(searchstring);
  }
};

SemanticActions.add("bioimages_search", bioimages_search);



