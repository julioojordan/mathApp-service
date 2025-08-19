
function dependencyInjector() {
  return (req, res, next) => {
    const { db } = req.app.locals;

    // const dataWilayahController = new DataWilayahController(
    //   new DataWilayahService(new DataWilayahRepository(), db)
    // );

    // const dataLingkunganController = new DataLingkunganController(
    //   new DataLingkunganService(new DataLingkunganRepository(), db)
    // );

    // const userController = new UserController(
    //   new UserService(new UserRepository(), db)
    // );

    // const transactionHistoryController = new TransactionHistoryController(
    //   new TransactionHistoryService(new TransactionHistoryRepository(), db)
    // );

    // const dataKeluargaController = new DataKeluargaController(
    //   new DataKeluargaService(new DataKeluargaRepository(), db)
    // );

    // const dataAnggotaController = new DataAnggotaController(
    //   new DataAnggotaService(new DataAnggotaRepository(), db)
    // );

    // // simpan semua controller ke app.locals
    // req.app.locals.controllers = {
    //   dataWilayahController,
    //   dataLingkunganController,
    //   userController,
    //   transactionHistoryController,
    //   dataKeluargaController,
    //   dataAnggotaController,
    // };

    next();
  };
}

module.exports = dependencyInjector;
