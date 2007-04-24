/*extern ufJS, ufJSActions, ufJSParser, openUILink */ 

ufJSActions.actions.delicious_search_tags = {
  description: "Find bookmarks on del.icio.us",
  icon: "http://del.icio.us/favicon.ico",
  scope: {
    microformats: {
      "tag" : "tag"
    }
  },
  doAction: function(node, microformatName, event) {
    var url;
    if (microformatName == "tag") {
      var tag = ufJSParser.getMicroformatProperty(node, "tag", "tag");
      if (tag) {
        url = "http://del.icio.us/tag/" + encodeURIComponent(tag);
      }
    }
    if (url) {
      openUILink(url, event);
    }
  }
};

ufJSActions.actions.delicious_bookmark = {
  description: "Bookmark with del.icio.us",
  icon: "http://del.icio.us/favicon.ico",
  scope: {
    microformats: {
      "xFolk" : "taggedlink"
    }
  },
  doAction: function(node, microformatName, event) {
    var url;
    if (microformatName == "xFolk") {
      var xfolk = new xFolk(node);
      if (xfolk && xfolk.taggedlink && xfolk.taggedlink.link) {
        url = 'http://del.icio.us/post?v=4;url=' + encodeURIComponent(xfolk.taggedlink.link);
        if (xfolk.taggedlink.title) {
          url += ';title=' + encodeURIComponent(xfolk.taggedlink.title);
        }
        if (xfolk.description) {
          url += ';notes=' + encodeURIComponent(xfolk.description);
        }
        /*
        if (xfolk.tag) {
          url += ';tags=';
          var j;
          for (j = 0; j < xfolk.tag.length; j++) {
            url += encodeURIComponent(xfolk.tag[j].tag);
            url += "+";
          }
        }
        */
      }
    }
    if (url) {
      openUILink(url, event);
    }
  }
};

