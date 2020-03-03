const mongoose = require('mongoose');

const { ServiceProvider } = require('@adonisjs/fold')

class MongoDbProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    this.app.singleton('MongoDB', () => {
      const Config = this.app.use('Adonis/Src/Config');
      return mongoose.createConnection(
        // eslint-disable-next-line no-underscore-dangle
        Config._config.database.connection,
        { useNewUrlParser: true },
      );
    });
  }

  /**
   * Attach context getter when all providers have
   * been registered
   *
   * @method boot
   *
   * @return {void}
   */
  boot () {
    //
  }
}

module.exports = MongoDbProvider
