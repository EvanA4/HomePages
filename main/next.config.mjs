/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    webpack: (config) => {
        config.experiments = {...config.experiments, topLevelAwait: true};
        config.module.rules.push(
            {
                test: /\.(glsl|frag|vert|txt)$/,
                type: 'asset/source'
            },
            {
                test: /\.(bin)$/,
                type: 'asset/source'
                // use: [
                //     {
                //         loader: 'raw-loader'
                //     }
                // ]
            }
        )
        return config
    }
};

export default nextConfig;
