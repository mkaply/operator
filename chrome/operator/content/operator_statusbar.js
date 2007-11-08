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
          var menupops = menu.getElementsByTagName("menupopup");
          var newmenupops = newmenu.getElementsByTagName("menupopup");
          for(var i=0; i < menupops.length; i++) {
            if (menupops[i].store_onpopupshowing) {
              newmenupops[i].addEventListener("popupshowing", menupops[i].store_onpopupshowing, true);
            }
          }
          document.getElementById("status-bar").appendChild(newmenu);
          newmenu.id="operator-statusbarpanel-contextmenu";
          newmenu.setAttribute("id", "operator-statusbarpanel-contextmenu");
          document.getElementById("operator-statusbarpanel").context="operator-statusbarpanel-contextmenu";
          document.getElementById("operator-statusbarpanel").setAttribute("context", "operator-statusbarpanel-contextmenu");
          newmenu.setAttribute("position", "before_end");
        } else {
          document.getElementById("status-bar").appendChild(menu);
          menu.id="operator-statusbarpanel-contextmenu";
          menu.setAttribute("id", "operator-statusbarpanel-contextmenu");
          document.getElementById("operator-statusbarpanel").context="operator-statusbarpanel-contextmenu";
          document.getElementById("operator-statusbarpanel").setAttribute("context", "operator-statusbarpanel-contextmenu");
          menu.setAttribute("position", "before_end");
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
      document.getElementById("operator-statusbarpanel").setAttribute("disable", "true");
    }
  },
  enable: function()
  {
    if (this.isVisible()) {
      document.getElementById("operator-statusbarpanel").setAttribute("disable", "false");
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

