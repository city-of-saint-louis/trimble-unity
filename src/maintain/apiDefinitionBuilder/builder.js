import * as fs from 'node:fs';

//Dictionary for converting primitives to typscript types
const TYPESCRIPT_TYPES =
{
    "number": "number",
    "integer": "number",
    "Int32": "number",
    "Int64": "number",
    "Decimal": "number",
    "DateTime": "Date",
    "Double": "number",
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
var errorOutput = {};
var errorsByGroup = {};
var warningsByGroup = {};

//Return the type of the input parameter json object
function checkType(service, group, name, paramName, param)
{
    if(param["$ref"] === '#/components/schemas/CoreResponseMessage')
    {
        return "any | null";
    }
    
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
        generateCustomEnum(service, group, name, paramName, param.description.substring(6), param);
        return "Enums." + param.description.substring(6);
    }
    else if(param.description != null && param.description.startsWith("Type: "))
    {
        generateCustomType(service, group, name, paramName, param.description.substring(6), param);
        return "Types." + param.description.substring(6);
    }
    //Core Respose status
    else if(paramName === "Status" && param.description.startsWith("Response status:") && param.enum == "[-1, 0, 1, 2, 3]")
    {
        console.log("ENUMS CORE RESPONSE STATUS")
        return "Enums.CoreResponseStatus"
    }
    else if(param.allOf != null)
    {
        if(param.allOf.length > 1)
        {
            throw "param.allof.length > 1 (probably an issue when generating responses)"
        }
        return checkType(service, group, name, paramName, param.allOf[0]);
        //generateCustomType(service, group, name, paramName, param.description.replaceAll(" ", ""), param);
        //return "Types." + param.description.replaceAll(" ", "");
    }
    else if(param.description === "Base message type")
    {
        param.description = "Type: BaseMessageType"
        return checkType(service, group, name, paramName, param);
    }
    else
    {
        return null;
    }
}

//Generate custom enum if the enum is definited in the param
function generateCustomEnum(service, group, name, paramName, paramType, param)
{
    if(enumsOutput[paramType] == null && param.enum != null)
    {
        //Generate the type declaration
        enumsOutput[paramType] = 'export enum ' + paramType + '\n{';

        console.log(param.enum);
        console.log(typeof(param.enum))
        if(Array.isArray(param.enum))
        {
            for(let i = 0; i < param.enum.length; i ++)
            {
                enumsOutput[paramType] += '\n\t' + paramType + i + ' = ' + param.enum[i] + ',';
            }
            enumsOutput[paramType] += '\n}'
        }
        else if(param.enum.includes('['))
        {
            throw "Need to implement object enums"
        }
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
    processErrorFiles(); //Must come before we process the OpenAPI files, because the response output depends on data from this function
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
            const responses = endpoint.post.responses;

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
            endpointsOutput[service][group] += '"' + name + '": function(' + functionInput + '){return Endpoints.getEndpointObject("' + name + '", "' + group + '", service.' + service + ', ' + parametersObj + ').run([' + functionInput.replaceAll(new RegExp(": [^:]*,", 'g'), ",").replaceAll("?", "").replaceAll(new RegExp(": .*$", 'g'), "") + '])';

            //Get the responses for this endpoint
            const htmlKeys = Object.keys(responses);
            for(let k = 0; k < htmlKeys.length; k++)
            {
                const htmlCode = htmlKeys[k];
                const htmlDescription = responses[htmlCode].description;

                const mimeKeys = Object.keys(responses[htmlCode].content);
                for(let l = 0; l < mimeKeys.length; l++)
                {
                    const mimeType = mimeKeys[l];
                    const response = responses[htmlCode].content[mimeType].schema;
                    const responseDescription = response.description;
                    var responseName = responseDescription;
                    if(responseName.startsWith("Response type: "))
                    {
                        responseName = responseName.slice(15);
                    }

                    var responseList = response["allOf"];
                    if(responseList == null)
                    {
                        throw "Properties in this response are not in allOf format. Need to implement looking at properties field"
                    }

                    if(responseList.length > 2)
                    {
                        throw "Multiple responses defined"
                    }

                    for(let m = 0; m < responseList.length; m++)
                    {
                        const currentResponse = responseList[m];
                        
                        if(currentResponse.description !== "Base response schema with common properties"
                        && currentResponse.properties != null
                        && currentResponse.properties.Value != null)
                        {
                            //console.log(responseName);
                            if(responseOutput[responseName] == null)
                            {
                                responseOutput[responseName] = 'export type ' + responseName + ' =' + '\n{';
                            }

                            //console.log(currentResponse);
                            const value = currentResponse.properties.Value;
                            const valueType = checkType(service, group, name, "response value", value);

                            responseOutput[responseName] += '\n\tValue: ' + valueType + ' | null';
                        }
                        else if(currentResponse.properties != null)
                        {
                            if(responseOutput[responseName] == null)
                            {
                                responseOutput[responseName] = 'export type ' + responseName + ' =' + '\n{';
                            }

                            //console.log(currentResponse.properties);
                            const subpropertyKeys = Object.keys(currentResponse.properties);
                            for(let n = 0; n < subpropertyKeys.length; n++)
                            {
                                const subpropertyName = subpropertyKeys[n];
                                const subproperty = currentResponse.properties[subpropertyName];
                                //console.log(subproperty);
                                const subpropertyType = checkType(service, group, name, "baseSubProperty", subproperty);

                                var byGroup = null;
                                if(subpropertyName === "ErrorMessages")
                                {
                                    byGroup = errorsByGroup;
                                }
                                else if(subpropertyName === "WarningMessages")
                                {
                                    byGroup = warningsByGroup;
                                }

                                if(subpropertyType === "[Types.BaseMessageType]")
                                {
                                    console.log(group);
                                    if(byGroup != null && byGroup[group] != null)
                                    {
                                        responseOutput[responseName] += '\n\t' + subpropertyName + ': ' + "[" + byGroup[group] + "]";
                                    }
                                    else
                                    {
                                        responseOutput[responseName] += '\n\t' + subpropertyName + ': ' + subpropertyType;
                                    }

                                    responseOutput[responseName] += ' | []'
                                }
                                else
                                {
                                    responseOutput[responseName] += '\n\t' + subpropertyName + ': ' + subpropertyType;
                                }
                            }
                        }
                    }

                    responseOutput[responseName] += '\n}';

                    /*if(endpointsOutput[service][group].search("as Promise<Responses.") != -1)
                    {
                        throw "Multiple responses match to the same endpoint"
                    }*/
                    endpointsOutput[service][group] += " as Promise<Responses." + responseName + ">;},";
                }
            }
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

//Scrape the error message files
function processErrorFiles()
{
    var errorDoc = fs.readFileSync(directory + 'errorMessageFiles/errorMessages.mhtml').toString().replaceAll("=\r\n", "").replaceAll("\r\n", "").replaceAll("\n", "");

    //Scrape the endpoint names
    const endNameRe = new RegExp(">[^<]+</h2>", 'g');
    const endNames = [...errorDoc.matchAll(endNameRe)];

    //Split up the document into an array based on each of the endpoints
    var errorArray = [];
    for(let i = 0; i < endNames.length; i++)
    {
        var eName = endNames[i][0];

        if(errorArray.length > 0)
        {
            errorDoc = errorArray.pop();
        }

        var split = errorDoc.split(eName);
        if(split.length > 2)
        {
            throw "Split length > 2"
        }

        errorArray.push(split[0]);
        errorArray.push(split[1]);
    }

    //Remove the first index which contains nothing
    errorArray = errorArray.slice(1);
    if(errorArray.length != endNames.length)
    {
        throw "Error parsing the errorResponseMessages errorArray.length != endNames.length"
    }

    //Go through the endpoints names and create all of the error response types
    for(let i = 0; i < errorArray.length; i++)
    {
        var eName = endNames[i][0].replaceAll("</h2>", "").replaceAll(">", "");
        var eData = errorArray[i];
        var errors = eData.split("message-item").slice(1);

        console.log("-----------------------------------")
        console.log(eName);

        for(let j = 0; j < errors.length; j++)
        {
            var data = errors[j];
            console.log(data);
            var mType = "Error";
            if(data.search("message-type danger") === -1)
            {
                mType = "Warning"
            }
            var code = data[data.search("message-code") + 14];

            const dNameRe = new RegExp('message-name">[^>]*</span', 'g');
            const dNames = [...data.matchAll(dNameRe)];
            if(dNames.length != 1)
            {
                continue;
            }
            var dName = dNames[0][0].replaceAll('message-name">', "").replaceAll("</span", "");

            var parameters = "";
            if(data.search("parameter-item") != -1)
            {
                const parameterData = data.split("parameter-item").slice(1);
                console.log(parameterData);
                for(let k = 0; k < parameterData.length; k++)
                {
                    const pNameRe = new RegExp('parameter-name">[^>]*</span', 'g');
                    const pNames = [...data.matchAll(pNameRe)];
                    var pName = pNames[0][0].replaceAll('parameter-name">', "").replaceAll("</span", "");

                    const pTypesRe = new RegExp('parameter-type">[^>]*</span', 'g');
                    const pTypes = [...data.matchAll(pTypesRe)];
                    var pType = pTypes[0][0].replaceAll('parameter-type">', "").replaceAll("</span", "");
                    if(TYPESCRIPT_TYPES[pType] != null)
                    {
                        pType = TYPESCRIPT_TYPES[pType];
                    }
                    if(pType === "List")
                    {
                        pType = "any";
                    }

                    parameters += " & {" + pName + ": " + pType  + "}"
                }
            }

            var typeName = eName + "_" + dName;
            if(errorOutput[typeName] == null)
            {
                errorOutput[typeName] = "export type " + typeName + " = Types.BaseMessageType" + parameters + ";";
            }

            if(mType === "Error" && errorsByGroup[eName] == null)
            {
                errorsByGroup[eName] = "Errors." + typeName;
            }
            else if(mType === "Error")
            {
                errorsByGroup[eName] += " | Errors." + typeName;
            }

            if(mType === "Warning" && errorsByGroup[eName] == null)
            {
                warningsByGroup[eName] = "Errors." + typeName;
            }
            else if(mType === "Warning")
            {
                warningsByGroup[eName] += " | Errors." + typeName;
            }
        }
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
    fs.appendFileSync(outputLocation, 'import * as Responses from "./responseDefinitions";\n');
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

//Write the enums defintitions
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

//Write the response defintitions
function writeResponses()
{
    const outputLocation = directory + '../apiDefinitions/responseDefinitions.ts';

    fs.writeFileSync(outputLocation, "//responseDefinitions.ts auto generated by builder.js\n");
    fs.appendFileSync(outputLocation, "import * as Enums from './enumDefinitions'\n");
    fs.appendFileSync(outputLocation, "import * as Types from './typeDefinitions'\n");
    fs.appendFileSync(outputLocation, "import * as Errors from './errorDefinitions'\n");

    const responseKeys = Object.keys(responseOutput);
    for(let i = 0; i < responseKeys.length; i++)
    {
        fs.appendFileSync(outputLocation, '\n' + responseOutput[responseKeys[i]]);
    }
}

//Write the error/warning definitions
function writeErrors()
{
    const outputLocation = directory + '../apiDefinitions/errorDefinitions.ts';

    fs.writeFileSync(outputLocation, "//errorDefinitions.ts auto generated by builder.js\n");
    fs.appendFileSync(outputLocation, "import * as Enums from './enumDefinitions'\n");
    fs.appendFileSync(outputLocation, "import * as Types from './typeDefinitions'\n");
    fs.appendFileSync(outputLocation, "import * as Responses from './responseDefinitions'\n");

    

    const responseKeys = Object.keys(errorOutput);
    for(let i = 0; i < responseKeys.length; i++)
    {
        fs.appendFileSync(outputLocation, '\n' + errorOutput[responseKeys[i]]);
    }
}

processAPIFiles();
writeEndpoints();
writeTypes();
writeEnums();
writeResponses();
writeErrors();