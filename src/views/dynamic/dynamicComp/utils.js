/* eslint-disable */
export const findModulePosition = function (list, id) {
  if (!id) {
    return console.error('id cant be null');
  }
  // eslint-disable-next-line no-param-reassign
  id = `${id}`;

  let result;
  let ismatch;
  // eslint-disable-next-line no-plusplus
  for (let i = 0, l = list.length; i < l; i++) {
    ismatch = `${list[i].id}` === id;

    if (ismatch) {
      return {
        list,
        index: i,
      };
    }
  }
  // eslint-disable-next-line no-plusplus
  for (let i = 0, l = list.length; i < l; i++) {
    if (list[i].children) {
      result = findModulePosition(list[i].children, id);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

export const findModulePath = function (list, id, paths = []) {
  if (!id) {
    return console.error('id cant be null');
  }
  // eslint-disable-next-line no-param-reassign
  id = `${id}`;

  let result;
  let ismatch;
  // eslint-disable-next-line no-plusplus
  for (let i = 0, l = list.length; i < l; i++) {
    ismatch = `${list[i].id}` === id;

    if (ismatch) {
      return paths.concat(list[i]);
    }
  }
  // eslint-disable-next-line no-plusplus
  for (let i = 0, l = list.length; i < l; i++) {
    if (list[i].children) {
      const nPaths = paths.concat(list[i]);
      result = findModulePath(list[i].children, id, nPaths);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

export const findBlockModules = function (list) {
  const stack = [];
  const res = [];

  for (let i = list.length - 1; i >= 0; i--) {
    stack.push(list[i]);
  }
  while (stack.length) {
    const item = stack.pop();
    if (item.tag === 'dynamic-block') {
      res.push(item);
    }
    if (item.children) {
      for (let i = item.children.length - 1; i >= 0; i--) {
        stack.push(item.children[i]);
      }
    }
  }
  return res;
};

function copy(aObject) {
  if (!aObject) {
    return aObject;
  }

  let v;
  const bObject = Array.isArray(aObject) ? [] : {};
  for (const k in aObject) {
    v = aObject[k];
    bObject[k] = (typeof v === 'object') ? copy(v) : v;
  }

  return bObject;
}

function removeBlockData(list) {
  for (let i = 0, l = list.length; i < l; i++) {
    if (list[i].tag === 'dynamic-block') {
      for (const k in list[i].props.data) {
        list[i].props.data[k] = null;
      }
      delete list[i].props.data.IS_COMP_ADDING;
    }
    if (list[i].children) {
      removeBlockData(list[i].children);
    }
  }
}
/**
 * from module raw data(with block data), extract module metadata
 */
export const getModuleMetadata = function (list) {
  const result = copy(list);
  removeBlockData(result);
  return result;
};
