if (Components.utils.import) {
  try {
    Components.utils.import("resource://gre/modules/Microformats.js");
    Components.utils.import("resource://gre/modules/hCard.js");
    Components.utils.import("resource://gre/modules/hCalendar.js");
    EXPORTED_SYMBOLS = ["license"];
  } catch (ex) {}
}

function license(node) {
  if (node) {
    Microformats.parser.newMicroformat(this, node, "license");
  }
}
license.prototype.toString = function() {
  var licenseName;
  if (this.link) {
    var urlArray = this.link.split("/");
    if (urlArray[2] == "creativecommons.org") {
      licenseName = "Creative Commons ";
      switch (urlArray[4]) {
        case "by":
          licenseName += "Attribute ";
          break;
        case "by-nd":
          licenseName += "Attribution-NoDerivs ";
          break;
        case "by-nc-nd":
          licenseName += "Attribution-NonCommercial-NoDerivs ";
          break;
        case "by-nc-sa":
          licenseName += "Attribution-NonCommercial-ShareAlike ";
          break;
        case "by-sa":
          licenseName += "Attribution-ShareAlike ";
      }
      licenseName += urlArray[5];
    }
  }
  if (licenseName) {
    return licenseName;
  } else {
    if ((this.text) && (this.text != this.link)) {
      return this.text;
    } else if (this.node.getAttribute("title")) {
      return this.node.getAttribute("title");
    } else {
      return this.link;
    }
  }
}

var license_definition = {
  mfVersion: 0.8,
  description: "Licenses",
  mfObject: license,
  attributeName: "rel",
  attributeValues: "license",
  properties: {
    "link" : {
      virtual: true,
      datatype: "anyURI"
    },
    "text" : {
      virtual: true
    }
  }
};

Microformats.add("license", license_definition);

var view_license = {
  description: "View License",
  scope: {
    semantic: {
      "license" : "link",
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    return semanticObject[this.scope.semantic[semanticObjectType]];
  } 
};

SemanticActions.add("view_license", view_license);
