/**
 * LITTLE LETTERS · 11 NGƯỜI NHẬN (10 lá thư đã chốt + Pu chờ chốt).
 * Chỉ dùng tên chính xác ở ô nhập (có thể bỏ dấu / viết hoa tùy ý).
 * ĐỪNG thay chữ trong thư của người dùng nếu chưa được yêu cầu.
 * Ảnh có nguồn gốc từ ảnh bạn gửi, lưu nội bộ ở assets/people/.
 * QUAN TRỌNG: Tên không phải mật khẩu; dữ liệu tĩnh có thể xem từ source.
 */
window.LETTER_SETTINGS = {
  demoEnabled: false,
  recipients: [
    // ── 01. Mai Ngân (đã chốt)
    {
      "id": "person-01",
      "name": "Mai Ngân",
      "aliases": [
        "Ngân"
      ],
      "photo": "assets/people/01.webp",
      "greeting": "Gửi Mai Ngân iu dấu!",
      "heading": "",
      "paragraphs": [
        "Nghe đồn có người sắp bước chân vào giới tài chính ngân hàng rồi đấy =)))) Không biết kết quả thế nào nhưng dợ đã chuẩn bị tinh thần có một người bạn làm giám đốc ngân hàng để sau này còn vay nóng .",
        "Chúc chằm sớm nhận được tin vui, thi đâu đỗ đấy, ở chỗ làm khum có cạp nong cạp nia.",
        {
          "text": "Dợ đợi tin vui của chằm để đi date tại Gia Pen 💋",
          "strong": true
        }
      ],
      "signature": ""
    }, 
    // ── 02. Hồng Thúy (đã chốt)
    {
      "id": "person-02",
      "name": "Hồng Thúy",
      "aliases": [
        "Thúy"
      ],
      "photo": "assets/people/02.webp",
      "greeting": "Kính gửi Hồng Thúy,",
      "heading": "",
      "paragraphs": [
        "Chúc bà nhan sắc ngày càng thăng hạng, bước ra đường người ta phải ngoái nhìn, bước vào công ty sếp phải cân nhắc tăng lương vì không thể để mất một nhân tài xinh đẹp như thế này",
        "Mong sự nghiệp bà thăng tiến nhanh hơn tốc độ giá vàng, tiền về nhanh hơn tốc độ hết tiền, làm đâu thắng đó, càng ngày càng giàu.",
        "Sau này thành đại gia nhớ đừng giả vờ không quen tui nhé. Tui không cần gì nhiều, chỉ cần một căn biệt thự nhỏ và một chiếc Porsche là được."
      ],
      "signature": ""
    }, 
    // ── 03. Phương Uyên (đã chốt)
    {
      "id": "person-03",
      "name": "Phương Uyên",
      "aliases": [
        "Uyên"
      ],
      "photo": "assets/people/03.webp",
      "greeting": "Gửi tú bà Phương Uyên,",
      "heading": "",
      "paragraphs": [
        "Nhân ngày 20/10 Chách chúc Uyên ku càng xinh đẹp, ráng học tiếng Hàn cho thần thông quảng đại, đã lỡ đâm lao thì phải theo lao, chứ giờ bỏ ngang thì phí công những ngày ngồi học bảng chữ cái trông như đang giải mật mã quốc gia.",
        "Cố học đi bro sau này tiếng Hàn thành thạo tui với bro dẫn đào từ Hàn về Nội Bài phân phối cho cả nước, rồi anh em còn đi Gia Pen, Koo Re A",
        "Chúc bro sớm thoát kiếp deadline, thi đâu qua đó, học đâu nhớ đó, sớm cầm được cả hai tấm bằngggggg"
      ],
      "signature": ""
    }, 
    // ── 04. Xuân (đã chốt)
    {
      "id": "person-04",
      "name": "Xuân",
      "aliases": [],
      "photo": "assets/people/04.webp",
      "greeting": "Gửi Xuân, người phụ nữ đang miệt mài xây dựng quỹ mua xe",
      "heading": "",
      "paragraphs": [
        "Chúc bạn iu đi làm ngày càng thuận lợi, lương tăng đều đều, thưởng về liên tục, tiền trong tài khoản sinh sôi nảy nở như nấm sau mưa =))))",
        "Mong bạn iu sớm rước được pọt chơ về dinh, phượt xe mê ly",
        "Mua được xe rồi thì nhớ chở tui đi chơi nhé,  anh em mìn lên côn viên lãn làng, ae sẵn sèng, đi chơi côn viên lẽn làng"
      ],
      "signature": ""
    }, 
    // ── 05. Tường Vi (đã chốt)
    {
      "id": "person-05",
      "name": "Tường Vi",
      "aliases": [
        "Vi"
      ],
      "photo": "assets/people/05.webp",
      "greeting": "Gửi anh hạt dẻe",
      "heading": "",
      "paragraphs": [
        "Chúc anh hạt dẻ lúc nào cũng may mắn, tiền nhiều như lá mùa thu và cuộc đời ít drama như một bộ phim hết ngân sách sản xuất =))))",
        "Đặc biệt, xin gửi lời chúc chân thành tới anh hạt dẻ: chúc anh sớm có người yêu, sớm thoát kiếp độc thân, sớm giàu nứt vách, tài khoản ngân hàng nhiều số đến mức phải xoay ngang điện thoại mới đọc hết."
      ],
      "signature": ""
    }, 
    // ── 06. Pu (thư nháp, chờ người gửi chốt)
    {
      "id": "person-06",
      "name": "Pu",
      "aliases": [],
      "photo": "assets/people/06.webp",
      "greeting": "Gửi Pu,",
      "heading": "",
      "paragraphs": [
        "Chúc Pu ngày càng xinh đẹp, vui vẻ, ăn gì cũng ngon, ngủ lúc nào cũng đã và đặc biệt là ăn nhiều không béo, tiêu tiền không hết. Ước mơ giản dị của hàng triệu người =))))",
        "Mong cuộc đời đối xử với Pu nhẹ nhàng, deadline tự biến mất, tiền tự tìm đến và những chuyện phiền phức biết điều mà né sang một bên.",
        "Nếu một ngày Pu trở thành đại gia thì nhớ quay lại tìm tao nhé. Tao vẫn ở đây, rất sẵn lòng nhận tài trợ không hoàn lại!",
        {
          "text": "Chúc Pu xinh đẹp bất chấp thời tiết, giàu có bất chấp nền kinh tế! 💗",
          "strong": true
        }
      ],
      "signature": "",
      "status": "draft"
    }, 
    // ── 07. Thanh Hằng (đã chốt)
    {
      "id": "person-07",
      "name": "Thanh Hằng",
      "aliases": [
        "Hằng"
      ],
      "photo": "assets/people/07.webp",
      "greeting": "Gửi Thanh Hằng iu dấuu",
      "heading": "",
      "paragraphs": [
        "Chúc bạn iu bên Đức luôn mạnh khỏe, vui vẻ, học hành công việc thuận lợi, giấy tờ suôn sẻ, sớm ổn định cuộc sống và đạt được mục tiêu định cư lâu dài nhé!",
        "Mong bạn iu sớm giàu bằng euro, tiêu tiền không cần nhìn tỷ giá, đi siêu thị không cần chờ giảm giá, mua vé máy bay về Việt Nam mà không cần ngồi canh sale lúc 2 giờ sáng, Hẹn gặp lại bạn 1 ngày không xa tại côn viên lẽn lànggg"
      ],
      "signature": "",
      "photoFit": "contain"
    }, 
    // ── 08. Thùy Dương (đã chốt)
    {
      "id": "person-08",
      "name": "Thùy Dương",
      "aliases": [
        "Dương"
      ],
      "photo": "assets/people/08.webp",
      "greeting": "Gửi anh Dương iu dấuuuuu",
      "heading": "",
      "paragraphs": [
        "Chúc anh iu sớm vượt qua kiếp sinh viên, luận văn thuận lợi, thi cử suôn sẻ, ra trường đúng hạn, không phải ở lại trường hóng drama :>>>",
        "Chúc anh iu sớm đạt cảnh giới thượng thừa, mở miệng là tiếng Trung tuôn như suối, nghe người bản xứ nói mà không cần cười trừ giả vờ hiểu.",
        "Sau này giỏi rồi nhớ dẫn em sang Trung Quốc ăn lẩu, mua sắm và ngắm trai đẹp nhé hí hí",
        {
          "text": "Sớm tốt nghiệp để rinh quà khủnggggg",
          "strong": true
        }
      ],
      "signature": ""
    }, 
    // ── 09. Hải Yến (đã chốt)
    {
      "id": "person-09",
      "name": "Hải Yến",
      "aliases": [
        "Yến"
      ],
      "photo": "assets/people/09.webp",
      "greeting": "Gửi Hải Yến dấu iuu",
      "heading": "",
      "paragraphs": [
        "Nghe đồn có người sắp từ Nhật về Việt Nam rồi hả =)))) Đề nghị phu nhân tổng tài chuẩn bị tinh thần tái hòa nhập cộng đồng, làm quen lại phố phủ và mỳ cay big bang",
        "Chúc bà trở về bình an, mang theo thật nhiều kỷ niệm đẹp, thật nhiều tiền yên và đặc biệt là quà Nhật cho hội chị em, hí hí. Quà không cần đắt đâu, chỉ cần nhiều là được.",
        "Mong chặng đường tiếp theo của bà thật thuận lợi, làm gì cũng thành công, muốn gì cũng có, tiền vào không ngừng nghỉ."
      ],
      "signature": ""
    }, 
    // ── 10. Hải Anh (đã chốt)
    {
      "id": "person-10",
      "name": "Hải Anh",
      "aliases": [
        "Anh"
      ],
      "photo": "assets/people/10.webp",
      "greeting": "Kính gửi bé Đào Hải Anh,",
      "heading": "",
      "paragraphs": [
        "Nhân dịp lá thư này được khai phong, xin kính chúc bé Đào nhan sắc ngày càng thăng hạng, quyền lực ngày càng củng cố, tiền bạc ngày càng sinh sôi, cầm đầu bột ngô ở khu côn nghịp",
        "Mong bé Đào có một cuộc sống ngập tràn niềm vui, ăn ngon ngủ kỹ, ra đường gặp may, gặp trai đẹp thì được xin số, gặp chuyện phiền phức thì chúng nó tự biết đường né xa.",
        "Sau này có làm đại gia thì đừng quên tui nha bạn hiền\\"
      ],
      "signature": ""
    }, 
    // ── 11. F5 (đã chốt)
    {
      "id": "person-11",
      "name": "F5",
      "aliases": [],
      "photo": "assets/people/11.webp",
      "greeting": "",
      "heading": "",
      "paragraphs": [
        {
          "text": "F5 siu bá khí, tui yêu F5 của tuiiiii !!!!!!",
          "strong": true
        }
      ],
      "signature": "",
      "photoFit": "contain"
    }
  ]
};
