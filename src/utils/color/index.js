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
