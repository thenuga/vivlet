/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.jimthompson.com" },
      { protocol: "https", hostname: "jimthompson.com" },

      { protocol: "https", hostname: "tse1.mm.bing.net" },
      { protocol: "https", hostname: "tse2.mm.bing.net" },
      { protocol: "https", hostname: "tse3.mm.bing.net" },
      { protocol: "https", hostname: "tse4.mm.bing.net" },
      { protocol: "https", hostname: "www.bing.com" },

      // ✅ Walmart images (add these)
      { protocol: "https", hostname: "i5.walmartimages.com" },
      { protocol: "https", hostname: "i.walmartimages.com" }, // sometimes used
    ],
  },
};

module.exports = nextConfig;
