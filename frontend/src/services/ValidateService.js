export default {
    phone: (phoneNumber) => {
      // Remove any spaces or special characters from the input
      const cleanedNumber = phoneNumber.replace(/[^\d]/g, '');
  
      // Define the regex pattern for a Vietnamese phone number
      const vietnamesePhoneNumberPattern = /^0[2-9][0-9]{8}\b/;
  
      // Test if the cleaned number matches the pattern
      return vietnamesePhoneNumberPattern.test(cleanedNumber);
    },
  
    licensePlate: (licensePlate) => {
      // Định dạng biển số xe: 2 chữ cái - 1 số - 4 số
      const regex = /^\d{2}[A-Z]-\d{4,5}$/;
  
      return regex.test(licensePlate);
    },
  
    password: (password) => {
      const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
      return regex.test(password);
    }
  };
  