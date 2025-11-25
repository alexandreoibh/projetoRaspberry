const utilsService = require('./utilsServices');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const movieModel = require('../app/models/movieModel');

class ImportarCsv {

    async validaArquivoCsvExiste(csvPath) {
        try {
            if (!fs.existsSync(csvPath)) {
                return Promise.resolve({
                    success: false,
                    message: 'Arquivo CSV não encontrado.'
                });
            }

            return Promise.resolve({
                success: true,
                message: 'Arquivo CSV encontrado.'
            });
        } catch (error) {
            return {
                success: false,
                message: `Erro ao validar arquivo: ${error.message}`
            };
        }
    }


    async cargaCsv(csvPath) {
        try {
            this.columnMapping = {};

            const validacaoCsv = await this.validaArquivoCsvExiste(csvPath);
            if (!validacaoCsv.success) {
                return validacaoCsv;
            }

            return new Promise((resolve, reject) => {
                const moviePromises = [];
                let cabecalho = [];
                let linhaAtual = 0;

                fs.createReadStream(csvPath).pipe(csv({ separator: ';', mapHeaders: ({ header }) => header.trim() }))
                    .on('headers', async (cabecalhoCheck) => {
                        cabecalho = cabecalhoCheck;
                        const validacaoCabecalho = await utilsService.validarCabecalho(cabecalhoCheck);
                        if (!validacaoCabecalho.success) {
                            console.log('Validacao Cabecalho', validacaoCabecalho);
                            if (!validacaoCabecalho.success) {
                                return reject(validacaoCabecalho);
                            }
                        }
                    })
                    .on('data', (row) => {
                        linhaAtual += 1;
                        moviePromises.push(
                            utilsService.formatarLinha(row, linhaAtual)
                                .catch((error) => {
                                    console.error('Falha ao formatar linha:', error);
                                    return null;
                                })
                        );
                    })
                    .on('end', async () => {
                        try {
                            const dados = (await Promise.all(moviePromises));
                            const movies = [];
                            for (const item of dados) {
                                if (item) movies.push(item);
                            }

                            await movieModel.createMovie(movies);
                            return resolve({
                                success: true,
                                message: `Importado arquivo com  ${movies.length} linhas`,
                            });
                        } catch (error) {
                            reject(error);
                        }
                    })
                    .on('error', (error) => {
                        reject(new Error(`Falha ler arquivo CSV: ${error.message}`));
                    });
            });

        } catch (erro) {

        }
    }

    async cargaProducerByMovie() {
        try {
            let listProducers = await movieModel.getAllWinners();

            for (const item of listProducers) {
                // console.log('item', item);
                const uniqueProducers = await utilsService.resolveProducers(item.producers);
                for (const uniqueProducer of uniqueProducers) {
                    // console.log('itemProducers', uniqueProducer);

                    const newItem = {
                        year: item.year,
                        title: item.title,
                        studios: item.studios,
                        producers: uniqueProducer,
                        winner: item.winner
                    };

                    await movieModel.createMovieProducer(newItem);
                }
            }

        } catch (error) {
            console.error('Erro ao inserir dados de filme por produtor:', error);
        }
    }

    async cargaDashboard() {
        try {

            let listProducers = await movieModel.getWinnersCondition();
            // console.log('Lista de produtores:', listProducers);
            listProducers = await listProducers.filter(producer => producer.followingWin !== null);
            // console.log('Lista de produtores para dashboard:', listProducers);
            await movieModel.createProducersDashboard(listProducers);

        } catch (error) {
            console.error('Erro ao inserir dados do dashboard:', error);
        }
    }

    async executeService() {
        const csvPath = path.join(process.cwd(), 'movielist.csv');
        
        const resultCsv = await this.validaArquivoCsvExiste(csvPath);
        if (!resultCsv.success) {
            console.log('Falha na carga do arquivo CSV existe:', resultCsv.message);
            return false;
        }
        
        const resultImport = await this.cargaCsv(csvPath);
        if (!resultImport.success) {
            console.log('Falha na carga do arquivo CSV:', resultImport.message);
            return false;
        }
        
        await this.cargaProducerByMovie();
        
        await this.cargaDashboard();
        
        return true;
    }

}

module.exports = new ImportarCsv();