function tag(node) {
  if (node) {
    ufJSParser.newMicroformat(this, node, "tag");
  }
}
tag.prototype.toString = function() {
  return this.tag;
}

ufJSParser.microformats.tag = {
  version: "0.7",
  mfObject: tag,
  attributeName: "rel",
  attributeValues: ["tag"],
  properties: {
    "tag" : {
      virtual: true,
      virtualGetter: function(mfnode) {
        if (mfnode.href) {
          var url_array = mfnode.getAttribute("href").split("/");
          for(var i=url_array.length-1; i > 0; i--) {
            if (url_array[i] !== "") {
              return unescape(ufJSParser.microformats.tag.validTagName(url_array[i].replace(/\+/g, ' ')));
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
