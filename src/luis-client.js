"use strict";

const LUIS_BASE_URL = ".api.cognitive.microsoft.com";


/***
 * Initialize the luis client
 * @param parameters contains 8 params
 * @1- appId a string with the application Id
 * @2- appKey a string with the subscription key
 * @3- authoringKey a string with the authoring key
 * @4- verbose a boolean to use verbose option or not
 * @5- region a luis app region { westus, westeurope }
 * @6- version a luis version
 * @7- versionId a version id of the application
 * @param superagent http client from superagent library
 * @constructor
 */
export default class LUISClient {

    constructor(parameters, superagent) {
        this.appId = parameters.appId;
        this.appKey = parameters.appKey;
        this.authoringKey = parameters.authoringKey;
        this.verbose = parameters.verbose ? 'true' : 'false';
        this.region = parameters.region;
        this.version = parameters.version;
        this.versionId = parameters.versionId;

        this.http = superagent;
        this.http.use(req => {
            req.set('Ocp-Apim-Subscription-Key', this.authoringKey);
            return req;
        });

        this.LUIS_URL = `https://${this.region + LUIS_BASE_URL}`;
        this.LUIS_URL_PREDICT = `${this.LUIS_URL}/luis/v${this.version}/apps/${this.appId}?subscription-key=${this.appKey}&verbose=${this.verbose}&timezoneOffset=0&q=`;
        this.LUIS_URL_TRAIN = `${this.LUIS_URL}/luis/api/v${this.version}/apps/${this.appId}/versions/${this.versionId}/train`;
        this.LUIS_URL_INTENTS = `${this.LUIS_URL}/luis/api/v${this.version}/apps/${this.appId}/versions/${this.versionId}/intents`;
        this.LUIS_URL_UTTERANCES = `${this.LUIS_URL}/luis/api/v${this.version}/apps/${this.appId}/versions/${this.versionId}/example`;
        this.LUIS_URL_ENTITIES = `${this.LUIS_URL}/luis/api/v${this.version}/apps/${this.appId}/versions/${this.versionId}/entities`;
    }


    /**
     * Initiates the prediction procedure
     * @param text
     */
    predict(text) {
        if(text) {
            return this.http.get(this.LUIS_URL_PREDICT + text);
        }
        return Promise.resolve(null);
    }

    /**
     * Launch the training
     */
    startTraining() {
        return this.http.get(this.LUIS_URL_TRAIN);
    }

    /**
     * Get the current training status
     */
    getTrainingStatus() {
        return this.http.post(this.LUIS_URL_TRAIN);
    }

    /**
     * Create a new intent in Luis app
     * @param intentName
     */
    createIntent(intentName) {
        if(intentName) {
            return this.http.post(this.LUIS_URL_INTENTS)
                .send({ "name": intentName});
        }
        return Promise.resolve(null);
    }

    /**
     * Get an intent by intent Id
     * @param intentId
     */
    getIntent(intentId) {
        if(intentId) {
            return this.http.get(`${this.LUIS_URL_INTENTS}/${intentId}`);
        }
        return Promise.resolve(null);
    }

    /**
     * Get all intents
     */
    getIntents() {
        return this.http.get(this.LUIS_URL_INTENTS);
    }

    /**
     * Rename an intent
     * @param intentId
     * @param intentName
     */
    renameIntent(intentId, intentName) {
        if(intentId && intentName) {
            return this.http.put(`${this.LUIS_URL_INTENTS}/${intentId}`)
                .send({"name": intentName});
        }
    }

    /**
     * Delete an intent by intent Id
     * @param intentId
     */
    deleteIntent(intentId) {
        if(intentId) {
            return this.http.del(`${this.LUIS_URL_INTENTS}/${intentId}?true`);
        }
        return Promise.resolve(null);
    }

    /**
     * Add a new utterance to an intent
     * Optionnal attach utterance to one or several entities
     * @param parameters
     * @returns {Promise.<null>}
     */
    createUtterance(parameters) {
        if(parameters.text && parameters.intentName) {
            return this.http.post(this.LUIS_URL_UTTERANCES)
                .send(parameters);
        }
        return Promise.resolve(null);
    }

    /**
     * Create batch utterances
     * @param parameters
     * @returns {Promise.<null>}
     */
    createUtterances(parameters) {
        if(parameters) {
            return this.http.post(`${this.LUIS_URL_UTTERANCES}s`)
                .send(parameters);
        }
        return Promise.resolve(null);
    }

    /**
     * Get all utterances of the Luis application
     * @param skip optional
     * @param take optional
     */
    getUtterances(skip, take) {
        if(skip && take) {
            return this.http.get(`${this.LUIS_URL_UTTERANCES}s?skip=${skip}&take=${take}`);
        } else {
            return this.http.get(`${this.LUIS_URL_UTTERANCES}s`);
        }
    }

    /**
     * Dalete an utterance
     * @param utteranceId
     * @returns {*}
     */
    deleteUtterance(utteranceId) {
        if(utteranceId) {
            return this.http.delete(`${this.LUIS_URL_UTTERANCES}s/${utteranceId}`);
        }
        return Promise.resolve(null);
    }

    /**
     * Create a new entity in Luis application
     * @param entityName
     * @returns {Promise.<null>}
     */
    createEntity(entityName) {
        if(entityName) {
            return this.http.post(this.LUIS_URL_ENTITIES)
                .send({"name": entityName});
        }
        return Promise.resolve(null);
    }

    /**
     * Get an entity
     * @param entityId
     * @returns {Promise.<null>}
     */
    getEntity(entityId) {
        if(entityId) {
            return this.http.get(`${this.LUIS_URL_ENTITIES}/${entityId}`);
        }
        return Promise.resolve(null);
    }

    /**
     * Get all the entities
     */
    getEntities() {
        return this.http.get(this.LUIS_URL_ENTITIES);
    }

    /**
     * Rename an entity
     * @param entityId
     * @param entityName
     */
    renameEntity(entityId, entityName) {
        if(entityId && entityName) {
            return this.http.put(`${this.LUIS_URL_ENTITIES}/${entityId}`)
                .send({"name": entityName});
        }
    }

    /**
     * Dalete an entity
     * @param entityId
     * @returns {*}
     */
    deleteEntity(entityId) {
        if(entityId) {
            return this.http.delete(`${this.LUIS_URL_ENTITIES}/${entityId}`);
        }
        return Promise.resolve(null);
    }

}