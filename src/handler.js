'use strict';

module.exports.pingController = async (event) => {
  try {
    console.log(`event: ${JSON.stringify(event)}`);
    return {
      statusCode: 200,
      body: JSON.stringify(event)
    };
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
    return {
      statusCode: 500,
      body: `Error processing request`
    }
  }
}
