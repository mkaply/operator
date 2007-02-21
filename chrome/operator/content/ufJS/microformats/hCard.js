/*extern ufJSParser */

function hCard() {
}

ufJSParser.microformats.hCard = {
  version: "0.2",
  mfName: "hCard",
  mfObject: hCard,
  className: "vcard",
  required: ["fn"],
  definition: {
    properties: {
      "adr" : {
        value: ["adr"],
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.createMicroformat(propnode, "Address");
        }
      },
      "agent" : {
        value: []
      },
      "bday" : {
        value: "",
        getter: function(propnode, mfnode, definition) {
          return definition.dateGetter(propnode);
        }
      },
      "class" : {
        value: ""
      },
      "category" : {
        value: [],
        getter: function(propnode, mfnode, definition) {
          if ((propnode.nodeName.toLowerCase() == "a") && (propnode.getAttribute("rel"))) {
            var tagname = ufJSParser.getMicroformatProperty(propnode, "tag", "tag");
            if (tagname) {
              return tagname;
            }
          }
          return definition.defaultGetter(propnode);
        }
      },
      "email" : {
        subproperties: {
          "type" : {
            value: [],
            types: ["internet", "x400", "pref"]
          },
          "value" : {
            value: "",
            virtual: true,
            getter: function(propnode, mfnode, definition) {
              if (propnode == mfnode) {
                return definition.emailGetter(mfnode);
              } else {
                return definition.emailGetter(propnode);
              }
            }
          }
        },
        value: [],
        getter: function(propnode, mfnode, definition) {
          var value = definition.emailGetter(propnode);
          return {"value" : value};
        }
      },
      "fn" : {
        value: "",
        required: true
      },
      "geo" : {
        value: "geo",
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.createMicroformat(propnode, "geo");
        }
      },
      "key" : {
        value: []
      },
      "label" : {
        value: []
      },
      "logo" : {
        value: [],
        getter: function(propnode, mfnode, definition) {
          return definition.urlGetter(propnode);
        }
      },
      "mailer" : {
        value: []
      },
      "n" : {
        subproperties: {
          "honorific-prefix" : {
            value: []
          },
          "given-name" : {
            value: ""
          },
          "additional-name" : {
            value: []
          },
          "family-name" : {
            value: ""
          },
          "honorific-suffix" : {
            value: []
          }
        },
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          var fn = ufJSParser.getMicroformatProperty(mfnode, "hCard", "fn");
          var orgs = ufJSParser.getMicroformatProperty(mfnode, "hCard", "org");
          var given_name;
          var family_name;
          if (fn && (!orgs || (orgs.length > 1) || (fn != orgs[0]["organization-name"]))) {
            var fns = fn.split(" ");
            if (fns.length === 2) {
              if (fns[0].charAt(fns[0].length-1) == ',') {
                given_name = fns[1];
                family_name = fns[0].substr(0, fns[0].length-1);
              } else if (fns[1].length == 1) {
                given_name = fns[1];
                family_name = fns[0];
              } else if ((fns[1].length == 2) && (fns[1].charAt(fns[1].length-1) == '.')) {
                given_name = fns[1];
                family_name = fns[0];
              } else {
                given_name = fns[0];
                family_name = fns[1];
              }
              return {"given-name" : given_name, "family-name" : family_name};
            }
          }
        }
      },
      "nickname" : {
        value: [],
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          if (propnode == mfnode ) {
            var fn = ufJSParser.getMicroformatProperty(mfnode, "hCard", "fn");
            var orgs = ufJSParser.getMicroformatProperty(mfnode, "hCard", "org");
            var given_name;
            var family_name;
            if (fn && (!orgs || (orgs.length) > 1 || (fn != orgs[0]["organization-name"]))) {
              var fns = fn.split(" ");
              if (fns.length === 1) {
                return [fns[0]];
              }
            }
            return;
          } else {
            return definition.defaultGetter(propnode);
          }
        }
      },
      "note" : {
        value: [],
        getter: function(propnode, mfnode, definition) {
          return propnode.innerHTML;
        }
      },
      "org" : {
        subproperties: {
          "organization-name" : {
            value: ""
          },
          "organization-unit" : {
            value: []
          }
        },
        value: [],
        getter: function(propnode, mfnode, definition) {
          return {"organization-name" : definition.defaultGetter(propnode)};
        }
      },
      "photo" : {
        value: [],
        getter: function(propnode, mfnode, definition) {
          return definition.urlGetter(propnode);
        }
      },
      "rev" : {
        value: "",
        getter: function(propnode, mfnode, definition) {
          return definition.dateGetter(propnode);
        }
      },
      "role" : {
        value: []
      },
      "sequence" : {
        value: ""
      },
      "sort-string" : {
        value: ""
      },
      "sound" : {
        value: []
      },
      "title" : {
        value: []
      },
      "tel" : {
        subproperties: {
          "type" : {
            value: [],
            types: ["msg", "home", "work", "pref", "voice", "fax", "cell", "video", "pager", "bbs", "car", "isdn", "pcs"]
          },
          "value" : {
            value: "",
            getter: function(subpropnode, propnode, definition) {
              var values = ufJSParser.getElementsByClassName(propnode, "value");
              var value = "";
              for (var i=0;i<values.length;i++) {
                value += values[i].textContent;
              }
              return value;
            }
          }
        },
        value: [],
        getter: function(propnode, mfnode, definition) {
          return {"value" : definition.defaultGetter(propnode)};
        }
      },
      "tz" : {
        value: ""
      },
      "uid" : {
        value: "",
        getter: function(propnode, mfnode, definition) {
          return definition.urlGetter(propnode);
        }
      },
      "url" : {
        value: [],
        getter: function(propnode, mfnode, definition) {
          return definition.urlGetter(propnode);
        }
      }
    },
    ufjs: {
      "ufjsDisplayName" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          if (mfnode.origNode) {
            var fns = ufJSParser.getElementsByClassName(mfnode.origNode, "fn");
            if (fns.length === 0) {
              var displayName = ufJSParser.getMicroformatProperty(mfnode, "hCard", "fn");
              if (displayName) {
                var org = ufJSParser.getMicroformatProperty(mfnode, "hCard", "org");
                if (org && org["organization-name"]) {
                  displayName += " (";
                  displayName += org["organization-name"];
                  displayName += ")";
                }  
                return displayName;
              }
            }
          }
          return ufJSParser.getMicroformatProperty(mfnode, "hCard", "fn");
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
    emailGetter: function(propnode) {
      if ((propnode.nodeName.toLowerCase() == "a") || (propnode.nodeName.toLowerCase() == "area")) {
        var mailto = propnode.href;
        if (mailto.indexOf('?') > 0) {
          return mailto.substring("mailto:".length, mailto.indexOf('?'));
        } else {
          return mailto.substring("mailto:".length);
        }
      } else {
        return this.defaultGetter(propnode);
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
  },
  validate: function(node, error) {
    var displayName = ufJSParser.getMicroformatProperty(node, "hCard", "fn");
    if (!displayName) {
      if (error) {
        error.message = "No fn specified";
      }
      return false;
    }
    return true;
  }
};
