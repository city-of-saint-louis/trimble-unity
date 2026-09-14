import * as fs from 'node:fs';

//Dictionary for converting primitives to typscript types
const TYPESCRIPT_TYPES =
{
    "number": "number",
    "integer": "number",
    "string": "string",
    "boolean": "boolean",
    "object": "object"//TODO, FIND A BETTER SOLUTION FOR THESE?
}

//Can be run from either the trimble-unity folder or the apiDefinitionBuilder folder
var directory;
try
{
    directory = './';
    fs.readFileSync(directory + 'builder.js');
}
catch(e)
{
    directory = './src/maintain/apiDefinitionBuilder/';
    fs.readFileSync(directory + 'builder.js');
}

//Keep track of the code we are generating for each endpoint, service, type, and response type
var endpointsOutput = {};
var servicesOutput = "export const enum Service\n{";
var typesOutput = {};
var enumsOutput = {};
var responseOutput = {};

//Return the type of the input parameter json object
function checkType(service, group, name, paramName, param)
{
    //Handle custom Enums and Types
    var paramType = checkCustomType(service, group, name, paramName, param);

    //Handle Primitive types, Arrays, and objects
    if(paramType == null)
    {
        //If we find an array type we need to loop through it to check for arrays within arrays,
        //find the final data type at the bottom and generate the correct typing
        if(param.type == "array")
        {
            var numLayers = 0;
            paramType = "";
            var subParam = param.items;
            while(subParam != null)
            {
                numLayers++;
                paramType += "[";

                if(subParam.type != "array")
                {
                    var checkType = checkCustomType(service, group, name, paramName, subParam);
                    if(checkType == null)
                    {
                        if(TYPESCRIPT_TYPES[subParam.type] != null)
                        {
                            paramType += TYPESCRIPT_TYPES[subParam.type];
                        }
                        else
                        {
                            throw "UNKNOWN PARAM TYPE. endpoint: " + service + "/" + group + "/" + name + " paramName: " + paramName + " paramType: " + subParam.type;
                        }
                    }
                    else
                    {
                        paramType += checkType;
                    }
                }

                subParam = subParam.items;
            }

            for(let l = 0; l < numLayers; l++)
            {
                paramType += "]";
            }
        }
        //Convert primitives to typscript types
        else if(TYPESCRIPT_TYPES[param.type] != null)
        {
            paramType = TYPESCRIPT_TYPES[param.type];
        }
        else
        {
            throw "UNKNOWN PARAM TYPE. endpoint: " + service + "/" + group + "/" + name + " paramName: " + paramName + " paramType: " + param.type;
        }
    }

    if(typesOutput["primitives"] == null)
    {
        typesOutput["primitives"] = ""
    }
    if(!typesOutput["primitives"].includes(" | " + paramType.replaceAll("Types.", "")))
    {
        typesOutput["primitives"] += " | " + paramType.replaceAll("Types.", "");
    }

    return paramType;
}

//Get the custom enum or type for the input parameter
//If it is not a custom enum or type return null
function checkCustomType(service, group, name, paramName, param)
{
    //Handle custom Enum types
    if(param.description != null && param.description.startsWith("Enum: "))
    {
        return "Enums." + param.description.substring(6);
    }
    else if(param.description != null && param.description.startsWith("Type: "))
    {
        generateCustomType(service, group, name, paramName, param.description.substring(6), param);
        return "Types." + param.description.substring(6);
    }
    else
    {
        return null;
    }
}

//Generate the code for the input custom type
function generateCustomType(service, group, name, paramName, paramType, param)
{
    if(paramType == "anyMaintainType")
    {
        throw "openAPI has type called 'anyMaintainType', we need to rename that type custom in our code"
    }
    if(paramType == "primitives")
    {
        throw "openAPI has type called 'primitives', we need to rename that type custom in our code"
    }

    if(typesOutput[paramType] == null)
    {
        //Generate the type declaration
        typesOutput[paramType] = 'export type ' + paramType + ' =' + '\n{';

        const keys = Object.keys(param.properties);
        for(let i = 0; i < keys.length; i ++)
        {
            const subparam = param.properties[keys[i]];
            const subparamName = keys[i];
            typesOutput[paramType] += '\n\t' + subparamName + ': ' + checkType(service, group, name, paramName, subparam).replaceAll("Types.", "");
        }
        typesOutput[paramType] += '\n}'

        //Add the type to the anyMaintainType intersection
        if(typesOutput["anyMaintainType"] == null)
        {
            typesOutput["anyMaintainType"] = "export type anyMaintainType = "
        }
        else
        {
            typesOutput["anyMaintainType"] += ' | '
        }
        typesOutput["anyMaintainType"] += paramType
    }
}

//process all the openAPI files, then scrape the enum files
function processAPIFiles()
{
    processOpenAPIFiles();
    processEnumFiles();
}

//Process the openAPI config files for the endpoint and type definitions
function processOpenAPIFiles()
{
    //Trimble doesn't seem to offer a download for the entire openAPI specs, instead offering a json file for each tag (group)
    //So we need to loop through all the openapi.json files
    const apiFiles = fs.readdirSync(directory + 'openApiDocs');

    for(let i = 0; i < apiFiles.length; i++)
    {
        if(apiFiles[i] == ".gitkeep")
        {
            continue;
        }

        const data = JSON.parse(fs.readFileSync(directory + 'openApiDocs/' + apiFiles[i]));

        //Get the base response
        const baseResponse = data.components.schemas.CoreResponseMessage;
        if(responseOutput["CoreResponseMessage"] == null)
        {
            responseOutput["CoreResponseMessage"] =
            `class response
{
    private htmlCode: number;
    private htmldescription: string;
    private mimeType: string;
    private responseType: string;
    private responseDescription: string;
    private properties;

    public constructor(htmlCode: number, htmldescription: string, mimeType: string, responseType: string, responseDescription: string, properties)
    {
        this.htmlCode = htmlCode;
        this.htmldescription = htmldescription;
        this.mimeType = mimeType;
        this.responseType = responseType;
        this.responseDescription = responseDescription;
        this.properties = properties;
    }
}`
        }
        console.log(responseOutput["CoreResponseMessage"]);

        //Loop through all the endpoints in this file
        const keys = Object.keys(data.paths);
        for(let j = 0; j < keys.length; j ++)
        {
            //Generic data about our endpoint
            const endpoint = data.paths[keys[j]];
            const path = keys[j];
            const service = path.split("/")[1];
            const group = path.split("/")[2];
            const name = path.split("/")[3];
            const summary = endpoint.post.summary;

            //Create our service and group if they don't exist already
            if(endpointsOutput[service] == null)
            {
                endpointsOutput[service] = {};

                //Generate the enum code for the service
                servicesOutput += '\n\t' + service + ' = "' + service + '",';
            }
            if(endpointsOutput[service][group] == null)
            {
                endpointsOutput[service][group] = "";
            }

            //Start writing the jsDoc comment and add the summary
            endpointsOutput[service][group] += '\n/**\n * ' + summary + '\n * ';

            
            //Both of these variables will be used when generating the function definition.
            //To avoid looping thuough the parameters multiple times, we create them here
            //a string of the function inputs with their types
            var functionInput = "";
            //A string of the parameters in obj form
            var parametersObj = "{"

            //Get parameters and add them to the jsDoc
            if(endpoint.post.requestBody != null)
            {
                const parameters = endpoint.post.requestBody.content["application/x-www-form-urlencoded"].schema.properties.data.properties;
                const paramKeys = Object.keys(parameters);

                for(let k = 0; k < paramKeys.length; k ++)
                {
                    const paramName = paramKeys[k];
                    const param = parameters[paramName];
                    var paramType = checkType(service, group, name, paramName, param);

                    //Add params and descriptions to jsDoc
                    endpointsOutput[service][group] += '\n * @param {' + paramType + '} ' + paramName
                    if(param.description != null)
                    {
                        endpointsOutput[service][group] += ' - ' + param.description;
                    }

                    //Update strings for use when building function definition
                    if(parametersObj != "{")
                    {
                        parametersObj += ", ";
                    }

                    var required = false;
                    if(endpoint.post.requestBody.content["application/x-www-form-urlencoded"].schema.properties.data.required != null
                    && endpoint.post.requestBody.content["application/x-www-form-urlencoded"].schema.properties.data.required.includes(paramName))
                    {
                        required = true;
                    }

                    if(param.description != null)
                    {
                        parametersObj += '"' + paramName + '": {name: "' + paramName + '", type: "' + paramType + '", required: ' + required + ', description: "' + param.description + '"}';
                    }
                    else
                    {
                        parametersObj += '"' + paramName + '": {name: "' + paramName + '", type: "' + paramType + '", required: ' + required + ', description: "' + '"}';
                    }

                    if(functionInput != "")
                    {
                        functionInput += ", ";
                    }
                    if(required)
                    {
                        functionInput += paramName + ": " + paramType;
                    }
                    else
                    {
                        functionInput += paramName + "?: " + paramType;
                    }
                }
            }

            //Done generating the jsDoc comment
            endpointsOutput[service][group] += "\n */\n"

            parametersObj += "}"

            //Generate the function definition for our endpoint
            endpointsOutput[service][group] += '"' + name + '": function(' + functionInput + '){return Endpoints.getEndpointObject("' + name + '", "' + group + '", service.' + service + ', ' + parametersObj + ').run([' + functionInput.replaceAll(new RegExp(": [^:]*,", 'g'), ",").replaceAll("?", "").replaceAll(new RegExp(": .*$", 'g'), "") + ']);},';
        }
    }
}

//Scrape the enum files
function processEnumFiles()
{
    var enumDoc = fs.readFileSync(directory + 'enumTypeFiles/EnumTypes.mhtml').toString().replaceAll("=\r\n", "").replaceAll("\r\n", "").replaceAll("\n", "");
    const enumNameRe = new RegExp(">[^<]+</h2>", 'g');
    const enumNames = [...enumDoc.matchAll(enumNameRe)];

    for(let i = 0; i < enumNames.length; i++)
    {
        var eName = enumNames[i][0].replaceAll("</h2>", "").replaceAll(">", "");

        if(enumsOutput[eName] == null)
        {
            enumsOutput[eName] = "export enum " + eName + "\n{";
        }

        //Get the first tbody, split it by rows, and remove the first result of the split as it is not a proper row
        //Then remove it from the doc
        const tbodyStart = enumDoc.search("<tbody");
        const tbodyEnd = enumDoc.search("</tbody>") + 8;
        const tbody = enumDoc.substring(tbodyStart, tbodyEnd).split("<tr").slice(1);
        enumDoc = enumDoc.slice(tbodyEnd);

        for(let j = 0; j < tbody.length; j++)
        {
            const row = tbody[j];
            const nameRe = new RegExp("<strong.*</strong>");
            const valueRe = new RegExp("<code.*</code>");

            const name = row.match(nameRe).toString().match(">.*</strong").toString().replaceAll("</strong","").slice(1);
            const value = row.match(valueRe).toString().match(">.*</code").toString().replaceAll("</code", "").slice(1);

            enumsOutput[eName] += "\n\t" + name + " = " + value + ",";
        }

        enumsOutput[eName] += "\n}"
    }
}

//Write the endpointDefinitions
function writeEndpoints()
{
    const outputLocation = directory + '../apiDefinitions/endpointDefinitions.ts';

    fs.writeFileSync(outputLocation, "//endpointDefinitions.ts auto generated by builder.js\n\n");
    fs.appendFileSync(outputLocation, 'import { Endpoints } from "../endpoints";\n');
    fs.appendFileSync(outputLocation, 'import * as Types from "./typeDefinitions";\n');
    fs.appendFileSync(outputLocation, 'import * as Enums from "./enumDefinitions";\n');
    fs.appendFileSync(outputLocation, 'import { Service as service} from "./enumDefinitions";\n\n');

    fs.appendFileSync(outputLocation, "export const API = {");
    const serviceKeys = Object.keys(endpointsOutput);
    for(let i = 0; i < serviceKeys.length; i++)
    {
        fs.appendFileSync(outputLocation, '\n\t"' + serviceKeys[i] + '": {');

        const groupKeys = Object.keys(endpointsOutput[serviceKeys[i]]);
        for(let j = 0; j < groupKeys.length; j++)
        {
            fs.appendFileSync(outputLocation, '\n\t\t"' + groupKeys[j] + '": {');
            fs.appendFileSync(outputLocation, '\t\t\t' + endpointsOutput[serviceKeys[i]][groupKeys[j]].replaceAll("\n", "\n\t\t\t"));
            fs.appendFileSync(outputLocation, "\n\t\t},");
        }

        fs.appendFileSync(outputLocation, "\n\t},");
    }
    fs.appendFileSync(outputLocation, "\n}");
}

//Write the types defintitions
function writeTypes()
{
    const outputLocation = directory + '../apiDefinitions/typeDefinitions.ts';

    fs.writeFileSync(outputLocation, "//typeDefinitions.ts auto generated by builder.js\n");
    fs.appendFileSync(outputLocation, "import * as Enums from './enumDefinitions'\n");
    fs.appendFileSync(outputLocation, typesOutput["anyMaintainType"] + typesOutput["primitives"] + ';');

    const typeKeys = Object.keys(typesOutput);
    for(let i = 0; i < typeKeys.length; i++)
    {
        if(typeKeys[i] != "anyMaintainType"
        && typeKeys[i] != "primitives")
        {
            fs.appendFileSync(outputLocation, '\n' + typesOutput[typeKeys[i]]);
        }
    }
}

//Write the types defintitions
function writeEnums()
{
    const outputLocation = directory + '../apiDefinitions/enumDefinitions.ts';

    fs.writeFileSync(outputLocation, "//enumDefinitions.ts auto generated by builder.js\n");

    fs.appendFileSync(outputLocation, '\n' + servicesOutput + '\n}');

    const enumKeys = Object.keys(enumsOutput);
    for(let i = 0; i < enumKeys.length; i++)
    {
        fs.appendFileSync(outputLocation, '\n' + enumsOutput[enumKeys[i]]);
    }
}

processAPIFiles();
writeEndpoints();
writeTypes();
writeEnums();