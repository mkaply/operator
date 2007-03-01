/*extern ufJSParser */

function GRDDL() {
}

ufJSParser.microformats.GRDDL = {
  version: "0.2",
  mfName: "GRDDL",
  mfObject: GRDDL,
  attributeName: "rel",
  attributeValues: ["transformation"],
  definition: {
    values: {
      "transformation" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          return "foo";
        }
      }
    },
    ufjs: {
      "ufjsDisplayName" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          if (mfnode.ownerDocument) {
            return mfnode.ownerDocument.title;
          } else {
            return mfnode.title;
          }
        }
      }
    }
  }
};
