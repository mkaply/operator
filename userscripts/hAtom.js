/* hAtom is kind of strange. I decided to separate it in to hFeed and hEntry */

if (Components.utils.import) {
  try {
    Components.utils.import("resource://gre/modules/Microformats.js");
    EXPORTED_SYMBOLS = ["hFeed"];
    EXPORTED_SYMBOLS = ["hEntry"];
  } catch (ex) {}
}

function hFeed(node) {
  if (node) {
    Microformats.parser.newMicroformat(this, node, "hAtom-hFeed");
  }
}
hFeed.prototype.toString = function() {
  if (this.node.ownerDocument) {
    return this.node.ownerDocument.title;
  } else {
    return this.node.title;
  }
}

function hEntry(node) {
  if (node) {
    Microformats.parser.newMicroformat(this, node, "hAtom-hEntry");
  }
}
hEntry.prototype.toString = function() {
  return this["entry-title"];
}

var hAtom_hEntry_definition = {
  mfVersion: 0.8,
  description: "Atom Entry(s)",
  mfObject: hEntry,
  className: "hentry",
  properties: {
    "author" : {
      plural: true,
      virtual: true,
      virtualGetter: function(mfnode) {
        /* FIXME - THIS IS FIREFOX SPECIFIC */
        /* check if ancestor is an address with author  */
//            var xpathExpression = "ancestor::*//address[contains(concat(' ', @class, ' '), ' author ') and contains(concat(' ', @class, ' '), ' vcard ')]";
          var xpathExpression = "ancestor::*[.//address[contains(concat(' ', @class, ' '), ' author ') and contains(concat(' ', @class, ' '), ' vcard ')]][1]//address[contains(concat(' ', @class, ' '), ' author ') and contains(concat(' ', @class, ' '), ' vcard ')]";
        var xpathResult = mfnode.ownerDocument.evaluate(xpathExpression, mfnode, null,  XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        if (xpathResult.singleNodeValue) {
          return new hCard(xpathResult.singleNodeValue);
        }
      }
    },
    "bookmark" : {
      subproperties: {
        "link" : {
          virtual: true,
          datatype: "anyURI"
        },
        "text" : {
          virtual: true
        }
      },
      rel: true
    },
    "entry-title" : {
      virtual: true,
      virtualGetter: function(mfnode) {
          /*
  *  the first <h#> element in the Entry, or
  * the <title> of the page, if there is no enclosing Feed element, or
  * assume it is the empty string
  */
      }
    },
    "entry-content" : {
      plural: true
    },
    "entry-summary" : {
      plural: true
    },
    "published" : {
      datatype: "dateTime"
    },
    "updated" : {
      virtual: true,
      datatype: "dateTime",
      virtualGetter: function(mfnode) {
        return Microformats.parser.getMicroformatProperty(mfnode, "hAtom-hEntry", "published");
      }
    },
    "tag" : {
      rel: true,
      datatype: "microformat",
      microformat: "tag"
    }
  }
};

var hAtom_hFeed_definition = {
  mfVersion: 0.8,
  description: "Atom Feed(s)",
  mfObject: hFeed,
  className: "hfeed",
  alternateClassName: "hentry",
  properties: {
    "author" : {
      plural: true,
      datatype: "microformat",
      microformat: "hCard"
    },

    "tag" : {
      plural: true,
      rel: true,
      datatype: "custom",
      customGetter: function(propnode) {
        var tags = Microformats.getElementsByAttribute(propnode, "rel", "tag");
        var tagArray = [];
        var i;
        var xpathExpression = "ancestor::*[contains(concat(' ', @class, ' '), ' hentry ')]";
        for (i = 0; i < tags.length; i++) {
          var xpathResult = (propnode.ownerDocument || propnode).evaluate(xpathExpression, tags[i], null,  XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          if (xpathResult.singleNodeValue) {
            continue;
          } else {
            tagArray.push(tags[i]);
          }
        }
        if (tagArray.length > 0) {
          return tagArray;
        }
      }
    }
  }
};

Microformats.add("hAtom-hEntry", hAtom_hEntry_definition);
Microformats.add("hAtom-hFeed", hAtom_hFeed_definition);

var hatom_firefox_bookmark = {
  scope: {
    semantic: {
      "hAtom-hEntry" : "bookmark.link",
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    if (semanticObjectType == "hAtom-hEntry") {
      name = semanticObject['entry-title'];
      url = semanticObject.bookmark.link;
      SemanticActions.firefox_bookmark.bookmark(name, url);
      return true;
    }
  }
};

SemanticActions.add("firefox_bookmark", hatom_firefox_bookmark);

