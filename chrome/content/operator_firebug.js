FBL.ns(function() { with (FBL) { 
Firebug.FirebugTestExtension = extend(Firebug.Module, 
{ 
  shutdown: function()
  {
    if(Firebug.getPref('defaultPanelName')=='FirebugTestExtension') {
      Firebug.setPref('defaultPanelName','console');
    }
  },
  commandCallbackGenerator: function(formatname)
  {
    return function(event) {
      FirebugContext.getPanel("FirebugTestExtension").displayMicroformat(formatname);
    };
  },
  showPanel: function(browser, panel) 
  { 
    var isFirebugTestExtension = panel && panel.name == "FirebugTestExtension";
    var FirebugMicroformatButtons = browser.chrome.$("fbFirebugMicroformatButtons"); 
    collapse(FirebugMicroformatButtons, !isFirebugTestExtension);
    var button;

    if (isFirebugTestExtension) {
      
    var toolbar = document.getElementById("fbFirebugMicroformatButtons");
    var toolbarbuttons = toolbar.getElementsByTagName("toolbarbutton");
    for(i=toolbarbuttons.length - 1; i>=0; i--) {
      toolbar.removeChild(toolbar.childNodes[i]);
    }

      
      
    for(i=toolbarbuttons.length - 1; i>=0; i--) {
      if (toolbarbuttons[i].id != "operator-options") {
        toolbar.removeChild(toolbar.childNodes[i]);
      }
    }

         var microformatsArrays = ufJS.getElementsByMicroformat(content.document);
          for (foo in microformatsArrays) {
            if (microformatsArrays[foo].length > 0) {
             button = document.createElement("toolbarbutton");
             button.setAttribute("label",  foo);
             button.setAttribute("class", "toolbar-text-button");
             button.addEventListener("command", this.commandCallbackGenerator(foo), true);
             
             document.getElementById("fbFirebugMicroformatButtons").appendChild(button);
            }
          }

/*          
          var foo;
          var bar;
          for (foo in microformatsArrays) {
            for (bar in microformatsArrays[foo]) {
              FirebugContext.getPanel("FirebugTestExtension").printLine(Operator.dump_microformat(microformatsArrays[foo][bar], foo));
            }
          }
*/
    }

  }, 
  displayMicroformat: function(microformat) 
  {
     var microformatsArrays = ufJS.getElementsByMicroformat(content.document);
      if (microformatsArrays[microformat].length > 0) {
        FirebugContext.getPanel("FirebugTestExtension").printLine(microformat);
      }
    

    FirebugContext.getPanel("FirebugTestExtension").printLine('Clicked Button 1'); 
  }, 
  button2: function() 
  { 
    FirebugContext.getPanel("FirebugTestExtension").printLine('Clicked Button 2');
  } 
}); 
function FirebugTestExtensionPanel() {} 
FirebugTestExtensionPanel.prototype = extend(Firebug.Panel, 
{ 
  name: "FirebugTestExtension", 
  title: "Microformats", 
  searchable: false, 
  editable: false,

  printLine: function(message) {
    var elt = this.document.createElement("p");
    elt.innerHTML = message;
    this.panelNode.appendChild(elt);
  },
    displayMicroformat: function(microformat) 
  {
    clearNode(this.panelNode);
    var tree = this.document.createElement("tree");
    tree.setAttribute("open", "true");
    tree.setAttribute("container", "true");
    var foo = this.document.createElement("treechildren");
    foo.setAttribute("flex", "1");
    tree.appendChild(foo);
    var foo2 = this.document.createElement("treeitem");
    foo2.setAttribute("container", "true");
    foo2.setAttribute("parent", "true");
    foo.appendChild(foo2);
    var foo3 = this.document.createElement("treerow");
    foo2.appendChild(foo3);
    var foo4 = this.document.createElement("treecell");
    foo4.setAttribute("label", "One");
    foo3.appendChild(foo4);
    foo4 = this.document.createElement("treecell");
    foo4.setAttribute("label", "Two");
    foo3.appendChild(foo4);
    this.panelNode.appendChild(tree);
    
    
    
    /*
     var microformatsArrays = ufJS.getElementsByMicroformat(content.document);
      if (microformatsArrays[microformat].length > 0) {
        for (bar in microformatsArrays[microformat]) {
          var displayname = Microformats[microformat].getDisplayName(microformatsArrays[microformat][bar]);
          if (displayname) {
            FirebugContext.getPanel("FirebugTestExtension").printLine(displayname);
          } else {
            var errormsg = Microformats[microformat].getError(microformatsArrays[microformat][bar]);
            FirebugContext.getPanel("FirebugTestExtension").printLine(errormsg);
          }
        }
      }
    

    FirebugContext.getPanel("FirebugTestExtension").printLine('Clicked Button 1');
    */
  }, 

}); 
Firebug.registerModule(Firebug.FirebugTestExtension); 
Firebug.registerPanel(FirebugTestExtensionPanel); 
}});
