# Luis Client

luis-client is a client sdk to call Microsfot Luis API even you will be behind a proxy.

Luis Client is now able to :
  - Predict an utterance and return the intents and attached entities
  - Start a training and Get a Training status
  - create / get / rename / delete an intent
  - create / get / rename/ delete a simple entity
  - create / delete an utterance
  - Get all the utterances

# Installation
You need [superagent][sa1] to use the Luis Client
You need [superagent-proxy][sap1] to use the Luis Client behind a proxy

npm
```sh
npm install luis-client
npm install superagent
npm install superagent-proxy
```
yarn
```sh
yarn add luis-client
yarn add superagent
yarn add superagent-proxy
```

# Getting Started
You have to create a Luis Application following [Microsoft Documentation][md1].

Once your application created you will use the Luis Client as
http.js
```javascript
const superagent = require('superagent');
require('superagent-proxy')(superagent)
const agent = superagent.agent();

// set proxy on each request
agent.use((req) => {
    if (process.env.HTTP_PROXY) {
        req.proxy(process.env.HTTP_PROXY);
    }
    return req;
});


module.exports = agent ;
```

luis.js
```javascript
const LUISClient = require('luis-client').default;
const agent = require('./http');

const client = new LUISClient({
    appId: '<your application id>',
    appKey: '<your application key>',
    authoringKey: '<your authoring key here>',
    verbose: '<true / false>',
    region: '<your region here>',
    version: '<the luis version>',
    versionId: '<your luis app version>'
}, agent);
```
Luis Client parameters
  - appId           : You will find your application ID in your Luis Application Settings
  - appKey          : You will find your application key on the Publish section under Resources and Keys following your region
  - authoringKey    : You will find your authoring key in your Luis user settings
  - verbose         : Check if you need the verbose return from Luis api
  - region          : eastasia, southeastasia, australiaeast, northeurope, westeurope, eastus, eastus2, southcentralus, westcentralus, westus, westus2, brazilsouth. Following [Microsoft Luis Refenrence Regions][mlrr1]
  - version         : Current Luis version 2.0
  - versionId       : You will find your published version on the Publish section of your Luis application

# Luis existing API calls

Always return a Promise with custom content following the [LUIS Cognitive Service API][lcsa1]

```javascript
/********** PREDICT **************/
client.predict(text);

/********** TRAIN **************/
client.startTraining();
client.getTrainingStatus();

/********** INTENTS *************/
client.createIntent(intentName);
client.getIntent(intentId);
client.renameIntent(intentId, intentName);
client.deleteIntent(intentId);

/********** UTTERANCES/EXAMPLES/LABELS *************/
client.createUtterance(parameters);
client.deleteUtterance(utteranceId);
client.getUtterances(skip, take);

/********** ENTITIES *************/
client.createEntity(entityName);
client.getEntity(entityId);
client.renameEntity(entityId, entityName);
client.deleteEntity(entityId);
```

# Sample
If you need more examples, please visits the [luis-connect repository][lcr1]


   [md1]: <https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-get-started-create-app>
   [sa1]: <https://www.npmjs.com/package/superagent>
   [sap1]: <https://www.npmjs.com/package/superagent-proxyt>
   [mlrr1]: <https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-reference-regions>
   [lcsa1]: <https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c2f>
   [lcr1]: <https://github.com/mfreville-ssg/luis-connect>