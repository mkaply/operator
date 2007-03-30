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
        plural: true,
        datatype: "microformat",
        microformat: "hCalendar"
      },
      "summary" : {
      },
      /* This might be incorrect. I use contact before I use address with vcard */
      "contact" : {
        virtual: true,
        datatype: "microformat",
        microformat: "hCard",
        getter: function(mfnode) {
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
        getter: function(mfnode) {
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


Operator.microformatList.hResume = {
  description: "Resume(s)",
  icon: "chrome://operator/content/other.png"
};

