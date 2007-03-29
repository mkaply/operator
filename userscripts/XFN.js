function XFN() {
}

ufJSParser.microformats.XFN = {
  version: "0.2",
  mfName: "XFN",
  mfObject: XFN,
  attributeName: "rel",
  attributeValues: ["contact","acquaintance","friend","met","co-worker",
                    "colleague","co-resident","neighbor","child","parent",
                    "sibling","spouse","kin","muse","crush","date",
                    "sweetheart","me"],
  definition: {
    properties: {
      "contact" : {
        cardinality: "singular",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "contact");
        }
      },
      "acquaintance" : {
        cardinality: "singular",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "acquaintance");  
        }
      },
      "friend" : {
        cardinality: "singular",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "friend");  
        }
      },
      "met" : {
        cardinality: "singular",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "met");  
        }
      },
      "co-worker" : {
        cardinality: "singular",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "co-worker");  
        }
      },
      "colleague" : {
        cardinality: "singular",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "colleague");  
        }
      },
      "co-resident" : {
        cardinality: "singular",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "co-resident");  
        }
      },
      "neighbor" : {
        cardinality: "singular",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "neighbor");  
        }
      },
      "child" : {
        cardinality: "singular",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "child");  
        }
      },
      "parent" : {
        cardinality: "singular",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "parent");  
        }
      },
      "sibling" : {
        cardinality: "singular",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "sibling");  
        }
      },
      "spouse" : {
        cardinality: "singular",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "spouse");  
        }
      },
      "kin" : {
        cardinality: "singular",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "kin");  
        }
      },
      "muse" : {
        cardinality: "singular",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "muse");  
        }
      },
      "crush" : {
        cardinality: "singular",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "crush");  
        }
      },
      "date" : {
        cardinality: "singular",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "date");  
        }
      },
      "sweetheart" : {
        cardinality: "singular",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "sweetheart");  
        }
      },
      "me" : {
        cardinality: "singular",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "me");  
        }
      },
      "link" : {
        cardinality: "singular",
        virtual: true,
        datatype: "anyURI"
      },
      "text" : {
        cardinality: "singular",
        virtual: true
      }
    },
    ufjs: {
      "ufjsDisplayName" : {
        cardinality: "singular",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          var i;
          var xfn = ufJSParser.createMicroformat(mfnode, "XFN");
          if (xfn) { 
            var displayName = xfn.text + " (";
            var first = true;
            for (i in xfn) {
              if ((i != "text") && (i != "link")) {
                if (!first) {
                  displayName += ",";
                } else {
                  first = false;
                }
                displayName += i;
              }
            }
            displayName += ")";
            return displayName;
          }
        }
      }
    },
    getXFNStatus: function(propnode, relationship)
    {
      var rel = propnode.getAttribute("rel");
      if (rel.match("(^|\\s)" + relationship + "(\\s|$)")) {
        return true;
      }
      return false;
    }
  }
};

ufJSActions.actions.goto_url.scope.microformats.XFN = "link";

Operator.microformatList.XFN = {
  description: "XFN Relationship(s)",
  icon: "chrome://operator/content/other.png",
  sort: true
};


