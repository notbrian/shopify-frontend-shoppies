require("dotenv").config();

module.exports = {
  siteMetadata: {
    title: "shopify-frontend-shoppies",
  },
  plugins: [
    "gatsby-plugin-styled-components",
    {
      resolve: "gatsby-plugin-web-font-loader",
      options: {
        typekit: {
          id: process.env.TYPEKIT_ID,
        },
      },
    },
  ],
};
