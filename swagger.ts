import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'My API',
    description: 'API Documentation',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = [
  './app.ts',
  './routes/index.ts',
];

// Swagger 문서 생성 후 서버 실행
swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  import('./app'); // Swagger 문서를 만든 후 서버 실행
});
