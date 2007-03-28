function Address() {
}

ufJSParser.microformats.Address = {
  version: "0.2",
  mfName: "Address",
  mfObject: Address,
  className: "adr",
  definition: {
    properties: {
      "type" : {
        value: [],
        types: ["work", "home", "pref", "postal", "dom", "intl", "parcel"]
      },
      "post-office-box" : {
        value: ""
      },
      "street-address" : {
        value: []
      },
      "extended-address" : {
        value: ""
      },
      "region" : {
        value: ""
      },
      "locality" : {
        value: ""
      },
      "postal-code" : {
        value: ""
      },
      "country-name" : {
        value: ""
      }
    }
  }
};
