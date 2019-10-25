import { FlexPlugin} from 'flex-plugin';
import React from 'react';
const PLUGIN_NAME = 'SamplePlugin';
const request = require("request");
const loadjs = require("loadjs")



export default class SamplePlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }



  init(flex, manager) {

    loadjs('https://twilioaus.crm6.dynamics.com/webresources/Widget/msdyn_ciLibrary.js', 'CIF')
    loadjs.ready('CIF', function() {
      window.Microsoft.CIFramework.addHandler("onclicktoact", function() {
        request.post("https://brass-chicken-6161.twil.io/call2");
      });


    })

    function pannel(mode) {
      window.Microsoft.CIFramework.setMode(mode);
      console.log('setting pannel state to ' + mode);
    }


    function screenpop(contactno) {
        pannel(1);
        window.Microsoft.CIFramework.searchAndOpenRecords("account", "?$select=name,telephone1&$filter=telephone1 eq '" + `${contactno}` + "'"  + "&$search=" + `${contactno}`, false).then(
            function success(result) {
                var res = JSON.parse(result);
                console.log(`executed search`);
              },
            function (error) {
                console.log(error.message);
            }
        );
    }

    manager.workerClient.on("reservationCreated", function(reservation) {
      if(reservation.task.attributes.direction != 'outbound') {
      var contactno = `${reservation.task.attributes.from}`; // The contact number to be searched
      screenpop(contactno)
    } else {
    pannel(1);
    }
    console.log('reservation function executed')
    });

    flex.AgentDesktopView
          .defaultProps
          .showPanel2 = false;

    flex.RootContainer.Content.remove("project-switcher")

    flex.MainContainer
        .defaultProps
        .keepSideNavOpen = true;

    flex.Actions.addListener("afterCompleteTask", (payload) => {
      console.log("Task Completed");
      pannel(0);

     });

    flex.Actions.addListener("afterNavigateToView", (payload) => {
      console.log("View selected");
      pannel(1);

     });

  }

}
//https://felx.twilio.com/brass-chicken-6161?path=/agent-desktop
