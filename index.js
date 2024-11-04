const axios = require('axios');

const { MongoClient } = require('mongodb');


const uri = "mongodb://localhost:27017";
const dbName = "mockDB";
const collectionName = "veiculos";



async function req() {
    let client;

    try {
        client = new MongoClient(uri);

        await client.connect();
        console.log("Conectado ao MongoDB!");

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const marcasResponse = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas`);
        console.log(marcasResponse.data);

        const marcasDistintas = await db.collection('veiculos').distinct("Marca");

        for (const marca of marcasResponse.data) {
            try {
                if (!marcasDistintas.includes(marca.nome)) {

                    const modelosResponse = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marca.codigo}/modelos`);

                    for (const modelo of modelosResponse.data.modelos) {
                        try {
                            // console.log(modelo);


                            const anosResponse = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marca.codigo}/modelos/${modelo.codigo}/anos`);

                            for (const ano of anosResponse.data) {
                                try {
                                    // console.log(ano);

                                    const res = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marca.codigo}/modelos/${modelo.codigo}/anos/${ano.codigo}`);
                                    console.log('res.data', res.data);


                                    const existingDocument = await collection.findOne({
                                        CodigoFipe: res.data.CodigoFipe,
                                        AnoModelo: res.data.AnoModelo,
                                        MesReferencia: res.data.MesReferencia
                                    });


                                    if (!existingDocument) {
                                        const result = await collection.insertOne(res.data);
                                        console.log(`Documento inserido com o _id: ${result.insertedId}`);
                                    }

                                } catch (error) {
                                    console.error(`Erro ao processar ano para o modelo ${modelo.nome}:`, error);
                                }
                            }

                        } catch (error) {
                            console.error(`Erro ao processar modelo ${modelo.nome} da marca ${marca.nome}:`, error);
                        }
                    }
                }
            } catch (error) {
                console.error(`Erro ao processar a marca ${marca.nome}:`, error);
            }
        }
    } catch (error) {
        console.error("Erro na execução da função:", error);
    } finally {
        if (client) {
            await client.close();
            console.log("Conexão com o MongoDB encerrada.");
        }
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



// https://parallelum.com.br/fipe/api/v1/carros/marcas/
// [
//     {
//         "codigo": "1",
//         "nome": "Acura"
//     },
//     {
//         "codigo": "2",
//         "nome": "Agrale"
//     },
//     {
//         "codigo": "3",
//         "nome": "Alfa Romeo"
//     },
//     {
//         "codigo": "4",
//         "nome": "AM Gen"
//     },
//     {
//         "codigo": "5",
//         "nome": "Asia Motors"
//     },
//     {
//         "codigo": "189",
//         "nome": "ASTON MARTIN"
//     },
//     {
//         "codigo": "6",
//         "nome": "Audi"
//     },
//     {
//         "codigo": "207",
//         "nome": "Baby"
//     },
//     {
//         "codigo": "7",
//         "nome": "BMW"
//     },
//     {
//         "codigo": "8",
//         "nome": "BRM"
//     },
//     {
//         "codigo": "123",
//         "nome": "Bugre"
//     },
//     {
//         "codigo": "238",
//         "nome": "BYD"
//     },
//     {
//         "codigo": "236",
//         "nome": "CAB Motors"
//     },
//     {
//         "codigo": "10",
//         "nome": "Cadillac"
//     },
//     {
//         "codigo": "245",
//         "nome": "Caoa Chery"
//     },
//     {
//         "codigo": "161",
//         "nome": "Caoa Chery/Chery"
//     },
//     {
//         "codigo": "11",
//         "nome": "CBT Jipe"
//     },
//     {
//         "codigo": "136",
//         "nome": "CHANA"
//     },
//     {
//         "codigo": "182",
//         "nome": "CHANGAN"
//     },
//     {
//         "codigo": "12",
//         "nome": "Chrysler"
//     },
//     {
//         "codigo": "13",
//         "nome": "Citroën"
//     },
//     {
//         "codigo": "14",
//         "nome": "Cross Lander"
//     },
//     {
//         "codigo": "241",
//         "nome": "D2D Motors"
//     },
//     {
//         "codigo": "15",
//         "nome": "Daewoo"
//     },
//     {
//         "codigo": "16",
//         "nome": "Daihatsu"
//     },
//     {
//         "codigo": "246",
//         "nome": "DFSK"
//     },
//     {
//         "codigo": "17",
//         "nome": "Dodge"
//     },
//     {
//         "codigo": "147",
//         "nome": "EFFA"
//     },
//     {
//         "codigo": "18",
//         "nome": "Engesa"
//     },
//     {
//         "codigo": "19",
//         "nome": "Envemo"
//     },
//     {
//         "codigo": "20",
//         "nome": "Ferrari"
//     },
//     {
//         "codigo": "21",
//         "nome": "Fiat"
//     },
//     {
//         "codigo": "149",
//         "nome": "Fibravan"
//     },
//     {
//         "codigo": "22",
//         "nome": "Ford"
//     },
//     {
//         "codigo": "190",
//         "nome": "FOTON"
//     },
//     {
//         "codigo": "170",
//         "nome": "Fyber"
//     },
//     {
//         "codigo": "199",
//         "nome": "GEELY"
//     },
//     {
//         "codigo": "23",
//         "nome": "GM - Chevrolet"
//     },
//     {
//         "codigo": "153",
//         "nome": "GREAT WALL"
//     },
//     {
//         "codigo": "24",
//         "nome": "Gurgel"
//     },
//     {
//         "codigo": "240",
//         "nome": "GWM"
//     },
//     {
//         "codigo": "152",
//         "nome": "HAFEI"
//     },
//     {
//         "codigo": "214",
//         "nome": "HITECH ELECTRIC"
//     },
//     {
//         "codigo": "25",
//         "nome": "Honda"
//     },
//     {
//         "codigo": "26",
//         "nome": "Hyundai"
//     },
//     {
//         "codigo": "27",
//         "nome": "Isuzu"
//     },
//     {
//         "codigo": "208",
//         "nome": "IVECO"
//     },
//     {
//         "codigo": "177",
//         "nome": "JAC"
//     },
//     {
//         "codigo": "28",
//         "nome": "Jaguar"
//     },
//     {
//         "codigo": "29",
//         "nome": "Jeep"
//     },
//     {
//         "codigo": "154",
//         "nome": "JINBEI"
//     },
//     {
//         "codigo": "30",
//         "nome": "JPX"
//     },
//     {
//         "codigo": "31",
//         "nome": "Kia Motors"
//     },
//     {
//         "codigo": "32",
//         "nome": "Lada"
//     },
//     {
//         "codigo": "171",
//         "nome": "LAMBORGHINI"
//     },
//     {
//         "codigo": "33",
//         "nome": "Land Rover"
//     },
//     {
//         "codigo": "34",
//         "nome": "Lexus"
//     },
//     {
//         "codigo": "168",
//         "nome": "LIFAN"
//     },
//     {
//         "codigo": "127",
//         "nome": "LOBINI"
//     },
//     {
//         "codigo": "35",
//         "nome": "Lotus"
//     },
//     {
//         "codigo": "140",
//         "nome": "Mahindra"
//     },
//     {
//         "codigo": "36",
//         "nome": "Maserati"
//     },
//     {
//         "codigo": "37",
//         "nome": "Matra"
//     },
//     {
//         "codigo": "38",
//         "nome": "Mazda"
//     },
//     {
//         "codigo": "211",
//         "nome": "Mclaren"
//     },
//     {
//         "codigo": "39",
//         "nome": "Mercedes-Benz"
//     },
//     {
//         "codigo": "40",
//         "nome": "Mercury"
//     },
//     {
//         "codigo": "167",
//         "nome": "MG"
//     },
//     {
//         "codigo": "156",
//         "nome": "MINI"
//     },
//     {
//         "codigo": "41",
//         "nome": "Mitsubishi"
//     },
//     {
//         "codigo": "42",
//         "nome": "Miura"
//     },
//     {
//         "codigo": "43",
//         "nome": "Nissan"
//     },
//     {
//         "codigo": "44",
//         "nome": "Peugeot"
//     },
//     {
//         "codigo": "45",
//         "nome": "Plymouth"
//     },
//     {
//         "codigo": "46",
//         "nome": "Pontiac"
//     },
//     {
//         "codigo": "47",
//         "nome": "Porsche"
//     },
//     {
//         "codigo": "185",
//         "nome": "RAM"
//     },
//     {
//         "codigo": "186",
//         "nome": "RELY"
//     },
//     {
//         "codigo": "48",
//         "nome": "Renault"
//     },
//     {
//         "codigo": "195",
//         "nome": "Rolls-Royce"
//     },
//     {
//         "codigo": "49",
//         "nome": "Rover"
//     },
//     {
//         "codigo": "50",
//         "nome": "Saab"
//     },
//     {
//         "codigo": "51",
//         "nome": "Saturn"
//     },
//     {
//         "codigo": "52",
//         "nome": "Seat"
//     },
//     {
//         "codigo": "247",
//         "nome": "SERES"
//     },
//     {
//         "codigo": "183",
//         "nome": "SHINERAY"
//     },
//     {
//         "codigo": "157",
//         "nome": "smart"
//     },
//     {
//         "codigo": "125",
//         "nome": "SSANGYONG"
//     },
//     {
//         "codigo": "54",
//         "nome": "Subaru"
//     },
//     {
//         "codigo": "55",
//         "nome": "Suzuki"
//     },
//     {
//         "codigo": "165",
//         "nome": "TAC"
//     },
//     {
//         "codigo": "56",
//         "nome": "Toyota"
//     },
//     {
//         "codigo": "57",
//         "nome": "Troller"
//     },
//     {
//         "codigo": "58",
//         "nome": "Volvo"
//     },
//     {
//         "codigo": "59",
//         "nome": "VW - VolksWagen"
//     },
//     {
//         "codigo": "163",
//         "nome": "Wake"
//     },
//     {
//         "codigo": "120",
//         "nome": "Walk"
//     }
// ]