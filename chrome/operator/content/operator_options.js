/*extern Components, sizeToContent, Operator, ufJSActions */

var Operator_Options = {
  prefBranch: null,
  saveOptions: function() 
  {
    var i;
    this.prefBranch.setBoolPref("batchPrefChanges", true);
    this.checkAndSetIntPref("view", document.getElementById("view").value);
    this.checkAndSetBoolPref("useDescriptiveNames", document.getElementById("useDescriptiveNames").checked);
    this.checkAndSetBoolPref("debug", document.getElementById("debug").checked);
    this.checkAndSetBoolPref("statusbar", document.getElementById("statusbar").checked);
    this.checkAndSetBoolPref("highlightMicroformats", document.getElementById("highlightMicroformats").checked);
    this.checkAndSetBoolPref("removeDuplicates", document.getElementById("removeDuplicates").checked);
    this.checkAndSetBoolPref("observeDOMAttrModified", document.getElementById("observeDOMAttrModified").checked);
    var microformats = document.getElementById("microformats");
    for (i=0; i < microformats.getRowCount(); i++) {
      var label = microformats.getItemAtIndex(i).label;
      this.checkAndSetCharPref("microformat" + (i+1), label); 
    }
    
    var haveMorePrefs = true;
    do {
      try {
        this.prefBranch.clearUserPref("microformat" + (i+1));
      }
      catch (ex)
      {
        haveMorePrefs = false;
      }
      i++;
    }
    while (haveMorePrefs);
    
    var actions = document.getElementById("actions");
    for (i=0; i < actions.getRowCount(); i++) {
      this.checkAndSetComplexPref("action" + (i+1), actions.getItemAtIndex(i).label);
      var values = actions.getItemAtIndex(i).value.split("|");
      this.checkAndSetCharPref("action" + (i+1) + ".microformat", values[0]);
      this.checkAndSetCharPref("action" + (i+1) + ".handler", values[1]);
    }
  
    haveMorePrefs = true;
    do {
      try {
        this.prefBranch.clearUserPref("action" + (i+1));
      }
      catch (ex)
      {
        haveMorePrefs = false;
      }
      try {
        this.prefBranch.clearUserPref("action" + (i+1) + ".microformat");
      }
      catch (ex)
      {
        haveMorePrefs = false;
      }
      try {
        this.prefBranch.clearUserPref("action" + (i+1) + ".handler");
      }
      catch (ex)
      {
        haveMorePrefs = false;
      }
      i++;
    }
    while (haveMorePrefs);
    this.prefBranch.clearUserPref("batchPrefChanges");
  },

  checkAndSetIntPref: function(pref, value)
  {
    var prefValue;
    try {
      prefValue = this.prefBranch.getIntPref(pref);
    } catch (ex)
    {
      prefValue = undefined;
    }
    if (prefValue != value) {
      this.prefBranch.setIntPref(pref, value);
    }
  },
  checkAndSetBoolPref: function(pref, value)
  {
    var prefValue;
    try {
      prefValue = this.prefBranch.getBoolPref(pref);
    } catch (ex)
    {
      prefValue = undefined;
    }
    if (prefValue != value) {
      this.prefBranch.setBoolPref(pref, value);
    }
  },
  checkAndSetCharPref: function(pref, value)
  {
    var prefValue;
    try {
      prefValue = this.prefBranch.getCharPref(pref);
    } catch (ex)
    {
      prefValue = undefined;
    }
    if (prefValue != value) {
      this.prefBranch.setCharPref(pref, value);
    }
  },

  checkAndSetComplexPref: function(pref, value)
  {
    var prefValue;
    try {
      prefValue = this.prefBranch.getComplexValue(pref, Components.interfaces.nsISupportsString).data;
    } catch (ex)
    {
      prefValue = undefined;
    }
    if (prefValue != value) {
      var str = Components.classes["@mozilla.org/supports-string;1"].
                           createInstance(Components.interfaces.nsISupportsString);
      str.data = value;
      this.prefBranch.setComplexValue(pref, Components.interfaces.nsISupportsString, str);
    }
  },

                             
  onPageLoad: function() 
  {
    this.prefBranch = Components.classes["@mozilla.org/preferences-service;1"].
                                 getService(Components.interfaces.nsIPrefService).
                                 getBranch("extensions.operator.");


    var view = 0;
    try {
      view = this.prefBranch.getIntPref("view");
    } catch (ex) {
    }
    document.getElementById("view").value = view;

    try {
      document.getElementById("useDescriptiveNames").checked = this.prefBranch.getBoolPref("useDescriptiveNames");
    } catch (ex) {
    }

    try {
      document.getElementById("debug").checked = this.prefBranch.getBoolPref("debug");
    } catch (ex) {
    }

    try {
      document.getElementById("statusbar").checked = this.prefBranch.getBoolPref("statusbar");
    } catch (ex) {
    }

    try {
      document.getElementById("highlightMicroformats").checked = this.prefBranch.getBoolPref("highlightMicroformats");
    } catch (ex) {
    }

    try {
      document.getElementById("observeDOMAttrModified").checked = this.prefBranch.getBoolPref("observeDOMAttrModified");
    } catch (ex) {
    }
  
    var i=1;
    var microformats = document.getElementById("microformats");
    var microformat, handler;
    var listitem;
    do {
      try {
        microformat = this.prefBranch.getCharPref("microformat" + i);
      } catch (ex) {
        break;
      }
      if (microformat) {
        listitem = microformats.appendItem(microformat);
      }
      i++;
    } while (1);
  
    i=1;
    var actions = document.getElementById("actions");
    var action;
    do {
      try {
        action = this.prefBranch.getComplexValue("action" + i, Components.interfaces.nsISupportsString).data;
        microformat = this.prefBranch.getCharPref("action" + i + ".microformat");
        handler = this.prefBranch.getCharPref("action" + i + ".handler");
      } catch (ex) {
        break;
      }
      if (action) {
        listitem = actions.appendItem(action, microformat + "|" + handler);
      }
      i++;
    } while (1);

    var userscripts = document.getElementById("userscripts");
    var file = Components.classes["@mozilla.org/file/directory_service;1"].
                          getService(Components.interfaces.nsIProperties).
                          get("ProfD", Components.interfaces.nsILocalFile);
    file.append("microformats");
    
    if (file.exists() && file.isDirectory()) {
      var e = file.directoryEntries;
      while (e.hasMoreElements()) {
        var f = e.getNext().QueryInterface(Components.interfaces.nsIFile);
        var splitpath = f.path.split(".");
        if ((splitpath[splitpath.length-1] == "js") || (splitpath[splitpath.length-1] == "xsl")) {
          var fileHandler = Components.classes["@mozilla.org/network/io-service;1"].
                                       getService(Components.interfaces.nsIIOService).
                                       getProtocolHandler("file").
                                       QueryInterface(Components.interfaces.nsIFileProtocolHandler);
          listitem = userscripts.appendItem(f.leafName, "");
        }
      }
    }
  },
  
  doMicroformatEnabling: function()
  {
    if (document.getElementById('view').value == "1") {
      document.getElementById('useDescriptiveNames').setAttribute('disabled', 'true');
    } else {
      document.getElementById('useDescriptiveNames').setAttribute('disabled', 'false');
    }
  },
  
  onNewMicroformat: function()
  {
    window.openDialog("chrome://operator/content/operator_options_microformat.xul","newmicroformat","chrome,centerscreen,modal");
  },
  
  onEditMicroformat: function()
  {
    window.openDialog("chrome://operator/content/operator_options_microformat.xul","editmicroformat","chrome,centerscreen,modal");
  },
  
  onNewAction: function()
  {
    window.openDialog("chrome://operator/content/operator_options_action.xul","newaction","chrome,centerscreen,modal");
  },
  
  onEditAction: function()
  {
    window.openDialog("chrome://operator/content/operator_options_action.xul","editaction","chrome,centerscreen,modal");
  },
  
  disableNewMicroformat: function()
  {
    var numMicroformats = 0;
    var i;
    for (i in ufJSParser.microformats) {
      numMicroformats++;
    }

    if (document.getElementById("microformats").getRowCount() == numMicroformats) {
      return true;
    }
    return false;
  },
  
  /* microformat dialog */
  
  
  onMicroformatLoad: function()
  {
    var microformat = null;
    var handler = null;
    var selectedItem = null;
    var edit = false;
    var microformats = window.opener.document.getElementById("microformats");
    if (window.name == 'editmicroformat') {
      edit = true;
      microformat = microformats.selectedItem.label;
      handler = microformats.selectedItem.value;
    }
  
    var microformatmenu = document.getElementById("microformats");
    var i, j;
    var add;
    for (i in ufJSParser.microformats)
    {
      add = true;
      /* if it is not already in the list */
      for (j=0; j < microformats.getRowCount(); j++) {
        var item = microformats.getItemAtIndex(j);
        if (item.label == i) {
          add = false;
          break;
        }
      }
      if ((add) || ((i == microformat) && (edit))) {
        var menulistitem = microformatmenu.appendItem(i);
        menulistitem.minWidth=microformatmenu.width;
        if (i == microformat) {
          selectedItem = menulistitem;
        }
      }
      
    }
  
    if (window.name == 'editmicroformat') {
      microformatmenu.selectedItem = selectedItem;
    } else {
      microformatmenu.selectedIndex = 0;
    }
    sizeToContent();
  },
  
  onMicroformatOK: function()
  {
    var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].
                                   getService(Components.interfaces.nsIPromptService);
  
    var microformats = window.opener.document.getElementById("microformats");
    var microformat = document.getElementById("microformats").selectedItem.label;
  
    var microformatExists = false;
    for (var i=0; i < microformats.getRowCount(); i++) {
      if (microformats.getItemAtIndex(i).label == microformat) {
        microformatExists = true;
        break;
      }
    }
  
    if (window.name == 'newmicroformat') {
      if (microformatExists) {
        promptService.alert(window, "Error", "That microformat is already in the list");
        return false;
      }
      var listitem = microformats.appendItem(microformat);
    } else {
      var selectedItem = microformats.selectedItem;
  
      if (microformatExists) {
        if (selectedItem.label != microformat) {
          promptService.alert(window, "Error", "That microformat is already in the list");
          return false;
        }
      }
      selectedItem.label = microformat;
    }
  },
  
  
  /* Action dialog */
  
  onActionLoad: function()
  {
    var microformat = null;
    var handler = null;
    var selectedItem = null;
    var actions;
    var values;
    if (window.name == 'editaction') {
      actions = window.opener.document.getElementById("actions");
      values = actions.selectedItem.value.split("|");
      microformat = values[0];
      handler = values[1];
    }
  
    var microformatmenu = document.getElementById("microformats");
    var i;
    for (i in ufJSParser.microformats)
    {
      var menulistitem = microformatmenu.appendItem(i);
      menulistitem.minWidth=microformatmenu.width;
      if (i == microformat) {
        selectedItem = menulistitem;
      }
      
    }
  
    if (window.name == 'editaction') {
      actions = window.opener.document.getElementById("actions");
      document.getElementById("action").value = actions.selectedItem.label;
      values = actions.selectedItem.value.split("|");
      microformatmenu.selectedItem = selectedItem;
    } else {
      microformatmenu.selectedIndex = 0;
    }
    this.onChangeMicroformat(handler);
    sizeToContent();
    this.actionCheckOKButton();
  },
  
  onChangeMicroformat: function(action)
  {
    var selectedItem = null;
    var microformat = document.getElementById("microformats").selectedItem.label;
    var handlermenu = document.getElementById("handlers");
  
    handlermenu.removeAllItems();

    for (var i in ufJSActions.actions) {
      if (!ufJSActions.actions[i].scope.microformats[microformat]) {
        continue;
      }
      var menulistitem = handlermenu.appendItem(ufJSActions.actions[i].description, i);
      if (action) {
        if (i == action) {
          selectedItem = menulistitem;
        }
      }
      menulistitem.minWidth = handlermenu.width;
    }
    if (selectedItem) {
      handlermenu.selectedItem = selectedItem;
    } else {
      handlermenu.selectedIndex = 0;
    }
  },
  
  onActionOK: function()
  {
    var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].
                                   getService(Components.interfaces.nsIPromptService);
    var actions = window.opener.document.getElementById("actions");
    var action = document.getElementById("action").value;
    var microformat = document.getElementById("microformats").selectedItem.label;
    var handler = document.getElementById("handlers").selectedItem.value;
  
    var actionExists = false;
    for (var i=0; i < actions.getRowCount(); i++) {
      if (actions.getItemAtIndex(i).value == microformat + "|" + handler) {
        actionExists = true;
        break;
      }
    }
    
    if (window.name == 'newaction') {
      if (actionExists) {
        promptService.alert(window, "Error", "That action already exists as: " + actions.getItemAtIndex(i).label);
        return false;
      }
      var listitem = actions.appendItem(action, microformat + "|" + handler);
    } else {
      var selectedItem = actions.selectedItem;
      if (actionExists) {
        if (selectedItem.value != microformat + "|" + handler) {
          promptService.alert(window, "Error", "That action already exists as: " + actions.getItemAtIndex(i).label);
          return false;
        }
      }
      selectedItem.label = action;
      selectedItem.value = microformat + "|" + handler;
    }
  },
  
  actionCheckOKButton: function()
  {
    if ((document.getElementById("action")) && (document.getElementById("action").value)) {
      document.documentElement.getButton("accept").setAttribute( "disabled", "false" );
    } else {
      document.documentElement.getButton("accept").setAttribute( "disabled", "true" );  
    }
  },
  onNewUserScript: function()
  {
    try {
      var nsIFilePicker = Components.interfaces.nsIFilePicker;
      var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
      fp.init(window, "Choose File...", nsIFilePicker.modeOpen);
      fp.appendFilters(nsIFilePicker.filterHTML | nsIFilePicker.filterText |
                       nsIFilePicker.filterAll | nsIFilePicker.filterImages | nsIFilePicker.filterXML);
  
      if (fp.show() == nsIFilePicker.returnOK && fp.fileURL.spec && fp.fileURL.spec.length > 0) {
        var dest = Components.classes["@mozilla.org/file/directory_service;1"].
                              getService(Components.interfaces.nsIProperties).
                              get("ProfD", Components.interfaces.nsILocalFile);
        dest.append("microformats");
        /* check if microformats exists and if not, create it */
        try {
          var destfile = dest.clone();
          destfile.append(fp.file.leafName);
          if (destfile.exists()) {
            var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].
                                           getService(Components.interfaces.nsIPromptService);
            var sure = promptService.confirm(window, "", fp.file.leafName + " already exists. Do you want to replace it?");
            if (sure) {
              destfile.remove(false);
            } else {
              return;
            }
          } else {
            document.getElementById('userscripts').appendItem(fp.file.leafName, "");
          }
          fp.file.copyTo(dest, "");
        } catch (ex) {
        }
      }
    }
    catch(ex) {
    }
  },
  
  onDeleteUserScript: function()
  {
    var listbox = document.getElementById('userscripts');
    var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].
                                   getService(Components.interfaces.nsIPromptService);
    var sure = promptService.confirm(window, "", "This will remove " + listbox.selectedItem.label);
    if (sure) {
      var dest = Components.classes["@mozilla.org/file/directory_service;1"].
                            getService(Components.interfaces.nsIProperties).
                            get("ProfD", Components.interfaces.nsILocalFile);
      dest.append("microformats");
      dest.append(listbox.selectedItem.label);
      try {
        dest.remove(true);
      } catch(ex) {}
      return true;
    }
    return false;
  }
};
