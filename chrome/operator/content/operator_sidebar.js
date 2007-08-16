/*extern Microformats, Operator, Components, content */

var Operator_Sidebar = {
  clear: function(event)
  {
    if (!Operator_Sidebar.isVisible()) {
      return;
    }
    var doc = document.getElementById("sidebar").contentDocument;
    var tree = doc.getElementById("operator-sidebar-tree")

    var treechildren = doc.getElementById("operator-sidebar-treechildren")
    if (treechildren) {
      for(let i=treechildren.childNodes.length - 1; i>=0; i--) {
        treechildren.removeChild(treechildren.childNodes.item(i));
      }
      tree.removeChild(treechildren);
    }
  },
  populate: function(semanticArrays) {
    if (!Operator_Sidebar.isVisible()) {
      return;
    }
    if (!semanticArrays) {
      /* Get all semantic data from the web page */
      semanticArrays = [];
      for (let i in Microformats) {
        semanticArrays[i] = Microformats.get(i, content.document);
      }
      Operator.getSemanticData(content, semanticArrays);
    }
    Operator_Sidebar.clear();

    var doc = document.getElementById("sidebar").contentDocument;
    var tree = doc.getElementById("operator-sidebar-tree")
    var addedContent = false;

    var main_treechildren = doc.createElement("treechildren");
    main_treechildren.setAttribute("id", "operator-sidebar-treechildren");
    for (let i=0; i< Operator.dataformats.length; i++) {
      if (semanticArrays[Operator.dataformats[i]] && semanticArrays[Operator.dataformats[i]].length > 0) {
        var main_treeitem = doc.createElement("treeitem");
        main_treeitem.setAttribute("container", "true");
        main_treeitem.setAttribute("open", "true");
        var main_treerow = doc.createElement("treerow");
        var main_treecell = doc.createElement("treecell");
        if (Microformats[Operator.dataformats[i]].description) {
          main_treecell.setAttribute("label", Microformats[Operator.dataformats[i]].description);
        } else {
          main_treecell.setAttribute("label", Operator.dataformats[i]);
        }
        var sub_treechildren = doc.createElement("treechildren");
        var addRow = false;
        for (let j=0; j< semanticArrays[Operator.dataformats[i]].length; j++) {
          var label = semanticArrays[Operator.dataformats[i]][j].toString();
          if (label) {
            addRow = true;
            var sub_treeitem = doc.createElement("treeitem");
            sub_treeitem.store_onpopupshowing = Operator.popupShowing(semanticArrays[Operator.dataformats[i]][j], Operator.dataformats[i]);
            var sub_treerow = doc.createElement("treerow");
            var sub_treecell = doc.createElement("treecell");
            sub_treecell.setAttribute("label", semanticArrays[Operator.dataformats[i]][j].toString());
            sub_treerow.appendChild(sub_treecell);
            sub_treeitem.appendChild(sub_treerow);
            sub_treechildren.appendChild(sub_treeitem);
            addedContent = true;
          }
        }
        if (addRow) {
          main_treerow.appendChild(main_treecell);
          main_treeitem.appendChild(main_treerow);
          main_treeitem.appendChild(sub_treechildren);
          main_treechildren.appendChild(main_treeitem);
        }
      }
    }
    if (!addedContent) {
      var blank_treeitem = doc.createElement("treeitem");
      var blank_treerow = doc.createElement("treerow");
      var blank_treecell = doc.createElement("treecell");
      blank_treecell.setAttribute("label", Operator.languageBundle.GetStringFromName("operatorSidebar.noContent"));
      blank_treerow.appendChild(blank_treecell);
      blank_treeitem.appendChild(blank_treerow);
      main_treechildren.appendChild(blank_treeitem);
    }
    tree.appendChild(main_treechildren);
  },
  isVisible: function()
  {
    return !document.getElementById("sidebar-box").hidden;
  }

};

