/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    devIndicators: false,
    reactStrictMode: true,
    serverExternalPackages: ["sequelize"],
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
            },
            {
                test: /\.svg$/,
                use: ["@svgr/webpack"],
            }
        )
        return config
    }
};

export default nextConfig;
