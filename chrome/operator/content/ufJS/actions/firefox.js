/*extern ufJS, ufJSActions, ufJSParser, openUILink, XMLSerializer, Components */ 
/* These are actions that will only work in Firefox */ 

ufJSActions.actions.bookmark = {
  description: "Bookmark with Firefox",
  icon: "data:image/png;base64," +
  "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAslJREFUOE81kmtIU2EYgGeQQvkjCsIyjIrIfhT+6ZeRZBJChGeXMjVtmgkRZGX6w8hwuulcIlReSItA3cpLZjqcZuZMPW5SU7e5zc3dL2c7bvO4uati72KDl8Nz4Hne7/vxxXm9roVlI1+o8rrtLiJIbOJpF87G708gkUjnTifF7YsDSD2TdPBAQsrxI4mJh0kVzJ6SynbW63efeng3yseSC6azmuXp1TMncgaOZXO5QzPcbzPt3ePUMg6OW/b29kjUB5yGNv71/JpKZjcp/TtPu9OlDrepw8Dns6o7uT8gEK6sU0qblEppJAAi/LsTErM/tAvSG2koa9BTveAHnpiVfx4VwUaxykQpYctkkv9BCRuCEbHBF9wBiSHyX/1CPPy1Dax3bONEkHK/SW6wUeiNsYDe6PbtDsxqvYFI8HTKc7nHmTvsBpZoNx2bAUoxW2OxU+7FAnJRg8u70zulJnyRe9NHXJc6rZnvDcB/1C7MHQBVb8PJhQ3RE8h3WRue8AfBqtsbAgnhYalsVRpHCSxW4lanDzbqrA5yASsW5DMdRLh1WIoTAZCudOhTXkpO1UiA52V2E74NG6U6GzmPGQvymJg71NwnwVw+kC42KQ7RhUcrUGDhklWPecj5zDm5AcmtjwZAVmeQ1S024V6QkksjavzNMfhOLho1FgK5Uy8QrSK362LBrTrTRqCma05n2wKJ9kLYK5CfpEWCsXmdwuAGtX9SjNAYsYDKMNj9Va3TKqO7mbc0u2wWyTEBqs54NDmxoFvRbCC0uuIqdmb282iQQ659/OzjNQqDyRlgtwzxvqK8QbRvWPwTXRMuaoViLUJlZFDLRvnj0aeBon/5/KmOzv6WFi5Mzauu8idvYQqL2DlILayDmUN/q9VyDDNGnobH47TbTfBjMeuNhnW9Xq1dV2o0q2trMoViBa4hlUkUSqndYd7yOCH4B1Sf7o9s7DrKAAAAAElFTkSuQmCC",
  scope: {
    microformats: {
      "hCard" : "hCard",
      "hCalendar" : "hCalendar",
      "hResume" : "hResume",
      "hReview" : "hReview",
      "xFolk" : "taggedlink",
      "hAtom" : "hAtom"
    }
  },
  doAction: function(node, microformatName, event) {
    var url, name, description;
    if (microformatName == "xFolk") {
      var taggedlink = ufJSParser.getMicroformatProperty(node, "xFolk", "taggedlink");
      if (taggedlink) {
        url = taggedlink.link;
        name = taggedlink.title;
      }
      description = ufJSParser.getMicroformatProperty(node, "xFolk", "description");
    } else if (microformatName == "hAtom") {
      name = ufJSParser.getMicroformatProperty(node, "hAtom", "entry-title");
      var bookmark = ufJSParser.getMicroformatProperty(node, "hAtom", "bookmark");
      url = bookmark.link;
    } else {
      var serializer = new XMLSerializer();
      var xmlString = serializer.serializeToString(node);
      url = "data:text/html;charset=utf8," + xmlString;
      name = ufJSParser.getMicroformatProperty(node, microformatName, "ufjsDisplayName");
    }
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
};

