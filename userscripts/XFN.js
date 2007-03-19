/*extern ufJSParser */

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
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return definition.getXFNStatus(propnode, "contact");
        }
      },
      "acquaintance" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return definition.getXFNStatus(propnode, "acquaintance");  
        }
      },
      "friend" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return definition.getXFNStatus(propnode, "friend");  
        }
      },
      "met" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return definition.getXFNStatus(propnode, "met");  
        }
      },
      "co-worker" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return definition.getXFNStatus(propnode, "co-worker");  
        }
      },
      "colleague" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return definition.getXFNStatus(propnode, "colleague");  
        }
      },
      "co-resident" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return definition.getXFNStatus(propnode, "co-resident");  
        }
      },
      "neighbor" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return definition.getXFNStatus(propnode, "neighbor");  
        }
      },
      "child" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return definition.getXFNStatus(propnode, "child");  
        }
      },
      "parent" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return definition.getXFNStatus(propnode, "parent");  
        }
      },
      "sibling" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return definition.getXFNStatus(propnode, "sibling");  
        }
      },
      "spouse" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return definition.getXFNStatus(propnode, "spouse");  
        }
      },
      "kin" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return definition.getXFNStatus(propnode, "kin");  
        }
      },
      "muse" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return definition.getXFNStatus(propnode, "muse");  
        }
      },
      "crush" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return definition.getXFNStatus(propnode, "crush");  
        }
      },
      "date" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return definition.getXFNStatus(propnode, "date");  
        }
      },
      "sweetheart" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return definition.getXFNStatus(propnode, "sweetheart");  
        }
      },
      "me" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return definition.getXFNStatus(propnode, "me");  
        }
      }
    },
    values: {
      "link" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return mfnode.href;
        }
      },
      "text" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          var s;
          if (propnode.innerText) {
            s = propnode.innerText;
          } else {
            s = propnode.textContent;
          }
          return ufJSParser.trim(s);
        }
      }
    },
    ufjs: {
      "ufjsDisplayName" : {
        value: "",
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
