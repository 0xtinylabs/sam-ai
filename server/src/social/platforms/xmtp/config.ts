const config: {
  env: 'local' | 'dev' | 'production';
  privateKey: string;
} = {
  env: 'dev',
  privateKey: process.env.XMPT_PRIVATE_KEY as string,
};

export default config;
