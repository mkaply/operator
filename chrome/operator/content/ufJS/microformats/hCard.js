function hCard() {
}

ufJSParser.microformats.hCard = {
  version: "0.7",
  mfObject: hCard,
  className: "vcard",
  required: ["fn"],
  definition: {
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
        plural: true,
        virtual: true,
        /* Implied "nickname" Optimization */
        /* http://microformats.org/wiki/hcard#Implied_.22nickname.22_Optimization */
        virtualGetter: function(mfnode) {
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
    },
    ufjs: {
      "ufjsDisplayName" : {
        virtual: true,
        virtualGetter: function(mfnode) {
          if (mfnode.origNode) {
            /* If this microformat has an include pattern, put the */
            /* organization-name in parenthesis after the fn to differentiate */
            /* them. */
            var fns = ufJSParser.getElementsByClassName(mfnode.origNode, "fn");
            if (fns.length === 0) {
              var displayName = ufJSParser.getMicroformatProperty(mfnode, "hCard", "fn");
              if (displayName) {
                var org = ufJSParser.getMicroformatProperty(mfnode, "hCard", "org");
                if (org && org[0]["organization-name"] && (displayName != org[0]["organization-name"])) {
                  displayName += " (";
                  displayName += org[0]["organization-name"];
                  displayName += ")";
                }  
                return displayName;
              }
            }
          }
          return ufJSParser.getMicroformatProperty(mfnode, "hCard", "fn");
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
