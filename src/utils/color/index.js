const colorPalette = [
  '#1677ff',
  '#52c41a',
  '#f5222d',
  '#722ed1',
  '#13c2c2',
  '#eb2f96',
  '#fa8c16',
  '#faad14',
  '#2f54eb',
  '#fa541c'
];

/**
 * 根据字符串（名字或邮箱）生成固定的颜色
 * @param {string} text
 */
export const getAvatarColor = (text) => {
  if (!text) return colorPalette[0];
  const char = text.charAt(0);
  const charCode = char.charCodeAt(0);
  const index = charCode % colorPalette.length;
  return colorPalette[index];
};

export const stringToColor = (str = '') => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = ((hash % 360) + 360) % 360;
  const s = 70;
  const l = 50;
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l / 100 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};
