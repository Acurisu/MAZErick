const { PHASE_PRODUCTION_BUILD } = require("next/constants");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
};

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_PRODUCTION_BUILD) {
    return {
      ...nextConfig,
      assetPrefix: "/MAZErick",
      basePath: "/MAZErick",
    };
  }

  return nextConfig;
};
