'use strict';
const axios = require("axios");

module.exports.hello = async (event) => {
  try {
    console.log(`Event payload: ${JSON.stringify(event)}`);

    const firstS3EventRecord = event.Records?.[0];
  
    const {
      s3: {
        bucket: { name: bucketName },
        object: { key: filePath },
      },
    } = firstS3EventRecord;
  
    console.log(`Bucket name: ${bucketName} and file path ${filePath}`);
  
    const url = 'https://slack.com/api/chat.postMessage';
    const slackChannel = process.env.SLACK_CHANNEL;
    const imageDescription = filePath.replace(".png", "");
    const botName = process.env.BOT_NAME;
  
    const payload = {
      channel: `#${slackChannel}`,
      text: `Hello All, this is ${botName}!`,
      username: botName,
      icon_emoji: ":robot_face",
      blocks: [
          {
              type: "section",
              text: {
                  type: "mrkdwn",
                  text: "New image uploaded!"
              },
              fields: [
                  {
                      type: "mrkdwn",
                      text: `*Sender*\n${botName}`
                  },
                  {
                      type: "mrkdwn",
                      text: `*Description*\n${imageDescription}`
                  }
              ]
          },
          {
              type: "image",
              // image_url: `https:${bucketName}.s3.amazonaws.com/${filePath}`,
              image_url: filePath,
              alt_text: "bot image"
          }
      ]
  };

    console.log(`Payload: ${JSON.stringify(payload)}`);

    const slackToken = process.env.SLACK_TOKEN;
  
    const res = await axios.post(url, payload, { headers: { authorization: `Bearer ${slackToken}` } });
  
    console.log('Done', res.data)
  
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Go Serverless v1.0! Your function executed successfully!',
          input: event,
        },
        null,
        2
      ),
    };
  
    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
    
  } catch (error) {
    console.error(`Error message: ${error?.message}`)

    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          message: 'Error processing S3 image upload event',
          input: event,
        },
        null,
        2
      ),
    };
    
  }
};
