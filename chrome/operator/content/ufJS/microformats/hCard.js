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
        value: [],
        datatype: "microformat",
        microformat: "Address"
      },
      "agent" : {
        value: []
      },
      "bday" : {
        value: "",
        datatype: "dateTime"
      },
      "class" : {
        value: ""
      },
      "category" : {
        value: [],
        datatype: "microformat",
        microformat: "tag",
        microformat_property: "tag"
      },
      "email" : {
        subproperties: {
          "type" : {
            value: [],
            types: ["internet", "x400", "pref"]
          },
          "value" : {
            value: "",
            datatype: "email",
            virtual: true
          }
        },
        value: []   
      },
      "fn" : {
        value: "",
        required: true
      },
      "geo" : {
        value: "geo",
        datatype: "microformat",
        microformat: "geo"
      },
      "key" : {
        value: []
      },
      "label" : {
        value: []
      },
      "logo" : {
        value: [],
        datatype: "anyURI"
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
        /*  Implied "n" Optimization */
        /* http://microformats.org/wiki/hcard#Implied_.22n.22_Optimization */
        getter: function(mfnode) {
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
        /* Implied "nickname" Optimization */
        /* http://microformats.org/wiki/hcard#Implied_.22nickname.22_Optimization */
        getter: function(mfnode) {
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
        value: [],
        datatype: "HTML"
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
        implied: "organization-name"
      },
      "photo" : {
        value: [],
        datatype: "anyURI"
      },
      "rev" : {
        value: "",
        datatype: "dateTime"
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
            value: ""
          }
        },
        value: [],
        implied: "value"
      },
      "tz" : {
        value: ""
      },
      "uid" : {
        value: "",
        datatype: "anyURI"
      },
      "url" : {
        value: [],
        datatype: "anyURI"
      }
    },
    ufjs: {
      "ufjsDisplayName" : {
        value: "",
        virtual: true,
        getter: function(mfnode) {
          if (mfnode.origNode) {
            /* If this microformat has an include pattern, put the */
            /* organization-name in parenthesis after the fn to differentiate */
            /* them. */
            var fns = ufJSParser.getElementsByClassName(mfnode.origNode, "fn");
            if (fns.length === 0) {
              var displayName = ufJSParser.getMicroformatProperty(mfnode, "hCard", "fn");
              if (displayName) {
                var org = ufJSParser.getMicroformatProperty(mfnode, "hCard", "org");
                if (org && org[0]["organization-name"]) {
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
