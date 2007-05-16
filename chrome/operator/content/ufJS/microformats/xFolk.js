if (Operator.useLoader) {
  try {
    Components.utils.import("rel:Microformats.js");
    EXPORTED_SYMBOLS = ["xFolk"];
  } catch (ex) {}
}

function xFolk(node) {
  if (node) {
    Microformats.parser.newMicroformat(this, node, "xFolk");
  }
}
xFolk.prototype.toString = function() {
  if (this.taggedlink) {
    return this.taggedlink.title;
  }
}

var xFolk_definition = {
  version: "0.7",
  mfObject: xFolk,
  className: "xfolkentry",
  required: ["taggedlink"],
  properties: {
    "description" : {
      plural: true
    },
    "taggedlink" : {
      subproperties: {
        "title" : {
          virtual: true,
          virtualGetter: function(parentnode) {
            if (parentnode.getAttribute("title")) {
              return parentnode.getAttribute("title");
            } else {
              return Microformats.parser.defaultGetter(parentnode);
            }
          }
        },
        "link" : {
          datatype: "anyURI",
          virtual: true
        }
      },
    },
    "tag" : {
      plural: true,
      rel: true,
      datatype: "microformat",
      microformat: "tag",
      microformat_property: "tag"
    }
  }
};

Microformats.add("xFolk", xFolk_definition);
