function hResume() {
}

ufJSParser.microformats.hResume = {
  version: "0.7.1",
  description: "Resume(s)",
  mfObject: hResume,
  className: "hresume",
  required: ["contact"],
  definition: {
    properties: {
      "affiliation" : {
        plural: true,
        datatype: "microformat",
        microformat: "hCard"
      },
      "education" : {
        plural: true,
        datatype: "microformat",
        microformat: "hCalendar"
      },
      "experience" : {
  /* These must be handled explicity by the experience getter because of
     the possibility of vcard
        subproperties: {
          "vcard" : {
            datatype: "microformat",
            microformat: "hCard"
          },
        },
        datatype: "microformat",
        microformat: "hCalendar"
  */
        datatype: "custom",
        customGetter: function(propnode) {
          var experience = ufJSParser.createMicroformat(propnode, "hCalendar");
          var vcardnode;
          if (propnode.className.match("(^|\\s)" + "vcard" + "(\\s|$)")) {
            vcardnode = propnode;
          } else {
            var vcards = ufJSParser.getElementsByClassName(propnode, "vcard");
            if (vcards.length > 0) {
              vcardnode = vcards[0];
            }
          }
          if (vcardnode && experience) {
            experience.vcard = ufJSParser.createMicroformat(vcardnode, "hCard");
          }
          return experience;
        },
        plural: true,
      },
      "summary" : {
      },
      /* This might be incorrect. I use contact before I use address with vcard */
      "contact" : {
        virtual: true,
        datatype: "microformat",
        microformat: "hCard",
        virtualGetter: function(mfnode) {
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
        }
      }
    },
    ufjs: {
      "ufjsDisplayName" : {
        virtual: true,
        virtualGetter: function(mfnode) {
          return ufJSParser.getMicroformatProperty(mfnode, "hResume", "contact.fn");
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

