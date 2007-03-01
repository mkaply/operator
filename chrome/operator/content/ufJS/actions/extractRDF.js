/*extern ufJS, ufJSActions, ufJSParser, openUILink */ 

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
