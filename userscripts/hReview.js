if (Components.utils.imort) {
  try {
    Components.utils.import("resource://gre/modules/Microformats.js");
    var EXPORTED_SYMBOLS = ["hReview"];
  } catch (ex) {}
}

function hReview(node) {
  if (node) {
    if (Components && Components.utils.import) {
      Components.utils.import("resource://gre/modules/Microformats.js");
    }
    Microformats.parser.newMicroformat(this, node, "hReview");
  }
}

hReview.prototype.toString = function() {
  var fn;
  if (this.item) {
    if (this.item.summary) {
      fn = this.item.summary
    } else if (this.item.fn) {
      fn = this.item.fn;
    }
    if (this.reviewer) {
      if (this.reviewer.fn) {
        return fn + " (" + this.reviewer.fn + ")";
      } else {
        return fn + " (" + this.reviewer + ")";
      }
    } else {
      return fn;
    }
  }
  return null;
}

var hReview_definition = {
  mfVersion: 0.8,
  description: "Review(s)",
  mfObject: hReview,
  className: "hreview",
  required: ["item"],
  properties: {
    "dtreviewed" : {
      datatype: "dateTime"
    },
    "description" : {
    },
    "item" : {
/* These must be handled explicity by the item getter because of
   the different types of data that could be in the item
      subproperties: {
        "fn" : {
        },
        "url" : {
          }
        }
        "photo" : {
          }
        }
      },
*/
      datatype: "custom",
      customGetter: function(propnode) {
        var item;
        if (propnode.className.match("(^|\\s)" + "vcard" + "(\\s|$)")) {
          item = new hCard(propnode);
        } else if (propnode.className.match("(^|\\s)" + "vevent" + "(\\s|$)")) {
          item = new hCalendar(propnode);
        } else {
          item = {};
          var fns = Microformats.getElementsByClassName(propnode, "fn");
          if (fns.length > 0) {
            item.fn = Microformats.parser.defaultGetter(fns[0]);
          }
          var urls = Microformats.getElementsByClassName(propnode, "url");
          if (urls.length > 0) {
            item.url = Microformats.parser.uriGetter(urls[0]);
          }
          var photos = Microformats.getElementsByClassName(propnode, "photo");
          if (photos.length > 0) {
            item.photo = Microformats.parser.uriGetter(photos[0]);
          }
        }
        /* Only return item if it has stuff in it */
        for (var i in item) {
          return item;
        }
        return null;
      }
    },
    "rating" : {
      datatype: "float"
    },
    "best" : {
      datatype: "float"
    },
    "worst" : {
      datatype: "float"
    },
    "reviewer" : {
      datatype: "microformat",
      microformat: "hCard"
    },
    "summary" : {
    },
    "type" : {
      types: ["product", "business", "event", "person", "place", "website", "url"]
    },
    "tag" : {
      plural: true,
      rel: true,
      datatype: "microformat",
      microformat: "tag"
    },
    "version" : {
    }
  },
  validate: function(node, error) {
    var errormsg;
    var item = Microformats.parser.getMicroformatProperty(node, "hReview", "item");
    if (item) {
      if (item instanceof hCard) {
        if (!item.fn) {
          errormsg =  "No fn specified on the hCard for the item";
        }
      } else if (!(item instanceof hCalendar)) {
        if (!item.fn) {
          /* This is a common error case, so I'd like to report it */
          var items = Microformats.getElementsByClassName(node, "item");
          if (items[0].className.match("fn")) {
            errormsg = "fn should be a child of item";
          }
          errormsg = "No fn specified on the item";
        }
      }
    } else {
      var items = Microformats.getElementsByClassName(node, "item");
      if (items.length > 0) {
        if (items[0].className.match("fn")) {
          errormsg = "fn should be a child of item";
        } else {
          errormsg = "No fn specified on the item";
        }
      } else {
        errormsg = "No item specified";
      }
    }
    if (errormsg) {
      if (error) {
        error.message = errormsg;
      }
      return false;
    }
    return true;
  }
};

Microformats.add("hReview", hReview_definition);

var hreview_firefox_bookmark = {
  scope: {
    semantic: {
      "hReview" : "hReview",
    }
  }
};

var hreview_google_search = {
  scope: {
    semantic: {
      "hReview" : "item.fn"
    }
  }
};

var hreview_yahoo_search = {
  scope: {
    semantic: {
      "hReview" : "item.fn"
    }
  }
};

SemanticActions.add("firefox_bookmark", hreview_firefox_bookmark);
SemanticActions.add("google_search", hreview_google_search);
SemanticActions.add("yahoo_search", hreview_yahoo_search);

