class Helpers {
    static checkImporCsv(value) {
        if (global.appLoading) {
            return res.status(503).json({
                message: "Serviço carregando dados. Serviço indisponível no momento, tente em instantes."
            });
        }
    }
}
module.exports = Helpers;