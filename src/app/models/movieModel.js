const db = require('../../config/database');

class movieModel {

    async truncateMovies() {
        try {
            const sqlDelete = `DELETE FROM movies;
                            DELETE FROM sqlite_sequence WHERE name = 'movies';
                            VACUUM;`;
            db.exec(sqlDelete);
        } catch (error) {
            console.error('Erro ao truncar tabela movies:', error);
            throw error;
        }
    }

    async truncateProducersMultiWinners() {
        try {

            const sqlDelete = `DELETE FROM producers_multi_winners;
                         DELETE FROM sqlite_sequence WHERE name = 'producers_multi_winners';
                         VACUUM;`;
            db.exec(sqlDelete);

        } catch (error) {
            console.error('Erro ao truncar tabela producers_multi_winners:', error);
            throw error;
        }
    }

    async truncateMoviesProducers() {
        try {
            const sqlDelete = `DELETE FROM movies_producers;
                            DELETE FROM sqlite_sequence WHERE name = 'movies_producers';
                            VACUUM;`;
            db.exec(sqlDelete);
        } catch (error) {
            console.error('Erro ao truncar tabela movies_producers:', error);
            throw error;
        }
    }

    async createMovie(movielist) {
        try {
            const sqlInsert = `INSERT INTO movies (year, title, studios, producers, winner)
          VALUES (?, ?, ?, ?, ?)`;
            const stmt = db.prepare(sqlInsert);
            movielist.forEach(movie => {
                stmt.run([
                    movie.year,
                    movie.title,
                    movie.studios,
                    movie.producers,
                    movie.winner
                ]);
            });
        } catch (error) {
            console.error('Erro ao inserir filmes no banco de dados:', error);
            throw error;
        }
    }

    async getCountMovies() {
        try {
            const sqlSelect = `SELECT count(*) as TotMovies 
                               FROM movies
                               `;
            const stmt = db.prepare(sqlSelect);
            const rows = stmt.all();
            return rows;

        } catch (error) {
            console.error('Erro ao calcular total filmes:', error);
            throw error;
        }
    }

    async getAllWinners() {
        try {
            const sqlSelect = `SELECT year, title, studios, producers, winner, created_date 
                               FROM movies
                               where winner = 1
                               ORDER BY year ASC`;
            const stmt = db.prepare(sqlSelect);
            const rows = stmt.all();
            return rows;

        } catch (error) {
            console.error('Erro ao buscar filmes:', error);
            throw error;
        }
    }

    async getAllMovies(limit, offset, orderBy) {
        try {
            const sqlSelect = `SELECT year, title, studios, producers, winner, created_date 
                               FROM movies
                               order by ${orderBy} ASC
                               LIMIT ? OFFSET ?`;
            const stmt = db.prepare(sqlSelect);
            const rows = stmt.all(limit, offset);
            return rows;

        } catch (error) {
            console.error('Erro ao buscar filmes:', error);
            throw error;
        }
    }

    async createMovieProducer(newItem) {
        try {
            const sqlInsert = `INSERT INTO movies_producers (year, title, studios, producers, winner)
          VALUES (?, ?, ?, ?, ?)`;
            const stmt = db.prepare(sqlInsert);
            stmt.run([
                newItem.year,
                newItem.title,
                newItem.studios,
                newItem.producers,
                newItem.winner
            ]);

        } catch (error) {
            console.error('Erro ao inserir filmes no banco de dados:', error);
            throw error;
        }
    }

    async getWinnersCondition() {
        try {
            const sqlSelect = `SELECT
                                m.producers,
                                m.year,
                                (
                                    SELECT MAX(m2.year)
                                    FROM movies_producers m2
                                    WHERE m2.producers = m.producers
                                    AND m2.winner = 1
                                    AND m2.year < m.year
                                ) AS previousWin,
                                (
                                    SELECT MIN(m2.year)
                                    FROM movies_producers m2
                                    WHERE m2.producers = m.producers
                                    AND m2.winner = 1
                                    AND m2.year > m.year
                                ) AS followingWin,
                                (
                                    SELECT MIN(m2.year) - m.year
                                    FROM movies_producers m2
                                    WHERE m2.producers = m.producers
                                    AND m2.winner = 1
                                    AND m2.year > m.year
                                ) AS interval
                            FROM movies_producers m
                            WHERE m.winner = 1
                            AND m.producers IN (
                                SELECT producers
                                FROM movies_producers
                                WHERE winner = 1
                                GROUP BY producers
                                HAVING COUNT(*) > 1
                            )
                            ORDER BY m.producers ASC, m.year ASC `;
            const stmt = db.prepare(sqlSelect);
            const rows = stmt.all();
            return rows;

        } catch (error) {
            console.error('Erro ao buscar os vencedores:', error);
            throw error;
        }
    }

    async createProducersDashboard(listProducers) {
        try {
            const sqlInsert = `INSERT INTO producers_multi_winners (year,  producers,  previousWin, followingWin, interval)
             VALUES (?, ?, ?, ?, ?)`;
            const stmt = db.prepare(sqlInsert);
            listProducers.forEach(producer => {
                stmt.run([
                    producer.year,
                    producer.producers,
                    producer.previousWin ? producer.previousWin : producer.year,
                    producer.followingWin,
                    producer.interval
                ]);
            });
        } catch (error) {
            console.error('Erro ao inserir dados do dashboard produtores:', error);
            throw error;
        }
    }

    async getWinnersDasboard(condition) {
        try {
            const sqlSelect = ` SELECT prod.producers, prod.interval, prod.previousWin, prod.followingWin
                                FROM producers_multi_winners prod
                                WHERE interval = (SELECT ${condition}(interval) FROM producers_multi_winners)`;

            const stmt = db.prepare(sqlSelect);
            const rows = stmt.all();
            return rows;

        } catch (error) {
            console.error(`Erro ao buscar produtores do dashboard condição ${condition} :`, error);
            throw error;
        }
    }

}
module.exports = new movieModel;