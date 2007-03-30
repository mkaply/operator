/*extern ufJSParser, ufJS, ufJSActions, openUILink */ 



function species() {
}

ufJSParser.microformats.species = {
  version: "0.2",
  mfName: "species",
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
    },
    ufjs: {
      "ufjsDisplayName" : {
        virtual: true,
        virtualGetter: function(propnode, mfnode, definition) {
          return ufJSParser.getMicroformatProperty(mfnode, "species", "vernacular");
        }
      }
    }
  }
};

ufJSActions.actions.wikispecies_search = {
  description: "Wikispecies",
  icon: "http://species.wikimedia.org/favicon.ico",
  scope: {
    microformats: {
      "species" : "binomial"
    }
  },
  doAction: function(node, microformatName, event) {
    var microformatNames;
    if (!microformatName) {
      microformatNames = ufJS.getMicroformatNameFromNode(node);
    } else {
      microformatNames = [];
      microformatNames.push(microformatName);
    }
    var url;
    var action = ufJSActions.actions.wikispecies_search;
    for (var i in microformatNames) {
      var param = ufJSParser.getMicroformatProperty(node, microformatNames[i], action.scope.microformats[microformatNames[i]]);
      if (param) {
        url = "http://species.wikimedia.org/wiki/Special:Search?search=" + encodeURIComponent(param) + "&go=Go";
        break;
      }
    }
    if (url) {
      openUILink(url, event);
    }
  }
};

Operator.microformatList.species = {
  description: "Species",
  icon: "chrome://operator/content/other.png"
};


