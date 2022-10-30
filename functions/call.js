exports.handler = function(context, event, callback) {
  const client = context.getTwilioClient();
  const taskrouterService = client.taskrouter.v1.workspaces(context.TWILIO_WORKSPACE_SID);
  const outboundNumber = context.dialledNumber

  const attrs = {
          identity: outboundNumber,
          from: context.fromNumber,
          to: outboundNumber,
          direction: "outbound",
          autoAnswer: "true"
        };

  const data = {
          workflowSid: wfSID,
          taskChannel: "custom1",
          timeout: 3600,
          attributes: JSON.stringify(attrs)
        };

  taskrouterService.tasks
          .create(data)
          .then(task => {
            console.log(`${task.sid} created: ${JSON.stringify(data.attributes)}`);
            callback(null, null);
          })
          .catch(err => {
            console.error(`Task creation failed ${err}`);
            callback(err);
          });
};