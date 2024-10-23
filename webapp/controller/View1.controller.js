sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast) {
        "use strict";

        return Controller.extend("zactaddrupdate.controller.View1", {
            onInit: function () {


            },

            onPressPullAddress: function (oEvent) {

                var oNetworkId = this.getView().byId("idNetwork").getValue();
                var oActivityId = this.getView().byId("idActivity").getValue();
                if (oNetworkId === null || oNetworkId === undefined || oNetworkId === "") {
                    MessageToast.show('Please enter the Network ID')
                    return;
                }
                if (oActivityId === null || oActivityId === undefined || oActivityId === "") {
                    MessageToast.show('Please enter the Activity ID')
                    return;
                }

                var oModel = this.getView().getModel();
                var oModelJson = new sap.ui.model.json.JSONModel();
                sap.ui.core.BusyIndicator.show(0);
                //  oModel.read("/DelInfoSet?Network='"+oNetworkId+"'&ActivityId='"+oActivityId+"'", {
                oModel.read("/DelInfoSet(Network='" + oNetworkId + "',ActivityId='" + oActivityId + "')", {
                    success: function (oData, oResponse) {
                        oModelJson.setData(oResponse.data);
                        //    sap.ui.getCore().setModel(oModelJson, "oAddressModel");
                        this.getView().setModel(oModelJson, "oAddressModel")
                        this.getView().byId("idButtonUpdate").setEnabled(true);
                        sap.ui.core.BusyIndicator.hide();
                    }.bind(this),
                    error: function (e) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show(JSON.parse(e.responseText).error.message.value);
                        this.getView().getModel("oAddressModel").setData({});
                        this.getView().byId("idButtonUpdate").setEnabled(false);
                    }.bind(this)
                })


            },

            onPressUpdate: function (oEvent) {

                var oModel = this.getView().getModel();
                if (this.getView().getModel("oAddressModel") !== undefined) {
                    var oAddressData = this.getView().getModel("oAddressModel").getData();
                    var oPayload = {


                        "Network": oAddressData.Network,
                        "ActivityId": oAddressData.ActivityId,
                        "Name1": oAddressData.Name1,
                        "Name2": oAddressData.Name2,
                        "Name3": oAddressData.Name3,
                        "Name4": oAddressData.Name4,
                        "Address": oAddressData.Address,
                        "City": oAddressData.City,
                        "State": oAddressData.State,
                        "ZipCode": oAddressData.ZipCode,
                        "Country": oAddressData.Country
                    };

                }

                sap.ui.core.BusyIndicator.show(0);

                var oNetwork =  this.getView().byId("idNetwork").getValue();
                var oActivity = this.getView().byId("idActivity").getValue();
                if(oNetwork ===  oAddressData.Network && oActivity === oAddressData.ActivityId ){
                    oModel.create("/DelInfoSet", oPayload, {
                        method: "POST",
                        success: function (data, oResponse) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("Address has been successfully updated for the Network' " + oResponse.data.Network + "'");
                            this.getView().getModel("oAddressModel").setData({});
                            this.getView().byId("idButtonUpdate").setEnabled(false);
                        }.bind(this),
                        error: function (e) {
                            //MessageToast.show(e.responseText.split(',')[2].split(":")[1] + ' ' + e.responseText.split(',')[2].split(":")[2]);
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show(JSON.parse(e.responseText).error.message.value);
                            this.getView().byId("idButtonUpdate").setEnabled(false);
                        }.bind(this)
                    });
                }
                else{
                  //  MessageToast.show("No Delivery Info found for Network' " + oNetwork + "'");
                    MessageToast.show("Please click on pull  address for the Network ' " + oNetwork + "'");
                    this.getView().getModel("oAddressModel").setData({});
                    this.getView().byId("idButtonUpdate").setEnabled(false);
                    sap.ui.core.BusyIndicator.hide();
                    return;
                }

               

            }
        });
    });
