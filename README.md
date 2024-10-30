# Express_practice

#Express start
npm run swagger-and-start

#TypeORM migration
npm run typeorm -- migration:generate -d ormconfig.ts migrations/UpdatedMigration
npm run typeorm -- migration:run -d ormconfig.ts