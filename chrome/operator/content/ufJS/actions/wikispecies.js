/*extern ufJS, ufJSActions, ufJSParser, openUILink */ 

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

