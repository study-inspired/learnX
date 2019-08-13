export const removeTags = (html: string) => {
  return html
    .replace(/<(?:.|\n)*?>/gm, '')
    .replace(/\s\s+/g, ' ')
    .trim();
};
