module.exports = {
  apps: [
    {
      name: 'auth-service',
      cwd: './auth',
      script: 'index.js',
      env: {
        NODE_ENV: 'development',
        PORT: 3002
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3002
      }
    },
    {
      name: 'market-service',
      cwd: './market',
      script: 'index.js',
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    },
    {
      name: 'community-service',
      cwd: './community',
      script: 'index.js',
      env: {
        NODE_ENV: 'development',
        PORT: 3003
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3003
      }
    }
  ]
};