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
        value: [],
        virtual: true,
        getter: function(propnode, mfnode, definition) {
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
        value: "",
        rel: true,
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.createMicroformat(propnode, "bookmark");
        }
      },
      "entry-title" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          if (propnode == mfnode) {
            /*
    *  the first <h#> element in the Entry, or
    * the <title> of the page, if there is no enclosing Feed element, or
    * assume it is the empty string
    */
          } else {
            return definition.defaultGetter(propnode);
          }
         
        }
      },
      "entry-content" : {
        value: []
      },
      "entry-summary" : {
        value: []
      },
      "published" : {
        value: "",
        getter: function(propnode, mfnode, definition) {
          return definition.dateGetter(propnode);
        }
      },
      "updated" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          if (propnode == mfnode) {
            return ufJSParser.getMicroformatProperty(mfnode, "hAtom-hEntry", "published");
          } else {
            return definition.dateGetter(propnode);
          }
        }
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
      "ufjsDisplayName" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          /* NEEDS MORE WORK */
          return ufJSParser.getMicroformatProperty(mfnode, "hAtom-hEntry", "entry-title");
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
    },
    dateGetter: function(propnode) {
      var date = this.defaultGetter(propnode);
      if (date.indexOf('-') == -1) {
        var newdate = "";
        var i;
        for (i=0;i<date.length;i++) {
          newdate += date.charAt(i);
          if ((i == 3) || (i == 5)) {
            newdate += "-";
          }
          if ((i == 10) || (i == 12)) {
            newdate += ":";
          }
        }
        date = newdate;
      }
      return date;
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
        value: [],
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.createMicroformat(propnode, "hCard");
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
    value: [],
    ufjs: {
      "ufjsDisplayName" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          if (mfnode.ownerDocument) {
            return mfnode.ownerDocument.title;
          } else {
            return mfnode.title;
          }
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
