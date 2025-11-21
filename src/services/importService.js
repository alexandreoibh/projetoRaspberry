const utilsService = require('./utilsServices');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const movieModel = require('../app/models/movieModel');

class ImportarCsv {

    async truncateTables() {
        try {
            await movieModel.truncateMovies();
            await movieModel.truncateMoviesProducers();
            await movieModel.truncateProducersMultiWinners();
        } catch (error) {
            console.error('Erro ao truncar tabelas:', error);
        }
    }

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
                                message: `IMportado arquivo com  ${movies.length} linhas`,
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

    resolveProducers(producers) {
        try {
            if (!producers) return;

            let tratado = producers.replace(/\s+&\s+/g, ',')
                .replace(/\s+\/\s+/g, ',')
                .replace(/\band\b/gi, ',')
                .replace(/;/g, ',').trim();

            const uniqueProducers = tratado.split(',')
                .map(item => item.trim())
                .filter(item => item !== '')
                .filter((item, index, self) =>
                    self.findIndex(i => i.toLowerCase() === item.toLowerCase()) === index
                );
            return uniqueProducers;

        } catch (error) {
            console.error('Erro ao resolver produtores:', error);
        }
    }

    async cargaProducerByMovie() {
        try {
            let listProducers = await movieModel.getAllWinners();

            for (const item of listProducers) {
                // console.log('item', item);
                const uniqueProducers = this.resolveProducers(item.producers);
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
        console.log('--->Inicio Carga CSV - Processo de 4 Etapas');

        console.log('0 - Iniciando validação do arquivo Csv existe');
        const resultCsv = await this.validaArquivoCsvExiste(csvPath);
        if (!resultCsv.success) {
            console.log('0.1 - Falha na carga do arquivo CSV existe:', resultCsv.message);
            return false;
        }
        console.log('0.1 - Concluido validação arquivo CSV');

        console.log('1 - Iniciando Limpeza das tabelas');
        await this.truncateTables();
        console.log('1.1 - Concluido limpeza com sucesso');

        console.log('2 - Iniciando carga do arquivo CSV');
        console.log('--->Em andamento, aguarde...');
        const resultImport = await this.cargaCsv(csvPath);
        if (!resultImport.success) {
            console.log('2.1 - Falha na carga do arquivo CSV:', resultImport.message);
            return false;
        }
        console.log('2.1 - Concluido carga do arquivo CSV', resultImport);

        console.log('3 - Iniciando Tratamento de Produtores por Filme');
        console.log('--->Em andamento, aguarde...');
        await this.cargaProducerByMovie();
        console.log('3.1 - Concluido Tratamento de Produtores por Filme');

        console.log('4 - Iniciando carga do dashboard');
        console.log('--->Em andamento, aguarde...');
        await this.cargaDashboard();
        console.log('4.1 - Concluido carga do dashboard');

        console.log('5 - Serviço REST da Api Online e Disponível');    
        return true;
    }

}

module.exports = new ImportarCsv();