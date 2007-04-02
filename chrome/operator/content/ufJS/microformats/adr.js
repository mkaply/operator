function Address() {
}

ufJSParser.microformats.Address = {
  version: "0.7",
  mfObject: Address,
  className: "adr",
  definition: {
    properties: {
      "type" : {
        plural: true,
        types: ["work", "home", "pref", "postal", "dom", "intl", "parcel"]
      },
      "post-office-box" : {
      },
      "street-address" : {
        plural: true,
      },
      "extended-address" : {
      },
      "locality" : {
      },
      "region" : {
      },
      "postal-code" : {
      },
      "country-name" : {
      }
    },
    ufjs: {
      "ufjsDisplayName" : {
        virtual: true,
        virtualGetter: function(mfnode) {
          var address = ufJSParser.createMicroformat(mfnode, "Address");
          var address_text = "";
          if (address["post-office-box"]) {
            address_text += address["post-office-box"];
            address_text += " ";
          }
          if (address["street-address"]) {
            address_text += address["street-address"][0];
            address_text += " ";
          }
          if (address["locality"]) {
            address_text += address["locality"];
            address_text += " ";
          }
          if (address["region"]) {
            address_text += address["region"];
            address_text += " ";
          }
          return address_text;
        }
      }
    }
  }
};
