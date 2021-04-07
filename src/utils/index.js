/* eslint-disable import/prefer-default-export */
let i = 0;

export const idGenerator = function () {
  i += 1;
  return `c_${new Date() - 0}${i}`;
};

// export default {
//   idGenerator,
// };
