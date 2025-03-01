import { join } from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            // Options pour SVGR, par exemple
            icon: true, // Pour traiter les SVG comme des icônes
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
