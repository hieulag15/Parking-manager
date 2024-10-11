export default {
    hanldeError: (error, onNoti) => {
      const type = 'error';
      if (error?.data) {
        const { statusCode = 0, message: description } = error?.data;
        onNoti({ message: error.status, description: error.statusText, type });
        switch (statusCode) {
          case 500:
            onNoti({ message: 'Lỗi Server', description, type });
            break;
          case 404:
            break;
          default:
            onNoti({ message: error.status, description: error.statusText, type });
            break;
        }
      } else {
        onNoti({ message: error.status, description: error.statusText, type });
      }
    }
  };
  