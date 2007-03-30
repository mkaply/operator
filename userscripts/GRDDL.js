/*extern ufJSParser, ufJS, ufJSActions, openUILink */ 

function GRDDL() {
}

ufJSParser.microformats.GRDDL = {
  version: "0.2",
  mfName: "GRDDL",
  mfObject: GRDDL,
  attributeName: "rel",
  attributeValues: ["transformation"],
  definition: {
    values: {
      "transformation" : {
        virtual: true,
        virtualGetter: function(propnode, mfnode, definition) {
          return "foo";
        }
      }
    },
    ufjs: {
      "ufjsDisplayName" : {
        virtual: true,
        virtualGetter: function(propnode, mfnode, definition) {
          if (mfnode.ownerDocument) {
            return mfnode.ownerDocument.title;
          } else {
            return mfnode.title;
          }
        }
      }
    }
  }
};

ufJSActions.actions.extract_rdf = {
  description: "Extract RDF",
  scope: {
    microformats: {
      "GRDDL" : "GRDDL"
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
    for (var i in microformatNames) {
      if (microformatNames[i] == "GRDDL") {
        url = "http://www.w3.org/2005/08/online_xslt/xslt?xslfile=http%3A%2F%2Fwww.w3.org%2F2003%2F11%2Frdf-in-xhtml-processor&xmlfile=";
        var pageurl;
        if (node.ownerDocument) {
          pageurl = node.ownerDocument.URL;
        } else {
          pageurl = node.URL;
        }
        url += encodeURIComponent(pageurl);
        break;
      }
    }
    if (url) {
      openUILink(url, event);
    }
  }
};

Operator.microformatList["GRDDL"] = {
  description: "GRDDL",
  icon: "chrome://operator/content/other.png"
};

