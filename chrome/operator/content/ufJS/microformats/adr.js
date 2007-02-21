/*extern ufJSParser */

function Address() {
}

ufJSParser.microformats.Address = {
  version: "0.2",
  mfName: "Address",
  mfObject: Address,
  className: "adr",
  definition: {
    properties: {
      "type" : {
        value: [],
        types: ["work", "home", "pref", "postal", "dom", "intl", "parcel"]
      },
      "post-office-box" : {
        value: ""
      },
      "street-address" : {
        value: []
      },
      "extended-address" : {
        value: ""
      },
      "region" : {
        value: ""
      },
      "locality" : {
        value: ""
      },
      "postal-code" : {
        value: ""
      },
      "country-name" : {
        value: ""
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
  }
};
