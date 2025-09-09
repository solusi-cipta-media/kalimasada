// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require("./next-i18next.config");
const { version } = require("./package.json");

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,

  // TODO: below line is added to resolve twice event dispatch in the calendar reducer
  reactStrictMode: false,
  i18n,
  publicRuntimeConfig: {
    version: version
  }
};

module.exports = nextConfig;
