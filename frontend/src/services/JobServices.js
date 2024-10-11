export default {
    getAllToSelect: () => {
      return [
        {
          value: 'Teacher',
          label: 'Giáo viên'
        },
        {
          value: 'Student',
          label: 'Sinh viên'
        },
        {
          value: 'Employee',
          label: 'Nhân viên'
        }
      ];
    },
  
    getTextByValue: (value) => {
      let rs = 'Không xác định';
      switch (value) {
        case 'Teacher':
          rs = 'Giáo viên';
          break;
        case 'Student':
          rs = 'Sinh viên';
          break;
        case 'Employee':
          rs = 'Nhân viên';
          break;
      }
  
      return rs;
    }
  };
  