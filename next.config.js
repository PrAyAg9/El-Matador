/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // Handle Firebase compatibility issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        perf_hooks: false,
        worker_threads: false,
        http2: false,
        url: false,
        path: false,
        stream: false,
        crypto: require.resolve('crypto-browserify'),
        zlib: require.resolve('browserify-zlib'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        buffer: require.resolve('buffer/'),
        util: require.resolve('util/'),
        assert: require.resolve('assert/')
      };
    }

    // Explicitly exclude undici from bundling
    config.resolve.alias = {
      ...config.resolve.alias,
      'undici': false
    };

    return config;
  },
  transpilePackages: ['firebase']
};

module.exports = nextConfig; 