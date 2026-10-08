import * as Types from './apiDefinitions/typeDefinitions'
import * as Enums from './apiDefinitions/enumDefinitions'
import { tu_maintain } from './index'
import * as Responses from './apiDefinitions/responseDefinitions'
import * as Errors from './apiDefinitions/errorDefinitions'

/**
 * Definition for inputs to endpoints
 */
interface parameter
{
    name: string,
    type: string;
    required: boolean;
    description: string;
    value?: Types.anyMaintainType;
}

class endpoint
{
    /**
     * Endpoint name
     */
    private name: string;
    /**
     * Endpoint service
     */
    private service: Enums.Service;
    /**
     * Endpoint group (the piece of the path in between the service and name of the endpoint)
     */
    private group: string;
    /**
     * Dictionary of endpoint's parameters
     * Parameters stored in the same order that they are input into the function used to run the endpoint
     */
    private parameters: {[id:string]: parameter};
    /**
     * Dictionary of endpoint's possible responses
     */
    //private responses: {[id:string]: response} = {};
    
    /**
     * Creates an endpoint object
     * @param {string} name 
     * @param {string} group 
     * @param {Enums.Service} service 
     * @param {{[id:string]: parameter}} parameters 
     */
    public constructor(name: string, group: string, service: Enums.Service, parameters: {[id:string]: parameter})//, outputs: [Output])
    {
        this.name = name;
        this.group = group;
        this.service = service;
        this.parameters = parameters;
    }

    /**
     * Gets the endpoint path
     * @returns {string} The path of the endpoint (service/group/name)
     */
    public getPath()
    {
        return this.service + '/' + this.group + '/' + this.name;
    }
    /**
     * Sends a request to Trimble Unity Maintain / Cityworks REST API.
     * After verifying that the required inputs for this endpoint are present
     * @param {[Types.anyMaintainType]} inputs
     * @return {Object} Returns Promise object that represents the JSON object returned from the API
     */
    public run(...inputs: [Types.anyMaintainType])
    {
        var post_data = {};

        //Run through the inputs
        //The inputs are always guaranteed to be in the same order as the parameters in this.parameters
        const paramKeys: string[] = Object.keys(this.parameters);
        for(let i = 0; i < paramKeys.length; i++)
        {
            const currentParam: parameter = this.parameters[paramKeys[i]];
            const currentValue = inputs[i];

            //Check for the required inputs
            if(currentParam.required === true
            && currentValue == undefined
            || currentValue == null)
            {
                throw "Required input is missing for API call: " + this.getPath();
            }

            //Build the data object that will get fed into the api call
            if(currentValue == undefined)
            {
                post_data[currentParam.name] = null;
            }
            else
            {
                post_data[currentParam.name] = currentValue;
            }
        }

        //run the api request through our Trimble unity object
        return tu_maintain.runRequest(this.getPath(), post_data);
    }
}

class endpoints
{
    /**
     * A private collection of all the endpoint objects, which are made on demand
     */
    private endpointObjects: {[id: string]: {[id:string]: {[id:string]: endpoint}}} = {};

    /**
     * Retrieve the endpoint object, or create it if it doesn't exist
     * @param {string} name 
     * @param {string} group 
     * @param {Enums.Service} serv 
     * @param {{[id:string]: parameter}} parameters 
     * @returns The retrieved endpoint object, or a newly created one
     */
    public getEndpointObject(name: string, group: string, serv: Enums.Service, parameters: {[id:string]: parameter})
    {
        //Create the service if needed
        if(this.endpointObjects[serv] == null)
        {
            this.endpointObjects[serv] = {};
        }

        //Create the group if needed
        if(this.endpointObjects[serv][group] == null)
        {
            this.endpointObjects[serv][group] = {};
        }

        //Create the endpoint if needed
        if(this.endpointObjects[serv][group][name] == null)
        {
            this.endpointObjects[serv][group][name] = new endpoint(name, group, serv, parameters);
        }

        //Retrieve the endpoint
        return this.endpointObjects[serv][group][name];
    }
}

const Endpoints = new endpoints();

export
{
    Endpoints,
}