/*extern ufJS, ufJSParser, ufJSActions, Microformats, Components, Operator_Statusbar, Operator_Toolbar, Operator_ToolbarButton, getBrowser, content, HTMLDocument, XMLSerializer, Operator_Sidebar, closeMenus, gContextMenu, openUILink, XSLTProcessor */

var Operator = {
  microformats: {},
  prefBranch: null,
  debug: false,
  official: true,
  view: 1,
  upcomingOrgBugFixed: false,
  highlightMicroformats: false,
  useDescriptiveNames: false,
  removeDuplicates: true,
  observeDOMAttrModified: false,
  batchPrefChanges: false,
  customizeDone: false,
  languageBundle: null,
  highlightedElement: null,
  highlightedElementOutlineStyle: null,
  timerID: null,
  init: function()
  {
    var options = false;
    if (window.location.href.match("operator_options")) {
      options = true;
    }
    var objScriptLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
    objScriptLoader.loadSubScript("chrome://operator/content/ufJS/ufJS.js");
    ufJS.init(objScriptLoader, "chrome://operator/content/ufJS/");

    objScriptLoader.loadSubScript("chrome://operator/content/legacy_microformats.js");

    if (!options) {
      /* Operator specific parser stuff */
      ufJSParser.microformats.hCard.icon = "chrome://operator/content/hCard.png";
      ufJSParser.microformats.hCalendar.icon = "chrome://operator/content/hCalendar.png";
      ufJSParser.microformats.geo.icon = "chrome://operator/content/geo.png";
      ufJSParser.microformats.tag.sort = true;
  
      objScriptLoader.loadSubScript("chrome://operator/content/operator_toolbar.js");
      objScriptLoader.loadSubScript("chrome://operator/content/operator_statusbar.js");
      objScriptLoader.loadSubScript("chrome://operator/content/operator_toolbar_button.js");
      objScriptLoader.loadSubScript("chrome://operator/content/operator_sidebar.js");
    }
    var bundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].
                                   getService(Components.interfaces.nsIStringBundleService);
    this.languageBundle = bundleService.createBundle("chrome://operator/locale/operator.properties");

    var languageBundle = bundleService.createBundle("chrome://operator/locale/microformats.properties");
    var i;
    for (i in ufJSParser.microformats)
    {
      try {
        ufJSParser.microformats[i].description = languageBundle.GetStringFromName(i + ".description");
      } catch (ex) {
      }
    }
    for (i in ufJSActions.actions)
    {
      try {
        ufJSActions.actions[i].description = languageBundle.GetStringFromName(i + ".description");
      } catch (ex) {
      }
    }
    
    var file = Components.classes["@mozilla.org/file/directory_service;1"].
                          getService(Components.interfaces.nsIProperties).
                          get("ProfD", Components.interfaces.nsILocalFile);
    file.append("microformats");
    
    if (file.exists() && file.isDirectory()) {
      var e = file.directoryEntries;
      while (e.hasMoreElements()) {
        var f = e.getNext().QueryInterface(Components.interfaces.nsIFile);
        var splitpath = f.path.split(".");
        if (splitpath[splitpath.length-1] == "js") {
          var fileHandler = Components.classes["@mozilla.org/network/io-service;1"].
                                       getService(Components.interfaces.nsIIOService).
                                       getProtocolHandler("file").
                                       QueryInterface(Components.interfaces.nsIFileProtocolHandler);
          try {
            objScriptLoader.loadSubScript(fileHandler.getURLSpecFromFile(f));
          } catch (ex) {
            alert("Unable to load " + f.leafName + "\n\n" + "(" + ex.message + ")");
          }
        }
      }
    }

    Microformats.init();

    if (options) {
      return;
    }

    
    window.addEventListener("load", function(e)   { Operator.startup(); }, false);
    window.addEventListener("unload", function(e) { Operator.shutdown(); }, false);
    window.addEventListener("operator-sidebar-load", Operator_Sidebar.processMicroformats, false, true);
    
  },
  startup: function()
  {
    
    var i,j;
    this.prefBranch = Components.classes["@mozilla.org/preferences-service;1"].
                                 getService(Components.interfaces.nsIPrefService).
                                 getBranch("extensions.operator.");
    var newcount = { value: 0 };
    try {
      this.prefBranch.getChildList("", newcount);
    } catch (ex) {}
    /* that nine is an attempt to handle the 0.5 to 0.6 failure case and fix it */
    if ((newcount.value === 0) || (newcount.value == 9) || (newcount.value == 10)) {
      var action;
      /* check for old prefs and migrate them if they are there */
      var prefBranchOld = Components.classes["@mozilla.org/preferences-service;1"].
                                     getService(Components.interfaces.nsIPrefService).
                                     getBranch("extensions.operator_toolbar.");
      var oldcount = { value: 0 };
      try {
        var prefArray = prefBranchOld.getChildList("", oldcount);
      } catch (ex) {
      }
      if (oldcount.value > 0) {
        try {
        for (i = 0; i < oldcount.value; i++) {
          switch (prefBranchOld.getPrefType(prefArray[i])) {
            case Components.interfaces.nsIPrefBranch.PREF_STRING:
              this.prefBranch.setCharPref(prefArray[i], prefBranchOld.getCharPref(prefArray[i]));
              break;
            case Components.interfaces.nsIPrefBranch.PREF_INT:
              this.prefBranch.setIntPref(prefArray[i], prefBranchOld.getIntPref(prefArray[i]));
              break;
            case Components.interfaces.nsIPrefBranch.PREF_BOOL:
              this.prefBranch.setBoolPref(prefArray[i], prefBranchOld.getBoolPref(prefArray[i]));
              break;
          }
        }
        } catch (ex) {
        }
        prefBranchOld.deleteBranch("");
      } else {
        /* Set initial prefs. We can't do this in an extension prefs.js 
           because we want to cerate default toolbar items that might get
           deleted */
        this.prefBranch.setIntPref("view", 1);
        this.prefBranch.setBoolPref("useDescriptiveNames", false);
        this.prefBranch.setBoolPref("debug", false);
        this.prefBranch.setBoolPref("statusbar", false);
        this.prefBranch.setBoolPref("highlightMicroformats", false);
        this.prefBranch.setBoolPref("upcomingOrgBugFixed", false);
        this.prefBranch.setBoolPref("removeDuplicates", true);
        this.prefBranch.setBoolPref("observeDOMAttrModified", false);
        j = 1;
        for (i in ufJSParser.microformats)
        {
          if (ufJSParser.microformats[i].description) {
            this.prefBranch.setCharPref("microformat" + (j), i);
            j++;
          }
        }
        i = 1;
        var microformat;
        var handler;
        do {
          try {
            action = this.languageBundle.GetStringFromName("action" + i);
            microformat = this.languageBundle.GetStringFromName("action" + i + ".microformat");
            handler = this.languageBundle.GetStringFromName("action" + i + ".handler");
            this.prefBranch.setCharPref("action" + i, action);
            this.prefBranch.setCharPref("action" + i + ".microformat", microformat);
            this.prefBranch.setCharPref("action" + i + ".handler", handler);
            i++;
          } catch (ex) {
            break;
          }
        }
        while(1);
      }
    }
    try {
      var displayAllHandlers = this.prefBranch.getBoolPref("displayAllHandlers");
      i = 1;
      do {
        try {
          action = Operator.prefBranch.getComplexValue("action" + i, Components.interfaces.nsISupportsString).data;
          microformat = Operator.prefBranch.getCharPref("action" + i + ".microformat");
          handler = Operator.prefBranch.getCharPref("action" + i + ".handler");
          
          switch (microformat) {
            case "hCalendar":
              switch (handler) {
                case "yahoo":
                case "google":
                  Operator.prefBranch.setCharPref("action" + i + ".handler", handler + "_calendar");
                  break;
                case "export":
                  Operator.prefBranch.setCharPref("action" + i + ".handler", handler + "_icalendar");
                  break;
              }
              break; 
            case "hCard":
              switch (handler) {
                case "yahoo":
                  Operator.prefBranch.setCharPref("action" + i + ".handler", handler + "_contact");
                  break;
                case "export":
                  Operator.prefBranch.setCharPref("action" + i + ".handler", handler + "_vcard");
                  break;
              }
              break; 
            case "hResume":
            case "hReview":
              if ((handler == "google") || (handler == "yahoo")) {
                Operator.prefBranch.setCharPref("action" + i + ".handler", handler + "_search");
              }
              break;
            case "tag":
              if ((handler == "delicious") || (handler == "flickr") ||
                  (handler == "upcoming") || (handler == "technorati") ||
                  (handler == "yedda") || (handler == "magnolia")) {
                Operator.prefBranch.setCharPref("action" + i + ".handler", handler + "_search_tags");
              }
              break; 
            case "xfolk":
              if ((handler == "delicious") || (handler == "magnolia")) {
                Operator.prefBranch.setCharPref("action" + i + ".handler", handler + "_bookmark");
              }
              break;
          }
        } catch (ex) {
          break;
        }
        i++;
      } while (1);
      for (i in ufJSParser.microformats) {
        try {
          Operator.prefBranch.clearUserPref(i + ".defaultHandler");
        } catch (ex) {}
      }

      Operator.prefBranch.clearUserPref("displayAllHandlers");

    } catch (ex) {}
    
    this.prefBranch.QueryInterface(Components.interfaces.nsIPrefBranch2);
    this.prefBranch.addObserver("", this, false);

    try {
      this.debug = this.prefBranch.getBoolPref("debug");
    } catch (ex) {}
    try {
      this.release = this.prefBranch.getBoolPref("release");
    } catch (ex) {}
    try {
      this.useDescriptiveNames = this.prefBranch.getBoolPref("useDescriptiveNames");
    } catch (ex) {}
    try {
      this.highlightMicroformats = this.prefBranch.getBoolPref("highlightMicroformats");
    } catch (ex) {}
    try {
      this.removeDuplicates = this.prefBranch.getBoolPref("removeDuplicates");
    } catch (ex) {}
    try {
      this.observeDOMAttrModified = this.prefBranch.getBoolPref("observeDOMAttrModified");
    } catch (ex) {}
    try {
      this.upcomingOrgBugFixed = this.prefBranch.getBoolPref("upcomingOrgBugFixed");
    } catch (ex) {}
    try {
      this.view = this.prefBranch.getIntPref("view");
    } catch (ex) {}
    try {
      var statusbar = this.prefBranch.getBoolPref("statusbar");
      if (statusbar) {
        Operator_Statusbar.show();
      } else {
        Operator_Statusbar.hide();
      }
    } catch (ex) {
      Operator_Statusbar.hide();
    }
    Operator_Toolbar.create();
    getBrowser().addEventListener("pageshow", function(e) { Operator.onPageShow(e); }, true);
    getBrowser().addEventListener("pagehide", function(e) { Operator.onPageHide(e); }, true);
    getBrowser().tabContainer.addEventListener("select", function(e) { Operator.onTabChanged(e); }, true);
    var menu = document.getElementById("contentAreaContextMenu");
    menu.addEventListener("popupshowing", Operator.contextPopupShowing, false);
    document.addEventListener("operator-refresh", Operator.processMicroformats, false, true);
  },
  shutdown: function()
  {
    this.prefBranch.removeObserver("", this);
    getBrowser().removeEventListener("pageshow", function(e) { Operator.onPageShow(e); }, true);
    getBrowser().removeEventListener("pagehide", function(e) { Operator.onPageHide(e); }, true);
    getBrowser().tabContainer.removeEventListener("select", function(e) { Operator.onTabChanged(e); }, true);
    var menu = document.getElementById("contentAreaContextMenu");
    menu.removeEventListener("popupshowing", Operator.contextPopupShowing, false);
    document.removeEventListener("operator-refresh", Operator.processMicroformats, false, true);
  },
  observe: function(subject, topic, data)
  {
    if (topic != "nsPref:changed")
    {
      return;
    }
    if (data == "batchPrefChanges") {
      try {
        this.batchPrefChanges = this.prefBranch.getBoolPref("batchPrefChanges");
      } catch(ex) {
        this.batchPrefChanges = false;
      }
    }
    if (data == "debug") {
      this.debug = this.prefBranch.getBoolPref("debug");
    }
    if (data == "release") {
      this.release = this.prefBranch.getBoolPref("release");
    }
    if (data == "useDescriptiveNames") {
      this.useDescriptiveNames = this.prefBranch.getBoolPref("useDescriptiveNames");
    }
    if (data == "removeDuplicates") {
      this.removeDuplicates = this.prefBranch.getBoolPref("removeDuplicates");
    }
    if (data == "observeDOMAttrModified") {
      this.observeDOMAttrModified = this.prefBranch.getBoolPref("observeDOMAttrModified");
    }
    if (data == "upcomingOrgBugFixed") {
      this.upcomingOrgBugFixed = this.prefBranch.getBoolPref("upcomingOrgBugFixed");
    }
    if (data == "highlightMicroformats") {
      this.highlightMicroformats = this.prefBranch.getBoolPref("highlightMicroformats");
      if (this.highlightedElement) {
        this.highlightedElement.style.outline = this.highlightedElementOutlineStyle;
        this.highlightedElement = null;
      }
    }
    if (data == "view") {
      this.view = this.prefBranch.getIntPref("view");
    }
    if (data == "statusbar") {
      if (this.prefBranch.getBoolPref("statusbar")) {
        Operator_Statusbar.show();
      } else {
        Operator_Statusbar.hide();
      }
      return;
    }

    if (!this.batchPrefChanges) {
      Operator_Toolbar.create();
      Operator.processMicroformats();
    }
  },

  highlightCallbackGenerator: function(item)
  {
    return function(event) {
      if (Operator.highlightDOMNode(item)) {
        item.scrollIntoView(false);
      }
    };
  },

  
  actionCallbackGenerator: function(formatname, item, handler)
  {
    return function(event) {
//      handler.action(item, event);
      ufJSActions.actions[handler].doAction(item, formatname, event);
    };
  },
  actionAllCallbackGenerator: function(formatname, doc, handler)
  {
    return function(event) {
//      handler.action(item, event);
      ufJSActions.actions[handler].doActionAll(doc, formatname, event);
    };
  },
  clickCallbackGenerator: function(formatname, item, handler)
  {
    return function(event) {
      /* This is for middle click only */
      if (event.button == 1) {
        if (event.target.getAttribute("disabled") != "true") {
            ufJSActions.actions[handler].doAction(item, formatname, event);

//          handler.action(item, event);
          closeMenus(event.target);
        }
      }
    };
  },
  clickAllCallbackGenerator: function(formatname, doc, handler)
  {
    return function(event) {
      /* This is for middle click only */
      if (event.button == 1) {
        if (event.target.getAttribute("disabled") != "true") {
            ufJSActions.actions[handler].doActionAll(doc, formatname, event);

//          handler.action(item, event);
          closeMenus(event.target);
        }
      }
    };
  },

  sourceCallbackGenerator: function(formatname, item)
  {
    return function(event) {
      Operator.source(item, formatname);
    };
  },

  errorCallbackGenerator: function(formatname, item)
  {
    return function(event) {
      Operator.error(formatname, item);
    };
  },
  buildMenu: function(microformat, nodes, handler)
  {
    var menu = null;
    var items;
    
    items = [];
    var displayname;
    var j, m;
    for (j=0; j < nodes.length; j++) {
      items[j] = {} ;
      items[j].node = nodes[j];
      displayname = ufJSParser.getMicroformatProperty(nodes[j], microformat, "ufjsDisplayName");
      if (displayname) {
        items[j].displayname = displayname;
        items[j].error = false;
      } else {
        items[j].displayname = "Invalid - select for more details";
        items[j].error = true;
      }
    }
    var sorted_items = items.slice();
//    if ((items.length > 1) && Operator.microformats[microformat].sort && Operator.microformats[microformat].sort === true) {
    if (items.length > 1) {
      sorted_items = sorted_items.sort(
        function (a,b) {
          if (a.displayname.toLowerCase() < b.displayname.toLowerCase()) {
            return -1;
          }
          if (a.displayname.toLowerCase() > b.displayname.toLowerCase()) {
            return 1;
          }
          return 0;
        }
      );
      /* remove duplicates */
      j=1;
      if (this.removeDuplicates) {
        while (sorted_items[j]) {
          if ((sorted_items[j].displayname == sorted_items[j-1].displayname) && (sorted_items[j].error === false)) {
            if (this.dump_microformat(sorted_items[j].node, microformat) ==
              this.dump_microformat(sorted_items[j-1].node, microformat)) {
              for (m = 0; m < items.length; m++) {
                if (items[m].node == sorted_items[j].node) {
                  items[m].duplicate = true;
                }
//                break;
              }
              sorted_items.splice(j,1);
            } else {
              j++;
            }
          } else {
            j++;
          }
        }
      }
    }
    if ((items.length > 1) && ufJSParser.microformats[microformat].sort) {
      items = sorted_items;
    }

    var itemsadded = 0;
    var tempItem;
    var menuitem;
    for (j=0; j < items.length; j++) {
      if (!items[j].duplicate) {
        if (!items[j].error || this.debug) {
          if (!menu) {
            menu = document.createElement("menupopup");
          }
          if ((this.view === 0) && (!items[j].error)) {
            tempItem = document.createElement("menu");
          } else {
            tempItem = document.createElement("menuitem");
          }
          tempItem.store_onDOMMenuItemActive = this.highlightCallbackGenerator(items[j].node);
          tempItem.addEventListener("DOMMenuItemActive", tempItem.store_onDOMMenuItemActive, true);
          tempItem.setAttribute("label", items[j].displayname);
          tempItem.label = items[j].displayname;
          if (items[j].error) {
            tempItem.store_oncommand = this.errorCallbackGenerator(microformat, items[j].node);
            tempItem.addEventListener("command", tempItem.store_oncommand, true);
            tempItem.style.fontWeight = "bold";
            menu.error = true;
          } else {
            /* NOT ACTIONS */
            if (this.view === 0) {
              var submenu = document.createElement("menupopup");
              tempItem.appendChild(submenu);
              tempItem.store_onpopupshowing = this.popupShowing(microformat, items[j].node, handler);
              tempItem.addEventListener("popupshowing", tempItem.store_onpopupshowing, false);
            } else {
              this.buildActionMenu(tempItem, microformat, items[j].node, handler);
            }
          }
          menu.appendChild(tempItem);
          itemsadded++;
        } else {
          var error = {};
          ufJSParser.validate(items[j].node, microformat, error);

          Operator.console_message(error.message, Operator.lineNumberFromDOMNode(items[j].node));
//          if (typeof Firebug != "undefined") {
//            Firebug.Console.log(Operator.microformats[microformat].getError(items[j].node), items[j].node);
//          }
        }
      }
    }
    
    if (this.view === 0) {
    } else {
      if (ufJSActions.actions[handler].scope.microformats[microformat]) {
        if ((ufJSActions.actions[handler].doActionAll) && (itemsadded > 0)) {
          var sep = document.createElement("menuseparator");
          menu.appendChild(sep);
          tempItem = document.createElement("menuitem");
          tempItem.label = ufJSActions.actions[handler].descriptionAll;
          tempItem.setAttribute("label", tempItem.label);
          tempItem.store_oncommand = this.actionAllCallbackGenerator(microformat, content.document, handler);
          tempItem.addEventListener("command", tempItem.store_oncommand, true);
          tempItem.store_onclick = this.clickAllCallbackGenerator(microformat, content.document, handler);
          tempItem.addEventListener("click", tempItem.store_onclick, true);
          menu.appendChild(tempItem);
        }
      }
    }
    return menu;
  },
  popupShowing: function(microformat, node, handler)
  {
    return function(event) {
      if (event.target.childNodes.length == 0) {
        Operator.buildActionMenu(event.target, microformat, node, handler);
      }
    };
  },
  buildActionMenu: function(parentmenu, microformat, node, handler)
  {
    var required;
    var menuitem;
    if (this.view === 0) {
      
      var submenu = parentmenu;
      var k;
      var addedAction = false;
      for (k in ufJSActions.actions) {
        if (!ufJSActions.actions[k].scope.microformats[microformat]) {
          continue;
        }
        if (ufJSActions.actions[k].scope.microformats[microformat] != microformat) {
          required = ufJSParser.getMicroformatProperty(node, microformat, ufJSActions.actions[k].scope.microformats[microformat]);
          if (!required) {
            continue;
          }
        }
        menuitem = document.createElement("menuitem");
        menuitem.label = ufJSActions.actions[k].description;
        menuitem.setAttribute("label", menuitem.label);
        menuitem.store_oncommand = this.actionCallbackGenerator(microformat, node, k);
        menuitem.addEventListener("command", menuitem.store_oncommand, true);
        menuitem.store_onclick = this.clickCallbackGenerator(microformat, node, k);
        menuitem.addEventListener("click", menuitem.store_onclick, true);
        submenu.appendChild(menuitem);
        addedAction = true;
      }
      if (this.debug) {
        if (addedAction) {
          menuitem = document.createElement("menuseparator");
          submenu.appendChild(menuitem);
        }
        menuitem = document.createElement("menuitem");
        menuitem.label = "Debug";
        menuitem.setAttribute("label", menuitem.label);
        menuitem.store_oncommand = this.errorCallbackGenerator(microformat, node);
        menuitem.addEventListener("command", menuitem.store_oncommand, true);
        submenu.appendChild(menuitem);
      }
    } else {
      parentmenu.store_oncommand = this.actionCallbackGenerator(microformat, node, handler);
      parentmenu.addEventListener("command", parentmenu.store_oncommand, true);
      parentmenu.store_onclick = this.clickCallbackGenerator(microformat, node, handler);
      parentmenu.addEventListener("click", parentmenu.store_onclick, true);
      if (ufJSActions.actions[handler].scope.microformats[microformat] != microformat) {
        required = ufJSParser.getMicroformatProperty(node, microformat, ufJSActions.actions[handler].scope.microformats[microformat]);
        if (!required) {
          parentmenu.setAttribute("disabled", "true");    
        }
      }
    }
  },
  buildPopupMenu: function(microformat, node)
  {
    var menu = document.createElement("menupopup");
    var menuitem;
    var required;
    var k;
    for (k in ufJSActions.actions) {
      if (!ufJSActions.actions[k].scope.microformats[microformat]) {
        continue;
      }
      if (ufJSActions.actions[k].scope.microformats[microformat] != microformat) {
        required = ufJSParser.getMicroformatProperty(node, microformat, ufJSActions.actions[k].scope.microformats[microformat]);
        if (!required) {
          continue;
        }
      }
      menuitem = document.createElement("menuitem");
      menuitem.label = ufJSActions.actions[k].description;
      menuitem.setAttribute("label", menuitem.label);
      menuitem.addEventListener("command", this.actionCallbackGenerator(microformat, node, k), true);
      menuitem.addEventListener("click", this.clickCallbackGenerator(microformat, node, k), true);
      menu.appendChild(menuitem);

    }
    if (this.debug) {
      menuitem = document.createElement("menuseparator");
      menu.appendChild(menuitem);
      menuitem = document.createElement("menuitem");
      menuitem.label = "Debug";
      menuitem.setAttribute("label", menuitem.label);
      menuitem.addEventListener("command", this.errorCallbackGenerator(microformat, node), true);
      menu.appendChild(menuitem);
    }

    return menu;
  },

  contextPopupShowing: function(event) {
    var element =   gContextMenu.target;
    var mfNode = ufJS.isMicroformatNode(element);
    gContextMenu.showItem("operator-menu-0", false);
    gContextMenu.showItem("operator-menu-1", false);
    gContextMenu.showItem("operator-menu-2", false);
    gContextMenu.showItem("operator-menu-3", false);
    gContextMenu.showItem("operator-menu-4", false);
    gContextMenu.showItem("operator-separator", false);
    if (mfNode) {
      var mfNames = ufJS.getMicroformatNameFromNode(mfNode);
      var i;
      var actionmenu;
      var shown_separator = false;
      for (i in mfNames) {
        actionmenu = Operator.buildPopupMenu(mfNames[i], mfNode);
        if (actionmenu.childNodes.length > 0) {
          if (!shown_separator) {
            gContextMenu.showItem("operator-separator", true);
          }
          gContextMenu.showItem("operator-menu-" + i, true);
          var menuitem = document.getElementById("operator-menu-" + i);
          if (ufJSParser.microformats[mfNames[i]].description) {
            menuitem.label = "Operator " + ufJSParser.microformats[mfNames[i]].description;
          } else {
            menuitem.label = "Operator " + mfNames[i];
          }
          menuitem.setAttribute("label", menuitem.label);
          for(var j=menuitem.childNodes.length - 1; j>=0; j--) {
            menuitem.removeChild(menuitem.childNodes.item(j));
          }
          menuitem.appendChild(actionmenu);
        }
      }
    }
  },
  highlightDOMNode: function(node)
  {
    if (Operator.highlightMicroformats) {
      if (node) {
        if (Operator.highlightedElement != node) {
          if (Operator.highlightedElement) {
            Operator.highlightedElement.style.outline = this.highlightedElementOutlineStyle;
          }
          Operator.highlightedElement = node;
          Operator.highlightedElementOutlineStyle = node.style.outline;
          node.style.outline = "black solid medium";
        }
      } else {
        if (Operator.highlightedElement) {
          Operator.highlightedElement.style.outline = this.highlightedElementOutlineStyle;
          Operator.highlightedElement = null;
        }
      }
      return true;
    } else {
      return false;
    }
  },
  mouseOver: function(event) {
    var element = (event.target) ? event.target : event.srcElement;
    var mfNode = ufJS.isMicroformatNode(element);
    Operator.highlightDOMNode(mfNode);
  },
  processMicroformatsDelayed: function(event)
  {
    if (Operator.timerID) {
      window.clearTimeout(Operator.timerID);
    }
    Operator.timerID = window.setTimeout(Operator.processMicroformats, 500);
  },
  recursiveAddListeners: function(window)
  {
    if (window && window.frames.length > 0) {
      for (var i=0; i < window.frames.length; i++) {
        Operator.recursiveAddListeners(window.frames[i]);
      }
    }
    window.document.addEventListener("mouseover", Operator.mouseOver, false);
    window.document.getElementsByTagName("body")[0].addEventListener("DOMNodeInserted", Operator.processMicroformatsDelayed, false);
    window.document.getElementsByTagName("body")[0].addEventListener("DOMNodeRemoved", Operator.processMicroformatsDelayed, false);
    if (Operator.observeDOMAttrModified) {
      window.document.getElementsByTagName("body")[0].addEventListener("DOMAttrModified", Operator.processMicroformatsDelayed, false);
    }
  },
  recursiveRemoveListeners: function(window)
  {
    if (window && window.frames.length > 0) {
      for (var i=0; i < window.frames.length; i++) {
        Operator.recursiveRemoveListeners(window.frames[i]);
      }
    }
    window.document.removeEventListener("mouseover", Operator.mouseOver, false);
    window.document.getElementsByTagName("body")[0].removeEventListener("DOMNodeInserted", Operator.processMicroformatsDelayed, false);
    window.document.getElementsByTagName("body")[0].removeEventListener("DOMNodeRemoved", Operator.processMicroformatsDelayed, false);
    if (Operator.observeDOMAttrModified) {
      window.document.getElementsByTagName("body")[0].removeEventListener("DOMAttrModified", Operator.processMicroformatsDelayed, false);
    }
  },
  onPageShow: function(event) 
  {
    if (event.originalTarget instanceof HTMLDocument)
    {
      /* This is required so that things work properly when pages are opened */
      /* in background tabs (OR NOT - it broke nested page load notifications) */
//      if (content && (event.originalTarget == content.document)) {
        Operator.processMicroformats();
        Operator.recursiveAddListeners(content);
//      }
    }
  },
  
  onPageHide: function(event) 
  {
    if (event.originalTarget instanceof HTMLDocument)
    {
      /* This is required so that things work properly when pages are opened */
      /* in background tabs */
      if (content && (event.originalTarget == content.document)) {
        /* These are required in case we go to a page that doesn't invoke our */
        /* onPageShow, like a non HTML document or an error page */
        Operator_Toolbar.disable();
        Operator_Toolbar.clearPopups();
        Operator_Statusbar.disable();
        Operator_ToolbarButton.disable();
      }
      Operator.recursiveRemoveListeners(content);
    }
  },


  onTabChanged: function(event) 
  {
    Operator.processMicroformats();
  },
  dump_microformat: function(item, microformat)
  {
    var instance;
    if (microformat) {
      instance = ufJSParser.createMicroformat(item, microformat);
      if (!instance) {
        return "Unable to create microformat";
      }
    } else { 
      instance = item;
    }
    var todisplay = "";
    var i;
    var testArray = [];
    for (i in instance)
    {
      if (testArray[i]) {
        continue;
      }
      if (typeof instance[i] == "object") {
        todisplay += "object " + i + " { \n";
        todisplay += this.dumpObject(instance[i], "\t");
        todisplay += "}\n";
      } else {
        if (instance[i]) {
          todisplay += i + "=" + instance[i] + "\n";
        }
      }
    }
    if (todisplay.length === 0) {
      todisplay = "No data in microformat";
    }
    return todisplay;
  },
  dumpObject: function(item, indent)
  {
    var i;
    var toreturn = "";
    var testArray = [];
    
    for (i in item)
    {
      if (testArray[i]) {
        continue;
      }
      if (typeof item[i] == "object") {
        toreturn += indent + "object " + i + " { \n";
        toreturn += this.dumpObject(item[i], indent + "\t");
        toreturn += indent + "}\n";
      } else {
        if (item[i]) {
          toreturn += indent + i + "=" + item[i] + "\n";
        }
      }
    }
    return toreturn;
  },
  debug_alert: function(text)
  {
    if (!Operator.release) {
      window.openDialog("chrome://operator/content/operator_debug.xul","alert","chrome,centerscreen,modal", "Alert", text);
    }
  },
  console_message: function(text, line_number)
  {
    var consoleService = Components.classes["@mozilla.org/consoleservice;1"].
                                    getService(Components.interfaces.nsIConsoleService);
    var scriptError = Components.classes["@mozilla.org/scripterror;1"].
                                 createInstance(Components.interfaces.nsIScriptError);
    if (!line_number) {
      line_number = 0;
    }                             
    scriptError.init("Operator: " + text, content.document.location.href, null, line_number, 
                     null, 0, 0);
    consoleService.logMessage(scriptError);
  },
  lineNumberFromDOMNode: function(node)
  {
    var serializer = new XMLSerializer();
    var source = serializer.serializeToString(content.document);
//    this.debug_alert(source);
    var node_source = serializer.serializeToString(node);
    var offset = source.indexOf(node_source);
    var less_source =source.substring(0, offset);
    var lines = less_source.split("\n");
    return lines.length;
  },
  error: function(microformat, item)
  {
    var serializer = new XMLSerializer();
    var xmlString = serializer.serializeToString(item);
    var vcfical = null;
    var X2V = null;
    
    if (microformat == "hCard") {
      try {
        vcfical = ufJS.vCard(item);
      } catch (ex) {}
      X2V = item;
    }
    if (microformat == "hCalendar") {
      try {
        vcfical = ufJS.iCalendar(item, true, true);
      } catch (ex) {}
      X2V = item;
    }
    
    var error = {};
    ufJSParser.validate(item, microformat, error);

    window.openDialog("chrome://operator/content/operator_debug.xul","debug","chrome,centerscreen",
                      microformat,
                      error.message,
                      Operator.dump_microformat(item, microformat),
                      xmlString,
                      vcfical,
                      X2V);
  },
  recurseFrames: function(window, microformatsArrays)
  {
    if (window && window.frames.length > 0) {
      for (var i=0; i < window.frames.length; i++) {
        Operator.recurseFrames(window.frames[i], microformatsArrays);
      }
    }
    ufJS.getElementsByMicroformat(window.document, microformatsArrays);
  },
  processMicroformats: function()
  {
    Operator.timerID = null;
    Operator_Toolbar.clearPopups();
    Operator_Statusbar.clearPopup();
    Operator_ToolbarButton.clearPopup();
    Operator_Toolbar.disable();
    Operator_Statusbar.disable();
    Operator_ToolbarButton.disable();

    var useActions = (Operator.view == 1);

    var i;
   var microformatsArrays = [];

    Operator.recurseFrames(content, microformatsArrays);

    var popup;

    var microformat;
    var tempItem;
    var submenu;
    if (useActions) {
      i=1;
      do {
        try {
          var action = Operator.prefBranch.getComplexValue("action" + i, Components.interfaces.nsISupportsString).data;
          microformat = Operator.prefBranch.getCharPref("action" + i + ".microformat");
          var handler = Operator.prefBranch.getCharPref("action" + i + ".handler");
        } catch (ex) {
          break;
        }
        if (action && microformatsArrays[microformat] && microformatsArrays[microformat].length > 0) {
          submenu = Operator.buildMenu(microformat, microformatsArrays[microformat], handler);

          if (submenu) {
            if (!popup) {
              popup = document.createElement("menupopup");
            }               
            tempItem = document.createElement("menu");

            tempItem.setAttribute("label", action);
            tempItem.label = action;

            popup.appendChild(tempItem);

            if (submenu.error === true) {
              tempItem.style.fontWeight = "bold";
            }
            tempItem.appendChild(submenu);
            
            Operator_Toolbar.addButtonMenu(submenu, microformat, handler);
          }
        }
        i++;
      } while (1);

    } else {
      i=1;
      do {
        try {
          microformat = Operator.prefBranch.getCharPref("microformat" + i);
        } catch (ex) {
          break;
        }
        if (microformat && microformatsArrays[microformat] && microformatsArrays[microformat].length > 0) {
          submenu = Operator.buildMenu(microformat, microformatsArrays[microformat]);
          if (submenu) {
            if (!popup) {
             popup = document.createElement("menupopup");
            }
            tempItem = document.createElement("menu");
            
            if ((this.useDescriptiveNames) && (ufJSParser.microformats[microformat].description)) {
              tempItem.label = ufJSParser.microformats[microformat].description;
            } else {
              tempItem.label = microformat;
            }
            tempItem.setAttribute("label", tempItem.label);

            popup.appendChild(tempItem);

            if (submenu.error === true) {
              tempItem.style.fontWeight = "bold";
            }

            tempItem.appendChild(submenu);

            Operator_Toolbar.addButtonMenu(submenu, microformat);
          }
        }
        i++;
      } while (1);
    }

    var clonePopup = false;
    if (popup) {
      tempItem = document.createElement("menuseparator");
      popup.appendChild(tempItem);
      tempItem = document.createElement("menuitem");
      var optionsLabel = "Options";
      try {
        optionsLabel = this.languageBundle.GetStringFromName("operatorOptions.label");
      } catch (ex) {}
      tempItem.setAttribute("label", optionsLabel);
      tempItem.label = action;
      tempItem.store_oncommand = function() {window.openDialog('chrome://operator/content/operator_options.xul','options','chrome,centerscreen,modal');};
      tempItem.addEventListener("command", tempItem.store_oncommand, true);
      popup.appendChild(tempItem);

      /* add options to popup */
      
      if (!Operator_ToolbarButton.isHidden()) {
        Operator_ToolbarButton.enable();
        clonePopup = Operator_ToolbarButton.addPopup(popup);
      }
      if (!Operator_Statusbar.isHidden()) {
        Operator_Statusbar.enable();
        Operator_Statusbar.addPopup(popup, clonePopup);
      }
      Operator_Toolbar.enable();
    }
  },
  simpleEscape: function(s)
  {
    s = s.replace(/\&/g, '%26');
    s = s.replace(/\#/g, '%23');
    s = s.replace(/\+/g, '%2B');
    s = s.replace(/\=/g, '%3D');
    s = s.replace(/ /g, '+');
    return s;
  },
  dateFromISO8601: function(string)
  {
    var dateArray = string.match(/(\d\d\d\d)(?:-?(\d\d)(?:-?(\d\d)(?:[T ](\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(?:Z|(?:([-+])(\d\d)(?::?(\d\d))?)?)?)?)?)?/);
  
    var date = new Date(dateArray[1], 0, 1);
    date.time = false;

    if (dateArray[2]) {
      date.setMonth(dateArray[2] - 1);
    }
    if (dateArray[3]) {
      date.setDate(dateArray[3]);
    }
    if (dateArray[4]) {
      date.setHours(dateArray[4]);
      date.time = true;
      if (dateArray[5]) {
        date.setMinutes(dateArray[5]);
        if (dateArray[6]) {
          date.setSeconds(dateArray[6]);
          if (dateArray[7]) {
            date.setMilliseconds(Number("0." + dateArray[7]) * 1000);
          }
        }
      }
    }
    return date;
  },
  iso8601FromDate: function(date)
  {
    var string = date.getFullYear().toString();
    var month = date.getMonth() + 1;
    if (month <= 9) {
      month = "0" + month;
    }
    string += month.toString();
    var day = date.getDate();
    if (day <= 9) {
      day = "0" + day;
    }
    string += day.toString();
    if (date.time) {
      string += "T";
      var hours = date.getHours();
      if (hours <= 9) {
        string += "0";
      }
      string += hours.toString();
      var minutes = date.getMinutes();
      if (minutes <= 9) {
        string += "0";
      }
      string += minutes.toString();
      var seconds = date.getSeconds();
      if (seconds <= 9) {
        string += "0";
      }
      string += seconds.toString();
    }
    return string;
  }
};

Operator.init();
