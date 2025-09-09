// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const port = process.env.PM2_PORT;

module.exports = {
  apps: [
    {
      name: 'nextjs-vuexy-kit',
      script: `npm start -- -p ${port}`,
      error_file: 'log/error.log',
      out_file: 'log/out.log',
      args: '',
      node_args: '--tls-min-v1.0',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M'
    }
  ],
  deploy: {}
};
