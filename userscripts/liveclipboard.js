var liveclipboard = {
  description: "Copy with Live Clipboard",
  shortDescription: "Live Clipboard",
  icon: "data:image/png;base64," +
  "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAANbY1E9YMgAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJ+SURBVHjafFNNaBNREP7e282fSVy1BtOACD20giDGKOJNBC+tEBCkBPRUhYqXHDz0mJ5V6NXWgnoQQTxoT4IKBkUKlfQkKAhWWlOJYjGbNsnuvufMS9KIqA+GWXb3m/m+b+aJpYspJ5naW4qGo0UBDSkFhEUhQfFHFgKgrAJgo+bO1GvfSjaDnYRTDBqbkCFBBQDLpv9sSSE6wQV7mb5zdlLp4so7KroyldW2Fxhw8swkwkPH6C3QfvsA6lP5r2D+rjyNje8+pKHdBcdPT0LGkrB2ZRA/dwPW7sw/wX5bQWh6x5qZJncOvr6He/cCNh9eAZ/QobN9sJOBHB6FGBpFgDiCliYvNGw2jDXrlguZHkF45BSsfcOmABpVyCgxOjwO6+gEekcNHEFroQRNZtqmOhnWfjOH0IEcYvnr2z+KSBJ24ZHJfHSzjubrOTQX7yNoazMNUZ3O6Vi0I4M1h09ehn1wbLuIrlehSWvw8SWar2bh138acEAeeFr0GHSNYpO6IIQTprNIDrJv8JXuAjtgw8AiLC8Jg1l3dPye6c4gPv7SbfKmbp7DuQJ2Xn2CyPFCB0yTYA+k2TBiEDpxqQN6NoWgMm+6Bz++wJ3NY6s8a76xocmxa3DOTyPwFLTiKYgufTbKXYf+XIaqfYCVnYDeMWg0t17cQmPxMaz9OWhfo1F5DkUZiqYAs+uke70CSaOy8ncgQh3XW8sLfc3uGtTqqunMYA7BDHgUzEAtzxtKIp2FatC4nt6EV1vrG0aafwdzWISz+VbxxYC3BZ92gTesB/ofOLIngaZ0Z2y+knyrnIF4kXeb15PdZWaa5syjIl7QPGLSzLS5M4MZ+0uAAQD/0E2iLlAXtQAAAABJRU5ErkJggg==",
  scope: {
    semantic: {
      "hCard" : "hCard",
      "hCalendar" : "hCalendar"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    var xmlString = "<?xml version=\"1.0\" encoding=\"utf-8\" ?><liveclipboard version=\"0.92\"" + " xmlns:lc=\"http://www.microsoft.com/schemas/liveclipboard\">";
    xmlString += "<lc:data>";
    xmlString += "<lc:format type=\"";
    xmlString += Microformats[semanticObjectType].className;
    xmlString += "\" contenttype=\"application/xhtml+xml\">";
    xmlString += "<lc:item>";
    var serializer = new XMLSerializer();
    xmlString += serializer.serializeToString(semanticObject.resolvedNode);
    xmlString += "</lc:item>";
    xmlString += "</lc:format>";
    xmlString += "</lc:data>";
    xmlString += "</liveclipboard>";

    var clipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
    clipboardHelper.copyString(xmlString);
  }
};

SemanticActions.add("liveclipboard", liveclipboard);