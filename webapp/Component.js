jQuery.sap.declare("at.clouddna.training00.FioriDeepDive.ZHOFIO_00Extension.Component");

// use the load function for getting the optimized preload file if present
sap.ui.component.load({
	name: "at.clouddna.training00.FioriDeepDive",
	// Use the below URL to run the extended application when SAP-delivered application is deployed on SAPUI5 ABAP Repository
	url: "/sap/bc/ui5_ui5/sap/ZHOFIO_00"
		// we use a URL relative to our own component
		// extension application is deployed with customer namespace
});

this.at.clouddna.training00.FioriDeepDive.Component.extend("at.clouddna.training00.FioriDeepDive.ZHOFIO_00Extension.Component", {
	metadata: {
		manifest: "json"
	}
});