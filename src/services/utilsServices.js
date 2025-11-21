
class utilsService {

    constructor() {
        this.colunasListadas = {};
    }

    async linhaPadrao(row, padrao) {
        // console.log('actualColumn ........', this.colunasListadas[padrao]);
        // console.log('Mapeando coluna para padrão:', padrao);
        const actualColumn = this.colunasListadas[padrao];
        return actualColumn ? (row[actualColumn] || '').trim() : '';
    }

    async trataVencedor(vencedor) {
        if (!vencedor) return 0;
        // console.log('Tratando valor de vencedor:', vencedor);
        const valor = vencedor.toLowerCase().trim();
        return valor === 'yes' || valor === 'true' || valor === '1' || valor === 'sim' ? 1 : 0;
    }

    async formatarLinha(row, linhaAtual) {
        try {
            const movieLinha = {
                year: await this.linhaPadrao(row, 'year'),
                title: await this.linhaPadrao(row, 'title'),
                studios: await this.linhaPadrao(row, 'studios'),
                producers: await this.linhaPadrao(row, 'producers'),
                winner: await this.trataVencedor(await this.linhaPadrao(row, 'winner'))
            };

            let linhaErro = '';
            if (!movieLinha.year || !movieLinha.title || !movieLinha.studios || !movieLinha.producers) {
                if (!movieLinha.year) { linhaErro += ' [year]'; }
                if (!movieLinha.title) { linhaErro += ' [title]'; }
                if (!movieLinha.studios) { linhaErro += ' [studios]'; }
                if (!movieLinha.producers) { linhaErro += ' [producers]'; }
                console.error(`Falha importação na linha ${linhaAtual} / coluna (${linhaErro}) , ela não será carregada mas o processo continua :`, row);
                return null;
            }

            return movieLinha;
        } catch (error) {
            console.error('Erro ao importar linha:', row, error);
            return null;
        }
    }

    async validarCabecalho(headersCheck) {
        this.colunasListadas = {};
        headersCheck.forEach(header => {
            const headerColum = header.toLowerCase().trim();

            if (headerColum.includes('year')) {
                this.colunasListadas.year = header;
            } else if (headerColum.includes('title')) {
                this.colunasListadas.title = header;
            } else if (headerColum.includes('studio')) {
                this.colunasListadas.studios = header;
            } else if (headerColum.includes('producer')) {
                this.colunasListadas.producers = header;
            } else if (headerColum.includes('winner')) {
                this.colunasListadas.winner = header;
            }
        });

        const obrigatorias = ['year', 'title', 'studios', 'producers', 'winner'];

        const faltando = obrigatorias.filter(coluna => !this.colunasListadas[coluna]);

        if (faltando.length > 0) {
            return Promise.resolve({
                success: false,
                message: `CSV inválido. Colunas ausentes: ${faltando.join(', ')}`
            });
        }

        return Promise.resolve({
            success: true,
            message: `CSV válido. Todas as colunas obrigatórias estão presentes.`
        });
    }

    async resolveProducers(producers) {
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
}

module.exports = new utilsService();