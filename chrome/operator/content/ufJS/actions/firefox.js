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
    var microformatNames;
    if (!microformatName) {
      microformatNames = ufJS.getMicroformatNameFromNode(node);
    } else {
      microformatNames = [];
      microformatNames.push(microformatName);
    }
    var url;
    var action = ufJSActions.actions.goto_url;
    for (var i in microformatNames) {
      var name;
      if (microformatNames[i] == "xFolk") {
        var taggedlink = ufJSParser.getMicroformatProperty(node, "xFolk", "taggedlink");
        if (taggedlink) {
          url = taggedlink.link;
          name = taggedlink.title;
        }
      } else if (microformatNames[i] == "hAtom") {
        var name = ufJSParser.getMicroformatProperty(node, "hAtom", "entry-title");
        var bookmark = ufJSParser.getMicroformatProperty(node, "hAtom", "bookmark");
        url = bookmark.link;
      } else {
        var serializer = new XMLSerializer();
        var xmlString = serializer.serializeToString(node);
        url = "data:text/html;charset=utf8," + xmlString;
        name = ufJSParser.getMicroformatProperty(node, microformatNames[i], "ufjsDisplayName");
      }
      var dArgs = {
        name: name,
        url: url,
        charset: "",
        bWebPanel: false,
        description: ""
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

ufJSActions.actions.liveclipboard = {
  description: "Copy with Live Clipboard",
  icon: "data:image/png;base64," +
  "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAANbY1E9YMgAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJ+SURBVHjafFNNaBNREP7e282fSVy1BtOACD20giDGKOJNBC+tEBCkBPRUhYqXHDz0mJ5V6NXWgnoQQTxoT4IKBkUKlfQkKAhWWlOJYjGbNsnuvufMS9KIqA+GWXb3m/m+b+aJpYspJ5naW4qGo0UBDSkFhEUhQfFHFgKgrAJgo+bO1GvfSjaDnYRTDBqbkCFBBQDLpv9sSSE6wQV7mb5zdlLp4so7KroyldW2Fxhw8swkwkPH6C3QfvsA6lP5r2D+rjyNje8+pKHdBcdPT0LGkrB2ZRA/dwPW7sw/wX5bQWh6x5qZJncOvr6He/cCNh9eAZ/QobN9sJOBHB6FGBpFgDiCliYvNGw2jDXrlguZHkF45BSsfcOmABpVyCgxOjwO6+gEekcNHEFroQRNZtqmOhnWfjOH0IEcYvnr2z+KSBJ24ZHJfHSzjubrOTQX7yNoazMNUZ3O6Vi0I4M1h09ehn1wbLuIrlehSWvw8SWar2bh138acEAeeFr0GHSNYpO6IIQTprNIDrJv8JXuAjtgw8AiLC8Jg1l3dPye6c4gPv7SbfKmbp7DuQJ2Xn2CyPFCB0yTYA+k2TBiEDpxqQN6NoWgMm+6Bz++wJ3NY6s8a76xocmxa3DOTyPwFLTiKYgufTbKXYf+XIaqfYCVnYDeMWg0t17cQmPxMaz9OWhfo1F5DkUZiqYAs+uke70CSaOy8ncgQh3XW8sLfc3uGtTqqunMYA7BDHgUzEAtzxtKIp2FatC4nt6EV1vrG0aafwdzWISz+VbxxYC3BZ92gTesB/ofOLIngaZ0Z2y+knyrnIF4kXeb15PdZWaa5syjIl7QPGLSzLS5M4MZ+0uAAQD/0E2iLlAXtQAAAABJRU5ErkJggg==",
  scope: {
    microformats: {
      "hCard" : "hCard",
      "hCalendar" : "hCalendar"
    }
  },
  doAction: function(node, microformatName, event) {
    var microformatNames;
    if (!microformatName) {
      microformatNames = ufJS.getMicroformatNameFromNode(node);
    } else {
      microformatNames = [];
      microformatNames.push(microformatName);
    }
    var url;
    for (var i in microformatNames) {
      var xmlString = "<?xml version=\"1.0\" encoding=\"utf-8\" ?><liveclipboard version=\"0.92\"" + " xmlns:lc=\"http://www.microsoft.com/schemas/liveclipboard\">";
      xmlString += "<lc:data>";
      xmlString += "<lc:format type=\"";
      xmlString += ufJSParser.microformats[microformatNames[i]].className;
      xmlString += "\" contenttype=\"application/xhtml+xml\">";
      xmlString += "<lc:item>";
      var serializer = new XMLSerializer();
      xmlString += serializer.serializeToString(node);
      xmlString += "</lc:item>";
      xmlString += "</lc:format>";
      xmlString += "</lc:data>";
      xmlString += "</liveclipboard>";
  
      var clipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
  
      clipboardHelper.copyString(xmlString);
    }
  }
};
