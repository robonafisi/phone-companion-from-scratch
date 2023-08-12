import AWS from 'aws-sdk';

AWS.config.update({
    region: "us-east-1",
    accessKeyId: "AKIAWOV47H3LG23PS4PG",
    secretAccessKey: "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"
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Patients';

const getPatients = async () => {
    const params = {
        TableName : TABLE_NAME
    };
    const patients = await dynamoClient.scan(params).promise();
    console.log(patients)
    return patients;
}


const addOrUpdatePatient = async (patient) => {

    const deats = {
        TableName: "Patients",
        Item: patient
    };
    
    return await dynamoClient.put(deats).promise();
    
}

const getPatientbyId = async (id) => {
    const params = {
        TableName : TABLE_NAME,
        Key: {
            id
        }
    }
    return await dynamoClient.get(params).promise();
}

const deletePatientbyId = async (id) => {
    const params = {
        TableName : TABLE_NAME,
        Key: {
            id
        }
    }
    return await dynamoClient.delete(params).promise();
}

export { getPatients, addOrUpdatePatient, getPatientbyId, deletePatientbyId };

