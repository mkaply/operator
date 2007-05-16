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
      this.checkAndSetCharPref("action" + (i+1), actions.getItemAtIndex(i).value);
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
      document.getElementById("removeDuplicates").checked = this.prefBranch.getBoolPref("removeDuplicates");
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
        action = this.prefBranch.getCharPref("action" + i );
      } catch (ex) {
        break;
      }
      listitem = actions.appendItem(ufJSActions.actions[action].description, action);
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
    for (i in Microformats) {
      numMicroformats++;
    }

    if (document.getElementById("microformats").getRowCount() == numMicroformats) {
      return true;
    }
    return false;
  },
  
  disableNewAction: function()
  {
    var numActions = 0;
    var i;
    for (i in ufJSActions.actions) {
      numActions++;
    }

    if (document.getElementById("actions").getRowCount() == numActions) {
      return true;
    }
    return false;
  },
  
  /* microformat dialog */
  
  
  onMicroformatLoad: function()
  {
    var microformat = null;
    var selectedItem = null;
    var edit = false;
    var microformats = window.opener.document.getElementById("microformats");
    if (window.name == 'editmicroformat') {
      edit = true;
      microformat = microformats.selectedItem.label;
    }
  
    var microformatmenu = document.getElementById("microformats");
    var i, j;
    var add;
    for (i in Microformats)
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
    var microformats = window.opener.document.getElementById("microformats");
    var microformat = document.getElementById("microformats").selectedItem.label;
  
    if (window.name == 'newmicroformat') {
      var listitem = microformats.appendItem(microformat);
    } else {
      var selectedItem = microformats.selectedItem;
      selectedItem.label = microformat;
    }
  },
  
  
  /* Action dialog */
  
  onActionLoad: function()
  {
    var action = null;
    var selectedItem = null;
    var edit = false;
    var actions = window.opener.document.getElementById("actions");
    if (window.name == 'editaction') {
      edit = true;
      action = actions.selectedItem.value;
    }
  
    var actionmenu = document.getElementById("actions");
    var i, j;
    var add;
    for (i in ufJSActions.actions)
    {
      add = true;
      /* if it is not already in the list */
      for (j=0; j < actions.getRowCount(); j++) {
        var item = actions.getItemAtIndex(j);
        if (item.value == i) {
          add = false;
          break;
        }
      }
      if ((add) || ((i == action) && (edit))) {
        var menulistitem = actionmenu.appendItem(ufJSActions.actions[i].description, i);
        menulistitem.minWidth=actionmenu.width;
        if (i == action) {
          selectedItem = menulistitem;
        }
      }
      
    }
  
    if (window.name == 'editaction') {
      actionmenu.selectedItem = selectedItem;
    } else {
      actionmenu.selectedIndex = 0;
    }
    sizeToContent();
  },
  
  onActionOK: function()
  {
    var actions = window.opener.document.getElementById("actions");
  
    if (window.name == 'newaction') {
      var listitem = actions.appendItem(document.getElementById("actions").selectedItem.label, document.getElementById("actions").selectedItem.value);
    } else {
      var selectedItem = actions.selectedItem;
      selectedItem.label = document.getElementById("actions").selectedItem.label;
      selectedItem.value = document.getElementById("actions").selectedItem.value;
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
