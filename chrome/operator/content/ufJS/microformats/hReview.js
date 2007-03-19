/*extern ufJSParser, hCard */

function hReview() {
}

ufJSParser.microformats.hReview = {
  version: "0.2",
  mfName: "hReview",
  mfObject: hReview,
  className: "hreview",
  required: ["item","item.fn"],
  definition: {
    properties: {
      "dtreviewed" : {
        value: "",
        getter: function(propnode, mfnode, definition) {
          return definition.dateGetter(propnode);
        }
      },
      "description" : {
        value: ""
      },
      "item" : {
  /* These must be handled explicity by the item getter because of
     the different types of data that could be in the item
        subproperties: {
          "fn" : {
            value: ""
          },
          "url" : {
            value: "",
            }
          }
          "photo" : {
            value: "",
            }
          }
        },
  */
        value: "",
        getter: function(propnode, mfnode, definition) {
          var item;
          if (propnode.className.match("(^|\\s)" + "vcard" + "(\\s|$)")) {
            item = ufJSParser.createMicroformat(propnode, "hCard");
          } else if (propnode.className.match("(^|\\s)" + "vevent" + "(\\s|$)")) {
            item = ufJSParser.createMicroformat(propnode, "hCard");
          } else {
            item = {};
          }
          if (!item.fn) {
            var fns = ufJSParser.getElementsByClassName(propnode, "fn");
            if (fns.length > 0) {
              item.fn = definition.defaultGetter(fns[0]);
            } else {
              /* If it is an hcalendar, get the summary */
              if (item.summary) {
                item.fn = item.summary;
              }
            }
          }
          if (!item.url) {
            var urls = ufJSParser.getElementsByClassName(propnode, "url");
            if (urls.length > 0) {
              item.url = definition.urlGetter(urls[0]);
            }
          }
          if (!item.photo) {
            var photos = ufJSParser.getElementsByClassName(propnode, "photo");
            if (photos.length > 0) {
              item.photo = definition.urlGetter(photos[0]);
            }
          }
          var i;
          /* Only return item if it has stuff in it */
          for (i in item) {
            return item;
          }
          return;
        }
      },
      "rating" : {
        value: "",
        getter: function(propnode, mfnode, definition) {
          return parseFloat(definition.defaultGetter(propnode));
        }
      },
      "best" : {
        value: "",
        getter: function(propnode, mfnode, definition) {
          return parseFloat(definition.defaultGetter(propnode));
        }
      },
      "worst" : {
        value: "",
        getter: function(propnode, mfnode, definition) {
          return parseFloat(definition.defaultGetter(propnode));
        }
      },
      "reviewer" : {
        value: "",
        getter: function(propnode, mfnode, definition) {
          if (propnode.className.match("(^|\\s)" + "vcard" + "(\\s|$)")) {
            return ufJSParser.createMicroformat(propnode, "hCard");
          } else {
            return definition.defaultGetter(propnode);
          }
        }
      },
      "summary" : {
        value: ""
      },
      "type" : {
        value: "",
        types: ["product", "business", "event", "person", "place", "website", "url"]
      },
      "tag" : {
        value: [],
        rel: true,
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.createMicroformat(propnode, "tag");
        }
      },
      "version" : {
        value: ""
      }
    },
    ufjs: {
      "ufjsDisplayName" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          var item = ufJSParser.getMicroformatProperty(mfnode, "hReview", "item");
          var reviewer = ufJSParser.getMicroformatProperty(mfnode, "hReview", "reviewer");

          if (item && item.fn) {
            if (reviewer) {
              if (reviewer.fn) {
                return item.fn + " (" + reviewer.fn + ")";
              } else {
                return item.fn + " (" + reviewer + ")";
              }
            } else {
              return item.fn;
            }
          }
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
    },
    urlGetter: function(propnode) {
      if (propnode.nodeName.toLowerCase() == "a") {
        return propnode.href;
      } else if (propnode.nodeName.toLowerCase() == "img") {
        return propnode.src;
      } else if (propnode.nodeName.toLowerCase() == "object") {
        return propnode.data;
      } else if (propnode.nodeName.toLowerCase() == "area") {
        return propnode.href;
      } else {
        return this.defaultGetter(propnode);
      }
    },
    defaultGetter: function(propnode) {
      if (((propnode.nodeName.toLowerCase() == "abbr") || (propnode.nodeName.toLowerCase() == "html:abbr")) && (propnode.getAttribute("title"))) {
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
  },
  validate: function(node, error) {
    var errormsg;
    var item = ufJSParser.getMicroformatProperty(node, "hReview", "item");
    if (item) {
      if (item instanceof hCard) {
        if (!item.fn) {
          errormsg =  "No fn specified on the hCard for the item";
        }
      } else if (!item.fn) {
        /* This is a common error case, so I'd like to report it */
        var items = ufJSParser.getElementsByClassName(node, "item");
        if (items[0].className.match("fn")) {
          errormsg = "fn should be a child of item";
        }
        errormsg = "No fn specified on the item";
      }
    } else {
      errormsg = "No item specified";
    }
    if (errormsg) {
      if (error) {
        error.message = errormsg;
      }
      return false;
    } else {
      return true;
    }
  }
};

