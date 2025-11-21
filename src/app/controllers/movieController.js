const movieModel = require('../models/movieModel');
const csvServiceIMport = require('../../services/importService');

class MovieController {

    async getMovies(req, res) {
        if (global.appLoading) {
            return res.status(503).json({ message: "API inicializando, tente novamente." });
        }

        try {
            const orderByColumns = ['year', 'title', 'studios', 'producers', 'winner', 'created_date'];
            const orderBy = req.query.orderBy ? req.query.orderBy : 'year';
            if (!orderByColumns.includes(orderBy)) {
                orderBy = 'year';
            }
            let page = req.query.page ? parseInt(req.query.page) : 1;
            page = page > 0 ? page : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const offset = page ? (page - 1) * limit : 0;

            const movies = await movieModel.getAllMovies(limit, offset, orderBy);
            const total = await movieModel.getCountMovies();

            const totalPages = Math.ceil((total[0].TotMovies / limit));

            const response = {
                total: total[0].TotMovies,
                limit: limit,
                offset: offset,
                page: page,
                totalPages: totalPages,
                data: movies
            }

            res.json(response);
        } catch (error) {
            console.error('Erro ao buscar filmes:', error);
            res.status(500).json({ error: 'Erro em buscar todos os filmes' });
        }
    }

    async getAwardsInterval(req, res) {
        if (global.appLoading) {
            return res.status(503).json({ message: "API inicializando, tente novamente." });
        }

        try {
            const winnersMin = await movieModel.getWinnersDasboard('MIN');
            const winnersMax = await movieModel.getWinnersDasboard('MAX');

            const response = {
                min: [
                    ...winnersMin
                ],
                max: [
                    ...winnersMax
                ]
            }

            res.json(response);
        } catch (error) {
            console.error('Erro em buscar dashboard produtores vencedores:', error);
            res.status(500).json({ error: 'Erro em buscar dashboard produtores vencedores' });
        }
    }



}

module.exports = new MovieController();