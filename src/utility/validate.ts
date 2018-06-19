export const maxLength = (value: string, length: number) => {
  return value.length >= length ? true : false;
};

export const numberField = (value: number) => {
  return isNaN(value);
};

export const notZero = (value: string) => {
  return Number(value) > 0 ? true : false;
};

export const compareValue = (value1: number, value2: number) => {
  return value1 > value2 ? true : false;
};

export const addressValid = (value: string) => {
  if (value === '') {
    return true;
  }
  const re = /^0x[a-fA-F0-9]{40}$/;
  return re.test(value.toLowerCase());
};

export const jsonCheck = (value: string) => {
  if (/^[\],:{}\s]*$/.test(value.replace(/\\["\\\/bfnrtu]/g, '@').
      replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
      replace(/(?:^|:|,)(?:\s*\[)+/g, '')) && value.substr(value.length - 1) === '}') {
        return false;
  }
  return true;
};