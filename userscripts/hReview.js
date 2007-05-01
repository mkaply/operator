function hReview(node) {
  if (node) {
    ufJSParser.newMicroformat(this, node, "hReview");
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
}

ufJSParser.microformats.hReview = {
  version: "0.7.1",
  description: "Review(s)",
  mfObject: hReview,
  className: "hreview",
  required: ["item"],
  definition: {
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
            item = ufJSParser.createMicroformat(propnode, "hCard");
          } else if (propnode.className.match("(^|\\s)" + "vevent" + "(\\s|$)")) {
            item = ufJSParser.createMicroformat(propnode, "hCalendar");
          } else {
            item = {};
            var fns = ufJSParser.getElementsByClassName(propnode, "fn");
            if (fns.length > 0) {
              item.fn = ufJSParser.defaultGetter(fns[0]);
            }
            var urls = ufJSParser.getElementsByClassName(propnode, "url");
            if (urls.length > 0) {
              item.url = ufJSParser.uriGetter(urls[0]);
            }
            var photos = ufJSParser.getElementsByClassName(propnode, "photo");
            if (photos.length > 0) {
              item.photo = ufJSParser.uriGetter(photos[0]);
            }
          }
          /* Only return item if it has stuff in it */
          for (var i in item) {
            return item;
          }
          return;
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
      } else if (!(item instanceof hCalendar)) {
        if (!item.fn) {
          /* This is a common error case, so I'd like to report it */
          var items = ufJSParser.getElementsByClassName(node, "item");
          if (items[0].className.match("fn")) {
            errormsg = "fn should be a child of item";
          }
          errormsg = "No fn specified on the item";
        }
      }
    } else {
      var items = ufJSParser.getElementsByClassName(node, "item");
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
    } else {
      return true;
    }
  }
};

