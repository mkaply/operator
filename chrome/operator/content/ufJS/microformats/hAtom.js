/*extern ufJSParser */

function hAtom() {
}

ufJSParser.microformats.hAtom = {
  version: "0.2",
  mfName: "hAtom",
  mfObject: hAtom,
  className: "hfeed",
  alternateClass: "hentry",
  children: "hentry",
  required: ["entry-title", "updated"],
  definition: {
    properties: {
      "hentry": {
        subproperties: {
          "author" : {
            value: [],
            getter: function(propnode, mfnode, definition) {
              return ufJSParser.createMicroformat(propnode, "hCard");
            }
          },
          "bookmark" : {
            value: "",
            rel: true,
            getter: function(propnode, mfnode, definition) {
              return ufJSParser.createMicroformat(propnode, "bookmark");
            }
          },
          "entry-title" : {
            value: "",
          },
          "entry-content" : {
            value: [],
          },
          "entry-summary" : {
            value: [],
          },
          "published" : {
            value: "",
          },
          "updated" : {
            value: "",
          },
          "tag" : {
            value: "",
            rel: true,
            getter: function(propnode, mfnode, definition) {
              return ufJSParser.createMicroformat(propnode, "tag");
            }
          }
        },
        value: [],
        ufjs: {
          "ufjsChildDisplayName" : {
            value: "",
            virtual: true,
            getter: function(propnode, mfnode, definition) {
              return ufJSParser.getMicroformatProperty(mfnode, "hAtom", "entry-title");
            }
          }
        }
      },
      "tag" : {
        value: [],
        rel: true,
        getter: function(propnode, mfnode, definition) {
          var tags = ufJSParser.getElementsByAttribute(mfnode, "rel", "tag");
          var tagArray = [];
          var i;
          var xpathExpression = "ancestor::*[contains(concat(' ', @class, ' '), ' hentry ')]";
          var docforxpath;
          if (!mfnode.ownerDocument) {
            docforxpath = mfnode;
          } else {
            docforxpath = mfnode.ownerDocument;
          }
          for (i = 0; i < tags.length; i++) {
            var xpathResult = docforxpath.evaluate(xpathExpression, tags[i], null,  XPathResult.FIRST_ORDERED_NODE_TYPE, null);
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
    values: {
      "text" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          if (!mfnode.ownerDocument) {
            return mfnode.title;
          } else {
            return mfnode.ownerDocument.title;
          }
        }
      }
    },
    ufjs: {
      "ufjsDisplayName" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.getMicroformatProperty(mfnode, "hAtom", "text");
        }
      }
    },
    defaultGetter: function(propnode) {
      if ((propnode.nodeName.toLowerCase() == "abbr") && (propnode.getAttribute("title"))) {
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

