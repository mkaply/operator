function XFN() {
}

ufJSParser.microformats.XFN = {
  version: "0.7",
  description: "XFN Relationship(s)",
  mfObject: XFN,
  attributeName: "rel",
  attributeValues: ["contact","acquaintance","friend","met","co-worker",
                    "colleague","co-resident","neighbor","child","parent",
                    "sibling","spouse","kin","muse","crush","date",
                    "sweetheart","me"],
  definition: {
    properties: {
      "contact" : {
        virtual: true,
        virtualGetter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "contact");
        }
      },
      "acquaintance" : {
        virtual: true,
        virtualGetter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "acquaintance");  
        }
      },
      "friend" : {
        virtual: true,
        virtualGetter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "friend");  
        }
      },
      "met" : {
        virtual: true,
        virtualGetter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "met");  
        }
      },
      "co-worker" : {
        virtual: true,
        virtualGetter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "co-worker");  
        }
      },
      "colleague" : {
        virtual: true,
        virtualGetter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "colleague");  
        }
      },
      "co-resident" : {
        virtual: true,
        virtualGetter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "co-resident");  
        }
      },
      "neighbor" : {
        virtual: true,
        virtualGetter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "neighbor");  
        }
      },
      "child" : {
        virtual: true,
        virtualGetter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "child");  
        }
      },
      "parent" : {
        virtual: true,
        virtualGetter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "parent");  
        }
      },
      "sibling" : {
        virtual: true,
        virtualGetter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "sibling");  
        }
      },
      "spouse" : {
        virtual: true,
        virtualGetter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "spouse");  
        }
      },
      "kin" : {
        virtual: true,
        virtualGetter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "kin");  
        }
      },
      "muse" : {
        virtual: true,
        virtualGetter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "muse");  
        }
      },
      "crush" : {
        virtual: true,
        virtualGetter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "crush");  
        }
      },
      "date" : {
        virtual: true,
        virtualGetter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "date");  
        }
      },
      "sweetheart" : {
        virtual: true,
        virtualGetter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "sweetheart");  
        }
      },
      "me" : {
        virtual: true,
        virtualGetter: function(propnode, mfnode, definition) {
          return ufJSParser.microformats.XFN.getXFNStatus(propnode, "me");  
        }
      },
      "link" : {
        virtual: true,
        datatype: "anyURI"
      },
      "text" : {
        virtual: true
      }
    },
    ufjs: {
      "ufjsDisplayName" : {
        virtual: true,
        virtualGetter: function(propnode, mfnode, definition) {
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
};

if (ufJSActions.actions.goto_url) {
  ufJSActions.actions.goto_url.scope.microformats.XFN = "link";
}
