/*extern Microformats, Operator, Components, content */

var Operator_Statusbar = {
  addPopup: function(menu, clone)
  {
    if (!this.isHidden()) {
      if (menu) {
        /* Position popup? */
/*            popup.setAttribute("position", "before_start"); */
        if (clone) {
          var newmenu = menu.cloneNode(true);
          var menuitems = menu.getElementsByTagName("menuitem");
          var newmenuitems = newmenu.getElementsByTagName("menuitem");
          for(var i=0; i < menuitems.length; i++) {
            if (menuitems[i].store_oncommand) {
              newmenuitems[i].addEventListener("command", menuitems[i].store_oncommand, true);
            }
            if (menuitems[i].store_onclick) {
              newmenuitems[i].addEventListener("click", menuitems[i].store_onclick, true);
            }
            if (menuitems[i].store_onDOMMenuItemActive) {
              newmenuitems[i].addEventListener("DOMMenuItemActive", menuitems[i].store_onDOMMenuItemActive, true);
            }
          }
          var menus = menu.getElementsByTagName("menu");
          var newmenus = newmenu.getElementsByTagName("menu");
          for(var i=0; i < menus.length; i++) {
            if (menus[i].store_onpopupshowing) {
              newmenus[i].addEventListener("popupshowing", menus[i].store_onpopupshowing, true);
            }
          }
          document.getElementById("operator-statusbar").appendChild(newmenu);
        } else {
          document.getElementById("operator-statusbar").appendChild(menu);
        }
        return true;
      }
    }
    return false;
  },
  clearPopup: function()
  {
    if (!this.isHidden()) {
      var statusbar = document.getElementById("operator-statusbar");
      while (statusbar.firstChild) {
        statusbar.removeChild(statusbar.firstChild);
      }
    }

  },
  disable: function()
  {
    if (!this.isHidden()) {
      document.getElementById("operator-statusbar").setAttribute("disabled", "true");
      document.getElementById("operator-statusbar").src="chrome://operator/content/operator_small_disabled.png";
      document.getElementById("operator-statusbar").setAttribute("tooltiptext", Operator.languageBundle.GetStringFromName("operatorNoMicroformats"));
    }
  },
  enable: function()
  {
    if (!this.isHidden()) {
      document.getElementById("operator-statusbar").setAttribute("disabled", "false");
      document.getElementById("operator-statusbar").src="chrome://operator/content/operator_small.png";
      document.getElementById("operator-statusbar").setAttribute("tooltiptext", Operator.languageBundle.GetStringFromName("operatorFoundMicroformats"));
    }
  },
  hide: function()
  {
    document.getElementById("operator-statusbar").hidden = true;
  },
  show: function()
  {
    document.getElementById("operator-statusbar").hidden = false;
    this.clearPopup();
  },
  isHidden: function()
  {
    return document.getElementById("operator-statusbar").hidden;
  }
};

