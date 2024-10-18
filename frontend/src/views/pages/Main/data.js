import { UserApi } from '~/api';

function generateEmail(username) {
  const email = `${username}@gmail.com`;
  return email;
}

function generatePhone() {
  const uniqueNumbers = new Set();

  while (uniqueNumbers.size < 8) {
    const randomNumber = Math.floor(Math.random() * 100000000); // Số ngẫu nhiên từ 0 đến 99999999
    uniqueNumbers.add(randomNumber);
  }

  // Chuyển set thành mảng và lấy số đầu tiên
  const uniqueArray = Array.from(uniqueNumbers);
  const uniqueNumber = uniqueArray[0];

  return `03${uniqueNumber}`;
}

const teacher_departments = [
  'Khoa Lý luận Chính trị',
  'Khoa Khoa học ứng dụng',
  'Khoa Cơ khí Chế tạo máy',
  'Khoa Điện - Điện tử',
  'Khoa Cơ khí Động Lực',
  'Khoa Kinh tế',
  'Khoa Công nghệ thông tin',
  'Khoa In và Truyền thông',
  'Khoa Công nghệ May và Thời Trang',
  'Khoa Công nghệ Hóa học và Thực phẩm',
  'Khoa Xây dựng',
  'Khoa Ngoại ngữ',
  'Khoa Đào tạo Chất lượng cao',
  'Viện Sư phạm Kỹ thuật',
  'Trường Trung học Kỹ thuật Thực hành'
];

const emp_departments = [
  'Phòng Đào tạo',
  'Phòng Đào tạo không chính quy',
  'Phòng Tuyển sinh và Công tác Sinh viên',
  'Phòng Truyền thông',
  'Phòng Khoa học Công nghệ - Quan hệ Quốc tế',
  'Phòng Quan hệ Doanh nghiệp',
  'Phòng Thanh tra - Giáo dục',
  'Phòng Đảm bảo Chất lượng',
  'Phòng Tổ chức - Hành chính',
  'Phòng Kế hoạch - Tài chính',
  'Phòng Quản trị Cơ sở Vật chất',
  'Phòng Thiết bị - Vật tư',
  'Ban quản lý KTX',
  'Trạm Y tế'
];

const jobs = [
  { name: 'Teacher', departments: [...teacher_departments] },
  { name: 'Employee', departments: [...emp_departments] },
  { name: 'Student', departments: [...teacher_departments] }
];

function generateUsername(fullName) {
  const cleanName = fullName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const [ho, tenDem, ten] = cleanName.split(' ');

  const username = `${ten}${tenDem?.charAt(0)}${ho}`;

  return username;
}

const fullNames = (length = 100) => {
  // Các họ và tên người Việt Nam
  const ho = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng'];
  const tenDem = ['Thị', 'Văn', 'Xuân', 'Minh', 'Hoàng', 'Quốc', 'Thành', 'Hữu', 'Đức', 'Tường'];
  const ten = ['Hương', 'Anh', 'Nam', 'Linh', 'Duy', 'Thu', 'Tâm', 'Tuấn', 'Hải', 'Hạnh'];

  // Hàm tạo họ tên ngẫu nhiên
  function getRandomName() {
    const randomHo = ho[Math.floor(Math.random() * ho.length)];
    const randomTenDem = tenDem[Math.floor(Math.random() * tenDem.length)];
    const randomTen = ten[Math.floor(Math.random() * ten.length)];
    return `${randomHo} ${randomTenDem} ${randomTen}`;
  }

  // Tạo mảng 100 phần tử
  const mangHoTen = Array.from({ length }, () => getRandomName());

  return mangHoTen;
};

const names = [
  'Lê Anh Huy',
  'Nguyễn Thị Hương',
  'Phạm Minh Hoàng',
  'Trần Mai Phương',
  'Đỗ Văn Dương',
  'Nguyễn Thanh Tâm',
  'Trần Bảo An',
  'Vũ Hồng Đức',
  'Hoàng Mai Anh',
  'Phan Hải Yến',
  'Lê Ngọc Linh',
  'Nguyễn Tuấn Anh',
  'Bùi Thị Thu Thảo',
  'Ngô Hữu Phước',
  'Đặng Ngọc Trinh',
  'Vương Minh Tâm',
  'Nguyễn Thị Mai',
  'Lâm Văn Toàn',
  'Nguyễn Hoàng Anh',
  'Trương Thị Hà',
  'Hoàng Văn Khánh',
  'Trịnh Thị Hương',
  'Lâm Bảo Ngọc',
  'Phan Văn Đức',
  'Đinh Thị Phương',
  'Hoàng Quốc Anh',
  'Nguyễn Thị Lan',
  'Lê Thị Thu Thủy',
  'Nguyễn Quang Huy',
  'Trần Thị Hồng',
  'Vương Bảo Trâm',
  'Lê Ngọc Hòa',
  'Trần Văn Dũng',
  'Đào Thị Thanh',
  'Nguyễn Văn Long',
  'Đặng Thị Mai',
  'Nguyễn Hồng Thắm',
  'Trần Văn Hùng',
  'Bùi Thị Hoa',
  'Phạm Văn Đức',
  'Lê Thị Thùy Dung',
  'Ngô Văn Tuấn',
  'Phan Thị Huệ',
  'Lê Văn Phú',
  'Trần Thị Ánh Nguyệt',
  'Đỗ Thị Diệu Linh',
  'Hoàng Đức Thắng',
  'Nguyễn Thị Thảo',
  'Lê Hải Đăng',
  'Phạm Thị Hoài',
  'Trần Minh Quân',
  'Nguyễn Thị Kim',
  'Nguyễn Đình Trọng',
  'Lâm Thị Minh Châu',
  'Trần Đức Thành',
  'Nguyễn Thị Hà',
  'Vũ Minh Hiếu',
  'Nguyễn Thị Ngọc Ánh',
  'Đinh Văn Hùng',
  'Trần Thị Thanh Thảo',
  'Ngô Minh Hoàng',
  'Bùi Thị Thùy Linh',
  'Phan Thanh Tùng',
  'Lê Thị Mai Anh',
  'Trần Quang Huy',
  'Nguyễn Thị Bích Ngọc',
  'Đào Văn Trung',
  'Hoàng Thị Lan Anh',
  'Nguyễn Văn Quân',
  'Đặng Thị Ngọc Trâm',
  'Phạm Đình Quang',
  'Lâm Thị Ngọc Hà',
  'Trần Văn Hòa',
  'Nguyễn Thị Hồng Đào',
  'Bùi Văn Khánh',
  'Trương Thị Diệu Linh',
  'Lê Thị Thùy Trang',
  'Nguyễn Văn Hiệp',
  'Đỗ Thị Thùy Dung',
  'Ngô Văn Hoàn',
  'Trần Thị Kim Ngân',
  'Lê Minh Tâm',
  'Hoàng Thị Thu Hà',
  'Phan Văn Thanh',
  'Nguyễn Thị Thúy Hà',
  'Vương Thị Ngọc Ánh',
  'Trần Văn Thanh',
  'Đinh Minh Tuấn',
  'Phạm Thị Thu Thảo',
  'Nguyễn Văn Hòa',
  'Nguyễn Thị Quỳnh Trâm',
  'Bùi Thị Hồng Nhung',
  'Ngô Thị Thu Thảo',
  'Nguyễn Văn Thắng'
];

const phones = [
  '0901234567',
  '0912345678',
  '0923456789',
  '0934567890',
  '0945678901',
  '0956789012',
  '0967890123',
  '0978901234',
  '0989012345',
  '0990123456',
  '0891234567',
  '0882345678',
  '0873456789',
  '0864567890',
  '0855678901',
  '0846789012',
  '0837890123',
  '0828901234',
  '0819012345',
  '0800123456',
  '0701122334',
  '0702233445',
  '0703344556',
  '0704455667',
  '0705566778',
  '0706677889',
  '0707788990',
  '0708899001',
  '0709900112',
  '0700011223',
  '0771122334',
  '0772233445',
  '0773344556',
  '0774455667',
  '0775566778',
  '0776677889',
  '0777788990',
  '0778899001',
  '0779900112',
  '0770011223',
  '0781122334',
  '0782233445',
  '0783344556',
  '0784455667',
  '0785566778',
  '0786677889',
  '0787788990',
  '0788899001',
  '0789900112',
  '0780011223',
  '0791122334',
  '0792233445',
  '0793344556',
  '0794455667',
  '0795566778',
  '0796677889',
  '0797788990',
  '0798899001',
  '0799900112',
  '0790011223',
  '0861122334',
  '0862233445',
  '0863344556',
  '0864455667',
  '0865566778',
  '0866677889',
  '0867788990',
  '0868899001',
  '0869900112',
  '0860011223',
  '0851122334',
  '0852233445',
  '0853344556',
  '0854455667',
  '0855566778',
  '0856677889',
  '0857788990',
  '0858899001',
  '0859900112',
  '0850011223',
  '0841122334',
  '0842233445',
  '0843344556',
  '0844455667',
  '0845566778',
  '0846677889',
  '0847788990',
  '0848899001',
  '0849900112',
  '0840011223',
  '0831122334',
  '0832233445',
  '0833344556',
  '0834455667',
  '0835566778',
  '0836677889',
  '0837788990',
  '0838899001',
  '0839900112',
  '0830011223',
  '0821122334',
  '0822233445',
  '0823344556',
  '0824455667',
  '0825566778',
  '0826677889',
  '0827788990',
  '0828899001',
  '0829900112',
  '0820011223'
];

const addresses = [
  '123 Đường ABC, Quận 1, TP HCM',
  '456 Đường XYZ, Quận 2, TP HCM',
  '789 Đường LMN, Quận 3, TP HCM',
  '101 Đường PQR, Quận 4, TP HCM',
  '202 Đường UVW, Quận 5, TP HCM',
  '303 Đường XYZ, Quận 6, TP HCM',
  '404 Đường LMN, Quận 7, TP HCM',
  '505 Đường ABC, Quận 8, TP HCM',
  '606 Đường PQR, Quận 9, TP HCM',
  '707 Đường UVW, Quận 10, TP HCM',
  '808 Đường XYZ, Quận 11, TP HCM',
  '909 Đường LMN, Quận 12, TP HCM',
  '121 Đường ABC, Quận Bình Thạnh, TP HCM',
  '131 Đường PQR, Quận Tân Bình, TP HCM',
  '141 Đường UVW, Quận Phú Nhuận, TP HCM',
  '151 Đường XYZ, Quận Tân Phú, TP HCM',
  '161 Đường LMN, Quận Gò Vấp, TP HCM',
  '171 Đường ABC, Quận Bình Tân, TP HCM',
  '181 Đường PQR, Quận Thủ Đức, TP HCM',
  '191 Đường UVW, Quận Cần Giờ, TP HCM',
  '202 Đường XYZ, Quận 1, TP HCM',
  '303 Đường LMN, Quận 2, TP HCM',
  '404 Đường ABC, Quận 3, TP HCM',
  '505 Đường PQR, Quận 4, TP HCM',
  '606 Đường UVW, Quận 5, TP HCM',
  '707 Đường XYZ, Quận 6, TP HCM',
  '808 Đường LMN, Quận 7, TP HCM',
  '909 Đường ABC, Quận 8, TP HCM',
  '121 Đường PQR, Quận 9, TP HCM',
  '131 Đường UVW, Quận 10, TP HCM',
  '141 Đường XYZ, Quận 11, TP HCM',
  '151 Đường LMN, Quận 12, TP HCM',
  '161 Đường ABC, Quận Bình Thạnh, TP HCM',
  '171 Đường PQR, Quận Tân Bình, TP HCM',
  '181 Đường UVW, Quận Phú Nhuận, TP HCM',
  '191 Đường XYZ, Quận Tân Phú, TP HCM',
  '202 Đường LMN, Quận Gò Vấp, TP HCM',
  '303 Đường ABC, Quận Bình Tân, TP HCM',
  '404 Đường PQR, Quận Thủ Đức, TP HCM',
  '505 Đường UVW, Quận Cần Giờ, TP HCM',
  '606 Đường XYZ, Quận 1, TP HCM',
  '707 Đường LMN, Quận 2, TP HCM',
  '808 Đường ABC, Quận 3, TP HCM',
  '909 Đường PQR, Quận 4, TP HCM',
  '121 Đường UVW, Quận 5, TP HCM',
  '131 Đường XYZ, Quận 6, TP HCM',
  '141 Đường LMN, Quận 7, TP HCM',
  '151 Đường ABC, Quận 8, TP HCM',
  '161 Đường PQR, Quận 9, TP HCM',
  '171 Đường UVW, Quận 10, TP HCM',
  '181 Đường XYZ, Quận 11, TP HCM',
  '191 Đường LMN, Quận 12, TP HCM',
  '202 Đường ABC, Quận Bình Thạnh, TP HCM',
  '303 Đường PQR, Quận Tân Bình, TP HCM',
  '404 Đường UVW, Quận Phú Nhuận, TP HCM',
  '505 Đường XYZ, Quận Tân Phú, TP HCM',
  '606 Đường LMN, Quận Gò Vấp, TP HCM',
  '707 Đường ABC, Quận Bình Tân, TP HCM',
  '808 Đường PQR, Quận Thủ Đức, TP HCM',
  '909 Đường UVW, Quận Cần Giờ, TP HCM',
  '121 Đường XYZ, Quận 1, TP HCM',
  '131 Đường LMN, Quận 2, TP HCM',
  '141 Đường ABC, Quận 3, TP HCM',
  '151 Đường PQR, Quận 4, TP HCM',
  '161 Đường UVW, Quận 5, TP HCM',
  '171 Đường XYZ, Quận 6, TP HCM',
  '181 Đường LMN, Quận 7, TP HCM',
  '191 Đường ABC, Quận 8, TP HCM',
  '202 Đường PQR, Quận 9, TP HCM',
  '303 Đường UVW, Quận 10, TP HCM',
  '404 Đường XYZ, Quận 11, TP HCM',
  '505 Đường LMN, Quận 12, TP HCM',
  '606 Đường ABC, Quận Bình Thạnh, TP HCM',
  '707 Đường PQR, Quận Tân Bình, TP HCM',
  '808 Đường UVW, Quận Phú Nhuận, TP HCM',
  '909 Đường XYZ, Quận Tân Phú, TP HCM',
  '121 Đường LMN, Quận Gò Vấp, TP HCM',
  '131 Đường ABC, Quận Bình Tân, TP HCM',
  '141 Đường PQR, Quận Thủ Đức, TP HCM',
  '151 Đường UVW, Quận Cần Giờ, TP HCM',
  '161 Đường XYZ, Quận 1, TP HCM',
  '171 Đường LMN, Quận 2, TP HCM',
  '181 Đường ABC, Quận 3, TP HCM',
  '191 Đường PQR, Quận 4, TP HCM',
  '202 Đường UVW, Quận 5, TP HCM',
  '303 Đường XYZ, Quận 6, TP HCM',
  '404 Đường LMN, Quận 7, TP HCM',
  '505 Đường ABC, Quận 8, TP HCM',
  '606 Đường PQR, Quận 9, TP HCM',
  '707 Đường UVW, Quận 10, TP HCM',
  '808 Đường XYZ, Quận 11, TP HCM',
  '909 Đường LMN, Quận 12, TP HCM',
  '121 Đường ABC, Quận Bình Thạnh, TP HCM',
  '131 Đường PQR, Quận Tân Bình, TP HCM',
  '141 Đường UVW, Quận Phú Nhuận, TP HCM',
  '151 Đường XYZ, Quận Tân Phú, TP HCM',
  '161 Đường LMN, Quận Gò Vấp, TP HCM',
  '171 Đường ABC, Quận Bình Tân, TP HCM',
  '181 Đường PQR, Quận Thủ Đức, TP HCM',
  '191 Đường UVW, Quận Cần Giờ, TP HCM'
];

const usernames = [
  'leanhhuy123',
  'nguyenthihuong456',
  'phamminhhoang789',
  'tranmaiphuong101',
  'dovanduong202',
  'nguyenthanhtam303',
  'tranbaoan404',
  'vuhongduc505',
  'hoangmaianh606',
  'phanhaiyen707',
  'lengoclinh808',
  'nguyentuananh909',
  'buithithuthao121',
  'ngohuuphuoc131',
  'dangngoctrinh141',
  'vuongminhtam151',
  'nguyenthimai161',
  'lamvantoan171',
  'nguyenhoanganh181',
  'truongthiha191',
  'hoangvankhanh202',
  'trinhthihuong303',
  'lambaongoc404',
  'phanvanduc505',
  'dinhthiphuong606',
  'hoangquocanh707',
  'nguyenthilan808',
  'lethithuthuy909',
  'nguyenquanghuy121',
  'tranthihong131',
  'vuongbaotram141',
  'lengocHoa151',
  'tranvandung161',
  'daothithanh171',
  'nguyenvanlong181',
  'dangthimai191',
  'nguyenhongtham202',
  'tranvanhung303',
  'buithihoa404',
  'phamvanduc505',
  'lethithuydung606',
  'ngovantuan707',
  'phanthihue808',
  'levanphu909',
  'tranthianhnguyet1010',
  'dothidieulinh1111',
  'hoangducthang1212',
  'nguyenthithao1313',
  'lehaidang1414',
  'phamthihoai1515',
  'tranminhquan1616',
  'nguyenthikim1717',
  'nguyendinhtrong1818',
  'lamthiminchau1919',
  'tranducthanh2020',
  'nguyenthiha2121',
  'vuminhhieu2222',
  'nguyenthingocanh2323',
  'dinhvanhung2424',
  'tranthithanhthao2525',
  'ngominhhoang2626',
  'buithithuylinh2727',
  'phanthanhtung2828',
  'lethimaiAnh2929',
  'tranquanghuy3030',
  'nguyenthibichngoc3131',
  'daovantrung3232',
  'hoangthilanhAnh3333',
  'nguyenvanquan3434',
  'dangthingoctram3535',
  'phamdinhquang3636',
  'lamthingocha3737',
  'tranvanhoa3838',
  'nguyenthongdao3939',
  'buivankhanh4040',
  'truongthidieulinh4141',
  'lethithuytrang4242',
  'nguyenvanhiep4343',
  'dothithuydung4444',
  'ngovanhoan4545',
  'tranthikimngan4646',
  'leminhtam4747',
  'hoangthuthaha4848',
  'phanvanthanh4949',
  'nguyenthithuyha5050',
  'vuongthingocanh5151',
  'tranvanthanh5252',
  'dinhminhtuan5353',
  'phamthithuthao5454',
  'nguyenvanhoa5555',
  'nguyenthiquynhtram5656',
  'buithihongnhung5757',
  'ngothithuthao5858',
  'nguyenvanthang5959'
];

const emails = [
  'leanhhuy123@gmail.com',
  'nguyenthihuong456@gmail.com',
  'phamminhhoang789@gmail.com',
  'tranmaiphuong101@gmail.com',
  'dovanduong202@gmail.com',
  'nguyenthanhtam303@gmail.com',
  'tranbaoan404@gmail.com',
  'vuhongduc505@gmail.com',
  'hoangmaianh606@gmail.com',
  'phanhaiyen707@gmail.com',
  'lengoclinh808@gmail.com',
  'nguyentuananh909@gmail.com',
  'buithithuthao121@gmail.com',
  'ngohuuphuoc131@gmail.com',
  'dangngoctrinh141@gmail.com',
  'vuongminhtam151@gmail.com',
  'nguyenthimai161@gmail.com',
  'lamvantoan171@gmail.com',
  'nguyenhoanganh181@gmail.com',
  'truongthiha191@gmail.com',
  'hoangvankhanh202@gmail.com',
  'trinhthihuong303@gmail.com',
  'lambaongoc404@gmail.com',
  'phanvanduc505@gmail.com',
  'dinhthiphuong606@gmail.com',
  'hoangquocanh707@gmail.com',
  'nguyenthilan808@gmail.com',
  'lethithuthuy909@gmail.com',
  'nguyenquanghuy121@gmail.com',
  'tranthihong131@gmail.com',
  'vuongbaotram141@gmail.com',
  'lengocHoa151@gmail.com',
  'tranvandung161@gmail.com',
  'daothithanh171@gmail.com',
  'nguyenvanlong181@gmail.com',
  'dangthimai191@gmail.com',
  'nguyenhongtham202@gmail.com',
  'tranvanhung303@gmail.com',
  'buithihoa404@gmail.com',
  'phamvanduc505@gmail.com',
  'lethithuydung606@gmail.com',
  'ngovantuan707@gmail.com',
  'phanthihue808@gmail.com',
  'levanphu909@gmail.com',
  'tranthianhnguyet1010@gmail.com',
  'dothidieulinh1111@gmail.com',
  'hoangducthang1212@gmail.com',
  'nguyenthithao1313@gmail.com',
  'lehaidang1414@gmail.com',
  'phamthihoai1515@gmail.com',
  'tranminhquan1616@gmail.com',
  'nguyenthikim1717@gmail.com',
  'nguyendinhtrong1818@gmail.com',
  'lamthiminchau1919@gmail.com',
  'tranducthanh2020@gmail.com',
  'nguyenthiha2121@gmail.com',
  'vuminhhieu2222@gmail.com',
  'nguyenthingocanh2323@gmail.com',
  'dinhvanhung2424@gmail.com',
  'tranthithanhthao2525@gmail.com',
  'ngominhhoang2626@gmail.com',
  'buithithuylinh2727@gmail.com',
  'phanthanhtung2828@gmail.com',
  'lethimaiAnh2929@gmail.com',
  'tranquanghuy3030@gmail.com',
  'nguyenthibichngoc3131@gmail.com',
  'daovantrung3232@gmail.com',
  'hoangthilanhAnh3333@gmail.com',
  'nguyenvanquan3434@gmail.com',
  'dangthingoctram3535@gmail.com',
  'phamdinhquang3636@gmail.com',
  'lamthingocha3737@gmail.com',
  'tranvanhoa3838@gmail.com',
  'nguyenthongdao3939@gmail.com',
  'buivankhanh4040@gmail.com',
  'truongthidieulinh4141@gmail.com',
  'lethithuytrang4242@gmail.com',
  'nguyenvanhiep4343@gmail.com',
  'dothithuydung4444@gmail.com',
  'ngovanhoan4545@gmail.com',
  'tranthikimngan4646@gmail.com',
  'leminhtam4747@gmail.com',
  'hoangthuthaha4848@gmail.com',
  'phanvanthanh4949@gmail.com',
  'nguyenthithuyha5050@gmail.com',
  'vuongthingocanh5151@gmail.com',
  'tranvanthanh5252@gmail.com',
  'dinhminhtuan5353@gmail.com',
  'phamthithuthao5454@gmail.com',
  'nguyenvanhoa5555@gmail.com',
  'nguyenthiquynhtram5656@gmail.com',
  'buithihongnhung5757@gmail.com',
  'ngothithuthao5858@gmail.com',
  'nguyenvanthang5959@gmail.com'
];

export const users = () => {
  let rs = [];
  const roles = ['Admin', 'Manager', 'Employee'];
  for (let i = 0; i < 94; i++) {
    const name = names[i];
    const phone = phones[i];
    const email = emails[i];
    const address = addresses[i];
    const username = usernames[i];
    const password = 'Parking@123';
    const role = roles[Math.round(Math.random() * 2)];
    rs.push({
      name,
      phone,
      email,
      address,
      account: {
        username,
        password,
        role
      }
    });
  }

  return rs;
};

export const addManyUser = async () => {
  const userList = users();
  const rs = await UserApi.addMany(userList);
};

export const addManyDriver = async () => {
  let driverList = [];
  const names = fullNames();
  for (let i = 0; i < 100; i++) {
    const randomNumber = Math.floor(Math.random() * 3);
    const name = names[i];
    const username = generateUsername(name);
    const email = generateEmail(username);
    const jobObj = jobs[randomNumber];
    const job = jobObj.name;
    const deparment = jobObj.departments[Math.floor(Math.random() * jobObj.departments.length)];
    const licenePlate = generateLicenePlate(/^\d{2}[A-Z]-\d{4,5}$/);
    driverList.push({
      licenePlate,
      name,
      address: addresses[i],
      phone: generatePhone(),
      email,
      job,
      deparment
    });
  }
  console.log('drivers', driverList);
  // const rs = await UserApi.addMany(userList);
};

function generateLicenePlate(pattern) {
  const twoDigits = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, '0');
  const capitalLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const fourToFiveDigits = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(4, '0');

  return `${twoDigits}${capitalLetter}-${fourToFiveDigits}`;
}
