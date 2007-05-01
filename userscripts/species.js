function species(node) {
  if (node) {
    ufJSParser.newMicroformat(this, node, "species");
  }
}
species.prototype.toString = function() {
  return this.vernacular;
}

ufJSParser.microformats.species = {
  version: "0.7",
  description: "Species",
  mfObject: species,
  className: "biota",
  definition: {
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
      }
    }
  }
};

ufJSActions.actions.wikispecies_search = {
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

