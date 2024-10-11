export const FormatNumber = (number, option) => {
    const decimal = option?.decimal || 2;
    let isEndZeroDecimal = true;
  
    if (option?.hasOwnProperty('isEndZeroDecimal')) {
      isEndZeroDecimal = option.isEndZeroDecimal;
    }
  
    //check is Long Number
    const div = Number(number) / 1e21;
    if (div >= 1) {
      return number;
    }
  
    const formattedNumber = Number(number).toFixed(decimal);
    const parts = formattedNumber.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
    if (!isEndZeroDecimal) {
      // Convert the string to a number to remove leading zeros as well
      const number = parts[1] ? parts[1].replace(/0+$/, '') : 0;
      parts[1] = String(number);
  
      if (!parts[1]) {
        return parts[0];
      }
    }
  
    return parts.join(',');
  };
  
  export const TextService = {
    formatFloorText: (id) => {
      const name = id === 'B' ? 'hầm' : id;
      return `Tầng ${name}`;
    }
  };
  
  export const FloorService = {
    getFloors: () => {
      const n = 31;
      let rs = [];
  
      for (let i = 0; i < n; i++) {
        let e = i;
  
        switch (e) {
          case 0:
            e = 'B';
            break;
          case 12:
            e = '12A';
            break;
          case 13:
            e = '12B';
            break;
        }
  
        rs.push(e);
      }
      return rs;
    },
  
    formatFloorText: (e) => {
      e = e === 'B' ? 'hầm' : e;
      let rs = `${e}`;
      return rs;
    }
  };
  
  export const GetAllParams = (searchParams, defaultParams) => {
    const params = defaultParams;
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  };