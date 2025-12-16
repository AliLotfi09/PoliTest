import twemoji from "twemoji";

export const parseEmoji = (text) => {
  return twemoji.parse(text, {
    folder: "svg",
    ext: ".svg"
  });
};
