if (Components.utils.import) {
  try {
    Components.utils.import("rel:Microformats.js");
    EXPORTED_SYMBOLS = ["hCard"];
  } catch (ex) {}
}

function hCard(node) {
  if (node) {
    Microformats.parser.newMicroformat(this, node, "hCard");
  }
}
hCard.prototype.toString = function() {
  if (this.resolvedNode) {
    /* If this microformat has an include pattern, put the */
    /* organization-name in parenthesis after the fn to differentiate */
    /* them. */
    var fns = Microformats.getElementsByClassName(this.node, "fn");
    if (fns.length === 0) {
      if (this.fn) {
        if (this.org[0]["organization-name"] && (this.fn != this.org[0]["organization-name"])) {
          return this.fn + " (" + this.org[0]["organization-name"] + ")";
        }
      }
    }
  }
  return this.fn;
}

var hCard_definition = {
  version: "0.7",
  mfObject: hCard,
  className: "vcard",
  required: ["fn"],
  properties: {
    "adr" : {
      plural: true,
      datatype: "microformat",
      microformat: "Address"
    },
    "agent" : {
      plural: true
    },
    "bday" : {
      datatype: "dateTime"
    },
    "class" : {},
    "category" : {
      plural: true,
      datatype: "microformat",
      microformat: "tag",
      microformat_property: "tag"
    },
    "email" : {
      subproperties: {
        "type" : {
          plural: true,
          types: ["internet", "x400", "pref"]
        },
        "value" : {
          datatype: "email",
          virtual: true
        }
      },
      plural: true   
    },
    "fn" : {
      required: true
    },
    "geo" : {
      value: "geo",
      datatype: "microformat",
      microformat: "geo"
    },
    "key" : {
      plural: true
    },
    "label" : {
      plural: true
    },
    "logo" : {
      plural: true,
      datatype: "anyURI"
    },
    "mailer" : {
      plural: true
    },
    "n" : {
      subproperties: {
        "honorific-prefix" : {
          plural: true
        },
        "given-name" : {
        },
        "additional-name" : {
          plural: true
        },
        "family-name" : {
        },
        "honorific-suffix" : {
          plural: true
        }
      },
      virtual: true,
      /*  Implied "n" Optimization */
      /* http://microformats.org/wiki/hcard#Implied_.22n.22_Optimization */
      virtualGetter: function(mfnode) {
        var fn = Microformats.parser.getMicroformatProperty(mfnode, "hCard", "fn");
        var orgs = Microformats.parser.getMicroformatProperty(mfnode, "hCard", "org");
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
      plural: true,
      virtual: true,
      /* Implied "nickname" Optimization */
      /* http://microformats.org/wiki/hcard#Implied_.22nickname.22_Optimization */
      virtualGetter: function(mfnode) {
        var fn = Microformats.parser.getMicroformatProperty(mfnode, "hCard", "fn");
        var orgs = Microformats.parser.getMicroformatProperty(mfnode, "hCard", "org");
        var given_name;
        var family_name;
        if (fn && (!orgs || (orgs.length) > 1 || (fn != orgs[0]["organization-name"]))) {
          var fns = fn.split(" ");
          if (fns.length === 1) {
            return [fns[0]];
          }
        }
        return;
      }
    },
    "note" : {
      plural: true,
      datatype: "HTML"
    },
    "org" : {
      subproperties: {
        "organization-name" : {
        },
        "organization-unit" : {
          plural: true
        }
      },
      plural: true,
      implied: "organization-name"
    },
    "photo" : {
      plural: true,
      datatype: "anyURI"
    },
    "rev" : {
      datatype: "dateTime"
    },
    "role" : {
      plural: true
    },
    "sequence" : {
    },
    "sort-string" : {
    },
    "sound" : {
      plural: true
    },
    "title" : {
      plural: true
    },
    "tel" : {
      subproperties: {
        "type" : {
          plural: true,
          types: ["msg", "home", "work", "pref", "voice", "fax", "cell", "video", "pager", "bbs", "car", "isdn", "pcs"]
        },
        "value" : {
        }
      },
      plural: true,
      implied: "value"
    },
    "tz" : {
    },
    "uid" : {
      datatype: "anyURI"
    },
    "url" : {
      plural: true,
      datatype: "anyURI"
    }
  }
};

Microformats.add("hCard", hCard_definition);
