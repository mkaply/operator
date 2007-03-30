/*extern ufJSParser */
/* hAtom is kind of strange. I decided to separate it in to hFeed and hEntry */

function hFeed() {
}

function hEntry() {
}

ufJSParser.microformats["hAtom-hEntry"] = {
  version: "0.2",
  mfName: "hAtom-hEntry",
  mfObject: hEntry,
  className: "hentry",
  definition: {
    properties: {
      "author" : {
        plural: true,
        virtual: true,
        virtualGetter: function(propnode, mfnode, definition) {
          if (propnode == mfnode) {
            /* Virtual case */
            /* FIXME - THIS IS FIREFOX SPECIFIC */
            /* check if ancestor is an address with author  */
//            var xpathExpression = "ancestor::*//address[contains(concat(' ', @class, ' '), ' author ') and contains(concat(' ', @class, ' '), ' vcard ')]";
              var xpathExpression = "ancestor::*[.//address[contains(concat(' ', @class, ' '), ' author ') and contains(concat(' ', @class, ' '), ' vcard ')]][1]//address[contains(concat(' ', @class, ' '), ' author ') and contains(concat(' ', @class, ' '), ' vcard ')]";
            var xpathResult = mfnode.ownerDocument.evaluate(xpathExpression, mfnode, null,  XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            if (xpathResult.singleNodeValue) {
              return ufJSParser.createMicroformat(xpathResult.singleNodeValue, "hCard");
            }
          } else {
            return ufJSParser.createMicroformat(propnode, "hCard");
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
        virtualGetter: function(propnode, mfnode, definition) {
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
        virtualGetter: function(propnode, mfnode, definition) {
          return ufJSParser.getMicroformatProperty(mfnode, "hAtom-hEntry", "published");
        }
      },
      "tag" : {
        rel: true,
        datatype: "microformat",
        microformat: "tag"
      }
    },
    ufjs: {
      "ufjsDisplayName" : {
        virtual: true,
        virtualGetter: function(propnode, mfnode, definition) {
          /* NEEDS MORE WORK */
          return ufJSParser.getMicroformatProperty(mfnode, "hAtom-hEntry", "entry-title");
        }
      }
    }
  }
};

ufJSParser.microformats["hAtom-hFeed"] = {
  version: "0.2",
  mfName: "hAtom-Feed",
  mfObject: hFeed,
  className: "hfeed",
  alternateClassName: "hentry",
  definition: {
    properties: {
      "author" : {
        cardinality: "plural",
        datatype: "microformat",
        microformat: "hCard"
      },

      "tag" : {
        cardinality: "plural",
        rel: true,
        datatype: "custom",
        customGetter: function(propnode, mfnode, definition) {
          var tags = ufJSParser.getElementsByAttribute(mfnode, "rel", "tag");
          var tagArray = [];
          var i;
          var xpathExpression = "ancestor::*[contains(concat(' ', @class, ' '), ' hentry ')]";
          for (i = 0; i < tags.length; i++) {
            var xpathResult = (mfnode.ownerDocument || mfnode).evaluate(xpathExpression, tags[i], null,  XPathResult.FIRST_ORDERED_NODE_TYPE, null);
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

    },
    cardinality: "plural",
    ufjs: {
      "ufjsDisplayName" : {
        cardinality: "singular",
        virtual: true,
        getter: function(propnode, mfnode) {
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


Operator.microformatList["hAtom-hEntry"] = {
  description: "Atom Entry",
  icon: "chrome://operator/content/other.png"
};

Operator.microformatList["hAtom-hFeed"] = {
  description: "Atom Feed",
  icon: "chrome://operator/content/other.png"
};


