/*extern ufJSParser */

function xFolk() {
}

ufJSParser.microformats.xFolk = {
  version: "0.2",
  mfName: "xFolk",
  mfObject: xFolk,
  className: "xfolkentry",
  definition:  {
    properties: {
      "description" : {
        value: []
      },
      "taggedlink" : {
        value: "",
        getter: function(propnode, mfnode, definition) {
          var title = "";
          var link = "";
          if (propnode.nodeName.toLowerCase() == "a") {
            link = propnode.href;
            if (propnode.getAttribute("title")) {
              title = propnode.getAttribute("title");
            } else {
              title = definition.defaultGetter(propnode);
            }
          }
          return {"title" : title, "link" : link};
        }
      }
    },
    ufjs: {
      "ufjsDisplayName" : {
        value: "",
        virtual: true,
        getter: function(propnode, mfnode, definition) {
          var taggedlink = ufJSParser.getMicroformatProperty(mfnode, "xFolk", "taggedlink");
          if (taggedlink && taggedlink.title) {
            return taggedlink.title;
          }
        }
      }
    },
    defaultGetter: function(propnode) {
      var s;
      if (propnode.innerText) {
        s = propnode.innerText;
      } else {
        s = propnode.textContent;
      }
      return ufJSParser.trim(s);
    }
  },
  validate: function(node, error) {
    var taggedlink = ufJSParser.getMicroformatProperty(node, "xFolk", "taggedlink");
    if (!taggedlink) {
      if (error) {
        error.message = "No taggedlink specified";
      }
      return false;
    }
    return true;
  }
};
