module.exports = function (api) {
    api.cache(true);
  
    return {
      presets: [
        [
          "babel-preset-expo",
          {
            jsxImportSource: "nativewind",
          },
        ],
        "nativewind/babel",
      ],
      plugins: [
        [
          "module-resolver",
          {
            root: ["./"],
            extensions: [".js", ".jsx", ".ts", ".tsx"],
            alias: {
              "@": "./",
              "tailwind.config": "./tailwind.config.js",
              "@commons": "../commons",
            },
          },
        ],
        "react-native-paper/babel",
      ],
    };
  };
  