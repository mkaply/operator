if (Components.utils.import) {
  try {
    Components.utils.import("resource://gre/modules/Microformats.js");
    EXPORTED_SYMBOLS = ["XFN"];
  } catch (ex) {}
}

function XFN(node) {
  if (node) {
    Microformats.parser.newMicroformat(this, node, "XFN");
  }
}
XFN.prototype.toString = function() {
  var displayName = this.text + " (";
  var first = true;
  var i;
  for (i in this) {
    if ((i != "text") && (i != "link")) {
      if (this[i] == true) {
        if (!first) {
          displayName += ",";
        } else {
          first = false;
        }
        displayName += i;
      }
    }
  }
  displayName += ")";
  return displayName;
}

var XFN_definition = {
  mfVersion: 0.8,
  description: "XFN Relationship(s)",
  mfObject: XFN,
  attributeName: "rel",
  attributeValues: "contact acquaintance friend met co-worker colleague " +
                   "co-resident neighbor child parent sibling spouse kin " +
                   "muse crush date sweetheart me",
  properties: {
    "contact" : {
      virtual: true,
      virtualGetter: function(propnode, mfnode, definition) {
        return XFN_definition.getXFNStatus(propnode, "contact");
      }
    },
    "acquaintance" : {
      virtual: true,
      virtualGetter: function(propnode, mfnode, definition) {
        return XFN_definition.getXFNStatus(propnode, "acquaintance");  
      }
    },
    "friend" : {
      virtual: true,
      virtualGetter: function(propnode, mfnode, definition) {
        return XFN_definition.getXFNStatus(propnode, "friend");  
      }
    },
    "met" : {
      virtual: true,
      virtualGetter: function(propnode, mfnode, definition) {
        return XFN_definition.getXFNStatus(propnode, "met");  
      }
    },
    "co-worker" : {
      virtual: true,
      virtualGetter: function(propnode, mfnode, definition) {
        return XFN_definition.getXFNStatus(propnode, "co-worker");  
      }
    },
    "colleague" : {
      virtual: true,
      virtualGetter: function(propnode, mfnode, definition) {
        return XFN_definition.getXFNStatus(propnode, "colleague");  
      }
    },
    "co-resident" : {
      virtual: true,
      virtualGetter: function(propnode, mfnode, definition) {
        return XFN_definition.getXFNStatus(propnode, "co-resident");  
      }
    },
    "neighbor" : {
      virtual: true,
      virtualGetter: function(propnode, mfnode, definition) {
        return XFN_definition.getXFNStatus(propnode, "neighbor");  
      }
    },
    "child" : {
      virtual: true,
      virtualGetter: function(propnode, mfnode, definition) {
        return XFN_definition.getXFNStatus(propnode, "child");  
      }
    },
    "parent" : {
      virtual: true,
      virtualGetter: function(propnode, mfnode, definition) {
        return XFN_definition.getXFNStatus(propnode, "parent");  
      }
    },
    "sibling" : {
      virtual: true,
      virtualGetter: function(propnode, mfnode, definition) {
        return XFN_definition.getXFNStatus(propnode, "sibling");  
      }
    },
    "spouse" : {
      virtual: true,
      virtualGetter: function(propnode, mfnode, definition) {
        return XFN_definition.getXFNStatus(propnode, "spouse");  
      }
    },
    "kin" : {
      virtual: true,
      virtualGetter: function(propnode, mfnode, definition) {
        return XFN_definition.getXFNStatus(propnode, "kin");  
      }
    },
    "muse" : {
      virtual: true,
      virtualGetter: function(propnode, mfnode, definition) {
        return XFN_definition.getXFNStatus(propnode, "muse");  
      }
    },
    "crush" : {
      virtual: true,
      virtualGetter: function(propnode, mfnode, definition) {
        return XFN_definition.getXFNStatus(propnode, "crush");  
      }
    },
    "date" : {
      virtual: true,
      virtualGetter: function(propnode, mfnode, definition) {
        return XFN_definition.getXFNStatus(propnode, "date");  
      }
    },
    "sweetheart" : {
      virtual: true,
      virtualGetter: function(propnode, mfnode, definition) {
        return XFN_definition.getXFNStatus(propnode, "sweetheart");  
      }
    },
    "me" : {
      virtual: true,
      virtualGetter: function(propnode, mfnode, definition) {
        return XFN_definition.getXFNStatus(propnode, "me");  
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
  getXFNStatus: function(propnode, relationship)
  {
    var rel = propnode.getAttribute("rel");
    if (rel.match("(^|\\s)" + relationship + "(\\s|$)")) {
      return true;
    }
    return false;
  }
};

//if (ufJSActions.actions.goto_url) {
//  ufJSActions.actions.goto_url.scope.semantic.XFN = "link";
//}

Microformats.add("XFN", XFN_definition);
