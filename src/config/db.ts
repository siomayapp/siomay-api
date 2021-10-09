export const devDb = {
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export const herokuDb = {
  url: 'postgres://zivbaworcycred:e8b6742a03fa0982731afd74bfb5e79fe7c4aa92941cce1ccb9f5d60938d0c82@ec2-54-208-96-16.compute-1.amazonaws.com:5432/da7eo9v3phnm1d',
  ssl: { rejectUnauthorized: false },
};
