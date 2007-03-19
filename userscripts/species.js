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
        value: ""
      },
      "kingdom" : {
        value: ""
      },
      "subkingdom" : {
        value: ""
      },
      "superphylum" : {
        value: ""
      },
      "vernacular" : {
        value: ""
      },
      "binomial" : {
        value: ""
      }
    },
    ufjs: {
      "ufjsDisplayName" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.getMicroformatProperty(mfnode, "species", "vernacular");
        }
      }
    },
    defaultGetter: function(propnode) {
      if (((propnode.nodeName.toLowerCase() == "abbr") || (propnode.nodeName.toLowerCase() == "html:abbr")) && (propnode.getAttribute("title"))) {
        return propnode.getAttribute("title");
      } else if ((propnode.nodeName.toLowerCase() == "img") && (propnode.getAttribute("alt"))) {
        return propnode.getAttribute("alt");
      } else if ((propnode.nodeName.toLowerCase() == "area") && (propnode.getAttribute("alt"))) {
        return propnode.getAttribute("alt");
      } else {
        var values = ufJSParser.getElementsByClassName(propnode, "value");
        if (values.length > 0) {
          var value = "";
          for (var j=0;j<values.length;j++) {
            value += values[j].textContent;
          }
          return value;
        } else {
          var s;
          if (propnode.innerText) {
            s = propnode.innerText;
          } else {
            s = propnode.textContent;
          }
          return ufJSParser.trim(s);
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


