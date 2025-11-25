const request = require("supertest");
const app = require("../app");
const db = require("../config/database");

describe("GET /goldenAwards", () => {

    beforeAll(() => {
        global.appLoading = false;

        const stmt = db.prepare(`INSERT INTO movies (year, title, studios, producers, winner)
                        VALUES (?, ?, ?, ?, ?)`);

        stmt.run(2000, "Filme A", "Studio", "Produtor 1", 1);
        stmt.run(2007, "Filme B", "Studio", "Produtor 1", 1);

        stmt.run(1990, "Filme C", "Studio", "Produtor 2", 1);
        stmt.run(1991, "Filme D", "Studio", "Produtor 2", 1);

        const stmt2 = db.prepare(`INSERT INTO producers_multi_winners (year, producers, previousWin, followingWin, interval)
                          VALUES(?, ?, ?, ?, ?)`);

        stmt2.run(1984, "Produtor 1", 2000, 2007, 7);
        stmt2.run(1990, "Produtor 2", 1990, 1991, 1);
    });


    it("validar retorno 200 com campos min e max", async () => {

        const res = await request(app)
            .get("/api/v1/movies/goldenAwards")
            .set("x-api-key", "GoldenRaspberry");

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("min");
        expect(res.body).toHaveProperty("max");

        expect(Array.isArray(res.body.min)).toBe(true);
        expect(Array.isArray(res.body.max)).toBe(true);

        const item = res.body.min[0];

        expect(item).toHaveProperty("producer");
        expect(item).toHaveProperty("interval");
        expect(item).toHaveProperty("previousWin");
        expect(item).toHaveProperty("followingWin");

        expect(res.body.min[0].producer).toBe("Produtor 2");
        expect(res.body.min[0].interval).toBe(1);

        expect(res.body.max[0].producer).toBe("Produtor 1");
        expect(res.body.max[0].interval).toBe(7);
    });

});
