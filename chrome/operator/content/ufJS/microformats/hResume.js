/*extern ufJSParser */

function hResume() {
}

ufJSParser.microformats.hResume = {
  version: "0.2",
  mfName: "hResume",
  mfObject: hResume,
  className: "hresume",
  required: ["contact"],
  definition: {
    properties: {
      "affiliation" : {
        value: [],
        getter: function(propnode, mfnode, definition) {
          if (propnode.className.match("(^|\\s)" + "vcard" + "(\\s|$)")) {
            return ufJSParser.createMicroformat(propnode, "hCard");
          } else {
            return definition.defaultGetter(propnode);
          }
        }
      },
      "education" : {
        value: [],
        getter: function(propnode, mfnode, definition) {
          if (propnode.className.match("(^|\\s)" + "vevent" + "(\\s|$)")) {
            return ufJSParser.createMicroformat(propnode, "hCalendar");
          } else {
            return definition.defaultGetter(propnode);
          }
        }
      },
      "experience" : {
        value: [],
        getter: function(propnode, mfnode, definition) {
          if (propnode.className.match("(^|\\s)" + "vevent" + "(\\s|$)")) {
            return ufJSParser.createMicroformat(propnode, "hCalendar");
          } else {
            return definition.defaultGetter(propnode);
          }
        }
      },
      "summary" : {
        value: ""
      },
      /* This might be incorrect. I use contact before I use address with vcard */
      "contact" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          if (propnode == mfnode) {
            /* We didn't find a contact, so use the first vcard */
            var vcards = ufJSParser.getElementsByClassName(mfnode, "vcard");
            if (vcards.length > 0) {
              var i;
              var noAffiliation = -1;
              for (i in vcards) {
                if (vcards[i].nodeName.toLowerCase() == "address") {
                  return ufJSParser.createMicroformat(vcards[i], "hCard");
                } else {
                  if (noAffiliation < 0) {
                    if (!vcards[i].className.match("(^|\\s)" + "affiliation" + "(\\s|$)")) {
                      noAffiliation = i;
                    }
                  }
                }
              }
              if (noAffiliation >= 0) {
                return ufJSParser.createMicroformat(vcards[noAffiliation], "hCard");
              }
            }
          } else {
            return ufJSParser.createMicroformat(propnode, "hCard");
          }
        }
      }
    },
    ufjs: {
      "ufjsDisplayName" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          var contact = ufJSParser.getMicroformatProperty(mfnode, "hResume", "contact");
          if (contact) {
            return contact.fn;
          }
        }
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
    var contact = ufJSParser.getMicroformatProperty(node, "hResume", "contact");
    if (!contact) {
      if (error) {
        error.message = "No contact vcard specified";
      }
      return false;
    }
    return true;
  }
};

