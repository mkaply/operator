if (Components.utils.import) {
  try {
    Components.utils.import("rel:Microformats.js");
    var EXPORTED_SYMBOLS = ["hResume"];
  } catch (ex) {}
}

function hResume(node) {
  if (node) {
    Microformats.parser.newMicroformat(this, node, "hResume");
  }
}
hResume.prototype.toString = function() {
  if (this.contact) {
    return this.contact.fn;
  }
}

var hResume_definition = {
  mfVersion: 0.8,
  description: "Resume(s)",
  mfObject: hResume,
  className: "hresume",
  required: ["contact"],
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
      datatype: "microformat",
      microformat: "hCalendar",
      plural: true
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
        var vcards = Microformats.getElementsByClassName(mfnode, "vcard");
        if (vcards.length > 0) {
          var i;
          var noAffiliation = -1;
          for (var i =0; i < vcards.length; i++) {
            if (vcards[i].nodeName.toLowerCase() == "address") {
              return new hCard(vcards[i]);
            } else {
              if (noAffiliation < 0) {
                if (!vcards[i].className.match("(^|\\s)" + "affiliation" + "(\\s|$)")) {
                  noAffiliation = i;
                }
              }
            }
          }
          if (noAffiliation >= 0) {
            return new hCard(vcards[noAffiliation]);
          }
        }
      }
    }
  }
};

Microformats.add("hResume", hResume_definition);

var hresume_firefox_bookmark = {
  scope: {
    semantic: {
      "hResume" : "hResume",
    }
  }
};

var hresume_google_search = {
  scope: {
    semantic: {
      "hResume" : "contact.fn"
    }
  }
};

var hresume_yahoo_search = {
  scope: {
    semantic: {
      "hResume" : "contact.fn"
    }
  }
};

SemanticActions.add("firefox_bookmark", hresume_firefox_bookmark);
SemanticActions.add("google_search", hresume_google_search);
SemanticActions.add("yahoo_search", hresume_yahoo_search);

