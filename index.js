const axios = require('axios');

const { MongoClient } = require('mongodb');

// URL de conexão com o MongoDB (substitua pela sua URL de conexão)
const uri = "mongodb://localhost:27017";

// Nome do banco de dados e da coleção
const dbName = "mockDB";
const collectionName = "veiculos";

//comandos mongo



async function req() {
    try {
        const client = new MongoClient(uri);

        await client.connect();
        console.log("Conectado ao MongoDB!");

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const marcasResponse = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas`);
        console.log(marcasResponse.data);
        // const modelosResponse = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/7/modelos`);
        // console.log(modelosResponse.data);
        // const anosResponse = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/7/modelos/6146/anos/2014-1`);
        // console.log(anosResponse.data);
        for (const marca of marcasResponse.data) {
            const modelosResponse = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marca.codigo}/modelos`);

            for (const modelo of modelosResponse.data.modelos) {
                // console.log(modelo);

                const anosResponse = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marca.codigo}/modelos/${modelo.codigo}/anos`);
                // console.log(anosResponse.data);

                for (const ano of anosResponse.data) {
                    console.log(ano);
                    const res = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marca.codigo}/modelos/${modelo.codigo}/anos/${ano.codigo}`);
                    console.log('res', res);
                    console.log('res.data', res.data);

                    const result = await collection.insertOne(res.data);
                    console.log(`Documento inserido com o _id: ${result.insertedId}`);
                }
            }
        }
    } catch (error) {
        console.error("Erro ao consultar a placa:", error);
    }
    finally {
         await client.close();
    }

}

async function req2(data) {
    try {
        data.forEach(element => {
            console.log(element.codigo);
        })
        // axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas`)
        //     .then(function (response) {
        //         console.log(response);
        //         return response;
        //     })
    } catch (error) {
        console.error("Erro ao consultar a placa:", error);
    }
}

const data = req();
// req2(data);








// async function req() {
//     try {
//          axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas`)
//             .then(function (response) {
//                 // console.log(response.data);
//                 response.data.forEach(element => {
//                     axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${element.codigo}/modelos`)
//                         .then(function (response) {
//                             // console.log(response.data);
//                             response.data.forEach(element => {
//                                 console.log(element);
//                                 // axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${element.codigo}/modelos/${element.codigo}/anos/5027`)
//                                 //     .then(function (response) {
//                                 //         // console.log(response);
//                                 //         // response.data.forEach(element => {
//                                 //         //     axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${element.codigo}/modelos/${element.codigo}/anos/${element.codigo}`)
//                                 //         //         .then(function (response) {
//                                 //         //             console.log(response.data);
//                                 //         //         })
//                                 //         // })
//                                 //     })
//
//                             })
//                         })
//
//                 })
//             })
//     } catch (error) {
//         console.error("Erro ao consultar a placa:", error);
//     }
// }


// async function consultarVeiculo(placa) {
//     try {
//         // Fazendo a requisição para a API BrasilAPI (exemplo)
//         const response = await axios.get(`https://brasilapi.com.br/api/placa/v1/${placa}`);
//         console.log(response.data);
//     } catch (error) {
//         console.error("Erro ao consultar a placa:");
//     }
// }

// const placa = 'SWE1G23';
// consultarVeiculo(placa);



