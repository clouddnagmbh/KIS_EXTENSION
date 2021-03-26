sap.ui.define([
	"at/clouddna/training00/FioriDeepDive/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox",
	"at/clouddna/training00/FioriDeepDive/formatter/formatter",
	"sap/ui/core/routing/History",
	"sap/m/UploadCollectionParameter"
], function (e, t, s, MessageBox, o, n, UploadCollectionParameter) {
	"use strict";
	return sap.ui.controller("at.clouddna.training00.FioriDeepDive.ZHOFIO_00Extension.controller.CustomerCustom", {
		//    formatter: o,
		//    _fragmentList: {},
		//    _sMode: "",
		//    onInit: function () {
		//        this.getRouter().getRoute("Customer").attachPatternMatched(this._onPatternMatched, this);
		//    },

		_sCustomerId: "",
		_onPatternMatched: function (e) {
			let s = new t({
					editmode: false
				}),
				i = e.getParameter("arguments").customerid;
			this.setModel(s, "editModel");

			this._oUploadCollection = this.getView().byId("attachments_uploadcolletion");

			if (i !== "create") {
				this._sMode = "display";
				this._showCustomerFragment("DisplayCustomer");
				this._sCustomerId = i;
				this.getView().bindElement({
					path: "/CustomerSet(guid'" + i + "')",
					events: {
						dataRequested: function () {
							this.logInfo("Customer " + i + " was requested");
							this.getView().setBusy(true);
						}.bind(this),
						dataReceived: function (e) {
							if (e.getParameter("data")) {
								this.logInfo("Customer " + i + " was received");
							} else {
								this.logError("Customer " + i + " was not found");
							}
							this.getView().setBusy(false);
						}.bind(this)
					}
				});
				this.logInfo("Display Customer");
				this.getView().byId("customer_button_attachments").setVisible(true);
			} else {
				this.getView().byId("customer_button_attachments").setVisible(false);
				this._sMode = "create";
				let e = new t({
					Firstname: "",
					Lastname: "",
					AcademicTitle: "",
					Gender: "M",
					Email: "",
					Phone: "",
					Website: ""
				});
				this.setModel(e, "createModel");
				s.setProperty("/editmode", true);
				this._showCustomerFragment("CreateCustomer");
				this.logInfo("Create Customer");
			}
		},

		_oAttachmentsDialog: null,

		onOpenAttachments: function (oEvent) {
			if (this._oAttachmentsDialog) {
				this._oUploadCollection = this.getView().byId("attachments_uploadcolletion");
				this._oAttachmentsDialog.open();
				this._oUploadCollection.setUploadUrl(this.getModel().sServiceUrl + this.getView().getBindingContext().sPath + "/Documents");
			} else {
				s.load({
					id: this.getView().getId(),
					name: "at.clouddna.training00.FioriDeepDive.ZHOFIO_00Extension.view.AttachmentsDialog",
					controller: this
				}).then(function (oDialog) {
					this._oAttachmentsDialog = oDialog;
					this._oAttachmentsDialog.addStyleClass(this._getContentDensitClass());
					this.getView().addDependent(this._oAttachmentsDialog);
					this._oAttachmentsDialog.open();
					this._oUploadCollection = this.getView().byId("attachments_uploadcolletion");
					this._oUploadCollection.setUploadUrl(this.getModel().sServiceUrl + this.getView().getBindingContext().sPath + "/Documents");
				}.bind(this));
			}
		},

		onAttachmentsDialogClose: function () {
			this._oAttachmentsDialog.close();
		},

		formatUploadItemUrl: function (sDocId) {
			return this.getModel().sServiceUrl + "/CustomerDocumentSet(DocId=guid'" + sDocId +
				"',CustomerId=guid'" + this._sCustomerId + "')/$value";
		},

		onBeforeUploadStarts: function (oEvent) {
			let oHeaderSlug = new UploadCollectionParameter({
				name: "slug",
				value: oEvent.getParameter("fileName")
			});

			oEvent.getParameters().addHeaderParameter(oHeaderSlug);
		},

		onUploadChange: function (oEvent) {
			this._oUploadCollection.removeAllHeaderParameters();

			let oCSRFHeader = new UploadCollectionParameter({
				name: "x-csrf-token",
				value: this.getModel().getSecurityToken()
			});

			this._oUploadCollection.addHeaderParameter(oCSRFHeader);
		},

		onUploadComplete: function (oEvent) {
			this.getModel().refresh();
		},

		onDocumentDelete: function (oEvent) {
			let sDocumentPath = oEvent.getSource().getBindingContext().sPath;

			MessageBox.confirm(this.geti18nText("dialog.delete.attachment"), {
				onClose: function (sAction) {
					if (sAction === MessageBox.Action.OK) {
						this.getView().setBusy(true);

						this.getModel().remove(sDocumentPath, {
							success: function (oData, reponse) {
								MessageBox.success(this.geti18nText("dialog.delete.attachment.success"));
								this.logInfo("Delete successful for " + sDocumentPath);
								this.getView().setBusy(false);
							}.bind(this),
							error: function (oError) {
								MessageBox.error(oError.message);
								this.logError("Delete not successul for " + sDocumentPath);
								this.getView().setBusy(false);
							}.bind(this)
						});
					}
				}.bind(this)
			});
		},

		//    onEditPress: function (e) {
		//        this._toggleEdit(true);
		//    },
		//    onSavePress: function (e) {
		//        this.getView().setBusy(true);
		//        if (this._sMode === "create") {
		//            let e = this.getModel(), t = this.getModel("createModel").getData();
		//            e.create("/CustomerSet", t, {
		//                success: function (e, t) {
		//                    this.logInfo("Customer was created");
		//                    this.getView().setBusy(false);
		//                    i.information(this.geti18nText("dialog.create.success"), {
		//                        onClose: function () {
		//                            this.onNavBack();
		//                        }.bind(this)
		//                    });
		//                }.bind(this),
		//                error: function (e) {
		//                    this.logError("Customer was not created");
		//                    this.getView().setBusy(false);
		//                    i.error(e.message, {
		//                        onClose: function () {
		//                            this.onNavBack();
		//                        }.bind(this)
		//                    });
		//                }.bind(this)
		//            });
		//        } else {
		//            if (this.getModel().hasPendingChanges()) {
		//                this.getModel().submitChanges({
		//                    success: function () {
		//                        i.information(this.geti18nText("dialog.update.success"));
		//                        this.logInfo("Customer saved");
		//                        this.getView().setBusy(false);
		//                    }.bind(this),
		//                    error: function () {
		//                        i.error(this.geti18nText("dialog.update.error"));
		//                        this.logError("Customer was not saved");
		//                        this.getView().setBusy(false);
		//                    }.bind(this)
		//                });
		//            }
		//            this.getView().setBusy(false);
		//            this._toggleEdit(false);
		//        }
		//    },
		//    onCancelPress: function (e) {
		//        i.confirm(this.geti18nText("dialog.cancel"), {
		//            onClose: function (e) {
		//                if (e === i.Action.OK) {
		//                    if (this._sMode === "create") {
		//                        this.onNavBack();
		//                    } else {
		//                        if (this.getModel().hasPendingChanges()) {
		//                            this.getModel().resetChanges();
		//                        }
		//                        this._toggleEdit(false);
		//                    }
		//                }
		//            }.bind(this)
		//        });
		//    },
		//    _toggleEdit: function (e) {
		//        let t = this.getView().getModel("editModel");
		//        t.setProperty("/editmode", e);
		//        this.setDirtyState(e);
		//        this._showCustomerFragment(e ? "EditCustomer" : "DisplayCustomer");
		//    },
		//    _showCustomerFragment: function (e) {
		//        let t = this.getView().byId("page");
		//        t.removeAllContent();
		//        if (this._fragmentList[e]) {
		//            t.insertContent(this._fragmentList[e]);
		//        } else {
		//            s.load({
		//                id: this.getView().createId(e),
		//                name: "at.clouddna.training00.FioriDeepDive.view." + e,
		//                controller: this
		//            }).then(function (s) {
		//                this._fragmentList[e] = s;
		//                t.insertContent(this._fragmentList[e]);
		//            }.bind(this));
		//        }
		//    }
	});
});