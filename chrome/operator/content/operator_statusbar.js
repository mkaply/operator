var Operator_Statusbar = {
  addPopup: function(menu, clone)
  {
    if (this.isVisible()) {
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
          document.getElementById("operator-statusbarpanel").appendChild(newmenu);
        } else {
          document.getElementById("operator-statusbarpanel").appendChild(menu);
        }
        return true;
      }
    }
    return false;
  },
  clearPopup: function()
  {
    if (this.isVisible()) {
      var statusbar = document.getElementById("operator-statusbarpanel");
      while (statusbar.firstChild) {
        statusbar.removeChild(statusbar.firstChild);
      }
    }

  },
  disable: function()
  {
    if (this.isVisible()) {
      document.getElementById("operator-statusbarpanel").setAttribute("disabled", "true");
    }
  },
  enable: function()
  {
    if (this.isVisible()) {
      document.getElementById("operator-statusbarpanel").setAttribute("disabled", "false");
    }
  },
  hide: function()
  {
    document.getElementById("operator-statusbarpanel").hidden = true;
  },
  show: function()
  {
    document.getElementById("operator-statusbarpanel").hidden = false;
    this.clearPopup();
  },
  isVisible: function()
  {
    return !document.getElementById("operator-statusbarpanel").hidden;
  }
};

