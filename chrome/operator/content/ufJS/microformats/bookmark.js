/*extern ufJSParser */

function bookmark() {
}

ufJSParser.microformats.bookmark = {
  version: "0.2",
  mfName: "rel-bookmark",
  mfObject: bookmark,
  attributeName: "rel",
  attributeValues: ["bookmark"],
  definition: {
    values: {
      "link" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return mfnode.href;
        }
      },
      "text" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          var s;
          if (propnode.innerText) {
            s = propnode.innerText;
          } else {
            s = propnode.textContent;
          }
          return ufJSParser.trim(s);
        }
      }
    },
    ufjs: {
      "ufjsDisplayName" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return ufJSParser.getMicroformatProperty(mfnode, "bookmark", "text");
        }
      }
    }
  }
};
