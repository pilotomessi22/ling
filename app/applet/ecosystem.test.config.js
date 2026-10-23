module.exports = {
  apps: [
    {
      name: 'ling-checkout-test',
      script: 'server.ts',
      interpreter: 'node',
      interpreter_args: '--import tsx',
      env: {
        NODE_ENV: 'test',
        PORT: 3002,
        ORDERS_FILE: 'orders_test.json',
        USE_ENV_TEST: 'true'
      }
    }
  ]
};
