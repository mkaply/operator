/*extern ufJSParser */

function species() {
}

ufJSParser.microformats.species = {
  version: "0.2",
  mfName: "species",
  mfObject: species,
  className: "biota",
  definition: {
    properties: {
      "domain" : {
        value: ""
      },
      "kingdom" : {
        value: ""
      },
      "subkingdom" : {
        value: ""
      },
      "superphylum" : {
        value: ""
      },
      "vernacular" : {
        value: ""
      },
      "binomial" : {
        value: ""
      }
    },
    ufjs: {
      "ufjsDisplayName" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.getMicroformatProperty(mfnode, "species", "vernacular");
        }
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
