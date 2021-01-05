const List = require("./list");

module.exports = {
  title: "Today I Learned",
  description: "Study, summary and write down",
  base: "/TIL/",
  themeConfig: {
    nav: [{ text: "GitHub", link: "https://github.com/bomi94436" }],
    sidebar: [
      {
        title: "Typescript",
        children: List.Typescript,
      },
      {
        title: "Book",
        children: List.Book,
      },
    ],
  },
};
