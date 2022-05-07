module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(235, 19%, 12%)", // darker TODO: remove
        darker: "hsl(235, 19%, 12%)",
        "background-light": "hsl(240, 15%, 17%)", // dark TODO: remove
        dark: "hsl(240, 15%, 17%)", // dark
        "text-secondary": "hsl(0, 0%, 100%)", // lighter TODO: remove
        lighter: "hsl(0, 0%, 100%)",
        text: "hsl(0, 0%, 64%)", // light
        "text-reversed": "hsl(235, 19%, 12%)", // inverse
        primary: "hsl(240, 67%, 64%)",
        "primary-light": "hsl(240, 25%, 64%)", // primary-light
        danger: "hsl(345, 86%, 56%)",
        "danger-lighter": "hsl(345, 86%, 80%)", // danger-light
      },
    },
  },
  plugins: [],
};
