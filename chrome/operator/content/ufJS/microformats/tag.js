function tag() {
}

ufJSParser.microformats.tag = {
  version: "0.2",
  mfName: "rel-tag",
  mfObject: tag,
  attributeName: "rel",
  attributeValues: ["tag"],
  definition: {
    properties: {
      "tag" : {
        virtual: true,
        getter: function(mfnode) {
          if (mfnode.href) {
            var url_array = mfnode.getAttribute("href").split("/");
            for(var i=url_array.length-1; i > 0; i--) {
              if (url_array[i] !== "") {
                return unescape(ufJSParser.microformats.tag.validTagName(url_array[i]));
              }
            }
          }
        }
      },
      "link" : {
        virtual: true,
        datatype: "anyURI"
      },
      "text" : {
        virtual: true
      }
    },
    ufjs: {
      "ufjsDisplayName" : {
        virtual: true,
        getter: function(mfnode) {
          return ufJSParser.getMicroformatProperty(mfnode, "tag", "tag");
        }
      }
    },
  },
  validTagName: function(tag)
  {
    var returnTag = tag;
    if (tag.indexOf('?') != -1) {
      if (tag.indexOf('?') === 0) {
        return false;
      } else {
        returnTag = tag.substr(0, tag.indexOf('?'));
      }
    }
    if (tag.indexOf('#') != -1) {
      if (tag.indexOf('#') === 0) {
        return false;
      } else {
        returnTag = tag.substr(0, tag.indexOf('#'));
      }
    }
    if (tag.indexOf('.html') != -1) {
      if (tag.indexOf('.html') == tag.length - 5) {
        return false;
      }
    }
    return returnTag;
  },
  validate: function(node, error) {
    var tag = ufJSParser.getMicroformatProperty(node, "tag", "tag");
    if (!tag) {
      if (node.href) {
        var url_array = node.getAttribute("href").split("/");
        for(var i=url_array.length-1; i > 0; i--) {
          if (url_array[i] !== "") {
            if (error) {
              error.message = "Invalid tag name (" + url_array[i] + ")";
            }
            return false;
          }
        }
      } else {
        if (error) {
          error.message = "No href specified on tag";
        }
        return false;
      }
    }
    return true;
  }
};
