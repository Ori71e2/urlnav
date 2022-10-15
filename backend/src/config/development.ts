export default {
  // 端口
  port:  parseInt(process.env.PORT, 10) || 3000,
  // 是否开启swagger
  enableSwagger: true,
  // 数据库配置
  DATABASE_CONFIG: {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'urlnav_admin',
      password: 'urlnav_admin',
      database: 'urlnav',
      timezone: 'UTC',
      charset: 'utf8mb4',
      entities: ['./**/*.entity.js'],
      synchronize: true,
      logging: true,
      supportBigNumbers: true,
      bigNumberStrings: false
  },
  HOST: {
    url: '127.0.0.1',
    port: '3000'
  },
  AUTH: {
    saltRounds: 10
  },
  JWT: {
    secretOrKey: 'secret',
    expiresIn: '30 days'
  }
};
