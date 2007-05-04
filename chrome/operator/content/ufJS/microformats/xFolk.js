function xFolk(node) {
  if (node) {
    ufJSParser.newMicroformat(this, node, "xFolk");
  }
}
xFolk.prototype.toString = function() {
  if (this.taggedlink) {
    return this.taggedlink.title;
  }
}

ufJSParser.microformats.xFolk = {
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
              return ufJSParser.defaultGetter(parentnode);
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
