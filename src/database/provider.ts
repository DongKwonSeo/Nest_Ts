import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'b1b2b3',
        database: 'test',
        entities: [User],
        synchronize: false,
      });

      return dataSource.initialize();
    },
  },
];
