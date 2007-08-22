/* These are actions that will only work in Firefox */ 

var firefox_bookmark = {
  description: "Bookmark with Firefox",
  shortDescription: "Bookmark",
  icon: "data:image/png;base64," +
  "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAslJREFUOE81kmtIU2EYgGeQQvkjCsIyjIrIfhT+6ZeRZBJChGeXMjVtmgkRZGX6w8hwuulcIlReSItA3cpLZjqcZuZMPW5SU7e5zc3dL2c7bvO4uati72KDl8Nz4Hne7/vxxXm9roVlI1+o8rrtLiJIbOJpF87G708gkUjnTifF7YsDSD2TdPBAQsrxI4mJh0kVzJ6SynbW63efeng3yseSC6azmuXp1TMncgaOZXO5QzPcbzPt3ePUMg6OW/b29kjUB5yGNv71/JpKZjcp/TtPu9OlDrepw8Dns6o7uT8gEK6sU0qblEppJAAi/LsTErM/tAvSG2koa9BTveAHnpiVfx4VwUaxykQpYctkkv9BCRuCEbHBF9wBiSHyX/1CPPy1Dax3bONEkHK/SW6wUeiNsYDe6PbtDsxqvYFI8HTKc7nHmTvsBpZoNx2bAUoxW2OxU+7FAnJRg8u70zulJnyRe9NHXJc6rZnvDcB/1C7MHQBVb8PJhQ3RE8h3WRue8AfBqtsbAgnhYalsVRpHCSxW4lanDzbqrA5yASsW5DMdRLh1WIoTAZCudOhTXkpO1UiA52V2E74NG6U6GzmPGQvymJg71NwnwVw+kC42KQ7RhUcrUGDhklWPecj5zDm5AcmtjwZAVmeQ1S024V6QkksjavzNMfhOLho1FgK5Uy8QrSK362LBrTrTRqCma05n2wKJ9kLYK5CfpEWCsXmdwuAGtX9SjNAYsYDKMNj9Va3TKqO7mbc0u2wWyTEBqs54NDmxoFvRbCC0uuIqdmb282iQQ659/OzjNQqDyRlgtwzxvqK8QbRvWPwTXRMuaoViLUJlZFDLRvnj0aeBon/5/KmOzv6WFi5Mzauu8idvYQqL2DlILayDmUN/q9VyDDNGnobH47TbTfBjMeuNhnW9Xq1dV2o0q2trMoViBa4hlUkUSqndYd7yOCH4B1Sf7o9s7DrKAAAAAElFTkSuQmCC",
  scope: {
    semantic: {
      "hCard" : "hCard",
      "hCalendar" : "hCalendar",
      "xFolk" : "taggedlink.link"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    var url, name, description;
    /* If type = value in semantic scope, bookmark the content of the microformat */ 
    if (firefox_bookmark.scope.semantic[semanticObjectType] == semanticObjectType) {
      var serializer = new XMLSerializer();
      var xmlString = serializer.serializeToString(semanticObject.resolvedNode);
      url = "data:text/html;charset=utf8," + xmlString;
      name = semanticObject.toString();
    } else {
      var property = firefox_bookmark.scope.semantic[semanticObjectType];
      if (property.indexOf(".") != -1) {
        var props = property.split(".");
        url = semanticObject[props[0]][props[1]];
      } else {
        url = semanticObject[property];
      }
      name = semanticObject.toString();
    }
    firefox_bookmark.bookmark(name, url, description);
  },
  bookmark: function(name, url, description) {
    if (typeof(PlacesUtils) != "undefined") {
     PlacesUtils.showMinimalAddBookmarkUI(makeURI(url), name, description);
    } else {
      var dArgs = {
        name: name,
        url: url,
        charset: "",
        bWebPanel: false,
        description: description
      };
      var ADD_BM_DIALOG_FEATURES = "centerscreen,chrome,dialog,resizable,";
        
      if (navigator.platform.search(/mac/i) > -1) {
        ADD_BM_DIALOG_FEATURES += "modal";
      } else {
        ADD_BM_DIALOG_FEATURES += "dependent";
      }
  
      window.openDialog("chrome://browser/content/bookmarks/addBookmark2.xul", "",
                        ADD_BM_DIALOG_FEATURES, dArgs);
    }
  }
};

SemanticActions.add("firefox_bookmark", firefox_bookmark);
