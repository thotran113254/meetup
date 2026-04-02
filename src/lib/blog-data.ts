/**
 * Sample blog post data - replace with CMS or MDX source in production.
 * Each post includes an image for the listing card.
 */

export type BlogSection = {
  id: string;
  subtitle: string;
  image: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  image: string;
  sections: BlogSection[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "workshop-lach-cach-flower-shop",
    title: "Wreath making and flower arrangement workshop - Lach Cach Flower Shop",
    excerpt:
      "Khám phá trải nghiệm làm vòng hoa và cắm hoa độc đáo tại Lach Cach Flower Shop — nơi nghệ thuật hoa tươi gặp gỡ văn hóa Việt Nam trong một buổi workshop đáng nhớ.",
    date: "2025-06-12",
    author: "Grace Nguyen",
    category: "Trải nghiệm",
    readTime: "8 phút đọc",
    image: "/images/destinations/halong.jpg",
    sections: [
      {
        id: "gioi-thieu-workshop",
        subtitle: "Giới thiệu về workshop",
        image: "/images/exp-mid-1.jpg",
        paragraphs: [
          "Workshop làm vòng hoa tại Lach Cach Flower Shop là một trải nghiệm độc đáo, nơi bạn được học cách sắp xếp những bông hoa tươi tắn thành những tác phẩm nghệ thuật sống động. Không gian workshop mang đậm phong cách Hà Nội cổ điển với hương thơm ngào ngạt của hoa tươi.",
          "Buổi workshop kéo dài khoảng 2 tiếng, phù hợp cho cả người mới bắt đầu lẫn những ai đam mê nghệ thuật cắm hoa. Mỗi học viên sẽ được hướng dẫn tỉ mỉ từng bước và mang về một tác phẩm hoàn chỉnh của chính mình.",
        ],
      },
      {
        id: "quy-trinh-thuc-hien",
        subtitle: "Quy trình thực hiện",
        image: "/images/exp-mid-3.jpg",
        paragraphs: [
          "Bắt đầu với việc chọn lựa nguyên liệu từ hàng chục loại hoa tươi được nhập về mỗi sáng sớm. Từ hoa hồng nhung đỏ thắm đến hoa cúc trắng tinh khôi, mỗi loại đều mang một vẻ đẹp và ý nghĩa riêng biệt trong văn hóa Việt Nam.",
          "Dưới sự hướng dẫn nhiệt tình của các nghệ nhân, bạn sẽ học kỹ thuật uốn dây thép, cắt tỉa cành lá và lắp ghép các bông hoa theo đúng tỷ lệ để tạo nên một chiếc vòng hoa hoàn mỹ. Đây là nghệ thuật đòi hỏi sự kiên nhẫn và tâm huyết.",
        ],
      },
      {
        id: "kinh-nghiem-du-lich",
        subtitle: "Kinh nghiệm và lưu ý",
        image: "/images/exp-mid-5.jpg",
        paragraphs: [
          "Hãy mặc quần áo thoải mái và không quá quý giá vì bạn sẽ làm việc với đất, nước và các vật liệu tự nhiên. Workshop tốt nhất nên đặt trước ít nhất 2 ngày để đảm bảo chỗ, đặc biệt vào cuối tuần khi lượng khách tham gia khá đông.",
          "Chi phí tham gia workshop bao gồm toàn bộ nguyên liệu và tác phẩm hoàn chỉnh bạn mang về. Đây là món quà lưu niệm tuyệt vời và cũng là cách tuyệt vời để tìm hiểu thêm về văn hóa hoa lá truyền thống của Hà Nội.",
        ],
      },
    ],
  },
  {
    slug: "kham-pha-vinh-ha-long",
    title: "Khám phá vịnh Hạ Long — Kỳ quan thiên nhiên thế giới",
    excerpt:
      "Hành trình trên vịnh Hạ Long với hàng nghìn hòn đảo đá vôi hùng vĩ, hang động kỳ bí và làng chài yên bình — trải nghiệm không thể bỏ lỡ khi đến Việt Nam.",
    date: "2025-05-20",
    author: "Sunny Pham",
    category: "Điểm đến",
    readTime: "12 phút đọc",
    image: "/images/destinations/halong.jpg",
    sections: [
      {
        id: "ve-dep-vinh-ha-long",
        subtitle: "Vẻ đẹp của vịnh Hạ Long",
        image: "/images/tour-1-floating-market.png",
        paragraphs: [
          "Vịnh Hạ Long trải rộng hơn 1.500 km² với khoảng 1.600 hòn đảo lớn nhỏ, trong đó có nhiều hang động tuyệt đẹp như hang Sửng Sốt, hang Thiên Cung, hang Đầu Gỗ. Ánh sáng phản chiếu trên mặt nước xanh biếc tạo nên một bức tranh thiên nhiên hoàn hảo.",
          "Được UNESCO công nhận là Di sản Thiên nhiên Thế giới lần đầu vào năm 1994, vịnh Hạ Long tiếp tục thu hút hàng triệu du khách mỗi năm với vẻ đẹp không bao giờ cũ. Mỗi góc nhìn, mỗi thời điểm trong ngày đều mang đến một cảm xúc khác nhau.",
        ],
      },
      {
        id: "cac-hoat-dong",
        subtitle: "Các hoạt động trải nghiệm",
        image: "/images/tour-2-hoi-an.png",
        paragraphs: [
          "Kayaking qua các hang động ngập nước, chèo thuyền khám phá làng chài nổi Vạn Giã, hay leo núi ngắm toàn cảnh vịnh từ trên cao — mỗi hoạt động đều mang lại những trải nghiệm đặc sắc và không thể quên.",
          "Tour cruise qua đêm trên vịnh là lựa chọn được yêu thích nhất. Bạn sẽ được thưởng thức hải sản tươi ngon ngay trên boong tàu, ngắm hoàng hôn và bình minh tuyệt đẹp trên mặt vịnh trong không gian yên bình tuyệt đối.",
        ],
      },
      {
        id: "thong-tin-luon-tru",
        subtitle: "Thông tin lưu trú và di chuyển",
        image: "/images/tour-3-mekong.png",
        paragraphs: [
          "Từ Hà Nội, bạn có thể đến Hạ Long bằng xe khách (khoảng 3,5 tiếng), xe limousine hoặc seaplane để tiết kiệm thời gian. Tốt nhất nên đặt tour trọn gói bao gồm xe đưa đón và cruise để có trải nghiệm hoàn chỉnh nhất.",
          "Thời điểm lý tưởng để thăm vịnh Hạ Long là từ tháng 10 đến tháng 4 khi thời tiết mát mẻ và ít mưa. Hãy mang theo áo mưa và kem chống nắng dù bạn đến vào mùa nào nhé!",
        ],
      },
    ],
  },
  {
    slug: "am-thuc-hoi-an",
    title: "Hành trình ẩm thực Hội An — Thiên đường của những hương vị",
    excerpt:
      "Phố cổ Hội An không chỉ đẹp về kiến trúc mà còn là thiên đường ẩm thực với những món ăn đặc sắc như Cao Lầu, Mì Quảng và Bánh Mì nổi tiếng thế giới.",
    date: "2025-04-10",
    author: "Linh Tran",
    category: "Ẩm thực",
    readTime: "10 phút đọc",
    image: "/images/tour-2-hoi-an.png",
    sections: [
      {
        id: "cao-lau-mi-quang",
        subtitle: "Cao Lầu và Mì Quảng",
        image: "/images/exp-north-1.jpg",
        paragraphs: [
          "Cao Lầu là món ăn đặc trưng nhất của Hội An, với sợi mì dày làm từ gạo địa phương, thịt heo xá xíu thơm ngon và nước tương đặc biệt. Người ta nói rằng Cao Lầu ngon nhất phải được làm từ nước giếng Bá Lễ hàng trăm năm tuổi trong lòng phố cổ.",
          "Mì Quảng với màu vàng từ nghệ, ăn kèm tôm, thịt, rau sống và bánh đa vừng giòn rụm là một biểu tượng ẩm thực của xứ Quảng. Mỗi quán có công thức nấu riêng, tạo nên sự phong phú và đa dạng khó cưỡng.",
        ],
      },
      {
        id: "banh-mi-hoi-an",
        subtitle: "Bánh Mì huyền thoại Hội An",
        image: "/images/exp-north-3.jpg",
        paragraphs: [
          "Bánh Mì Phượng và Bánh Mì Madam Khanh là hai cái tên không thể bỏ qua khi đến Hội An. Ổ bánh mì giòn rụm với nhân phong phú gồm pate, chả lụa, dưa leo, cà rốt muối chua và rau thơm — đơn giản nhưng hoàn hảo.",
          "Chỉ với 25.000 đến 30.000 đồng, bạn có một bữa sáng hoặc bữa nhẹ đậm đà hương vị. Anthony Bourdain từng gọi Bánh Mì Hội An là 'bánh sandwich ngon nhất thế giới' — và một lần thử, bạn sẽ hoàn toàn đồng ý!",
        ],
      },
      {
        id: "tour-am-thuc",
        subtitle: "Tour ẩm thực và lớp nấu ăn",
        image: "/images/exp-north-5.jpg",
        paragraphs: [
          "Tham gia một lớp học nấu ăn tại Hội An là cách tuyệt vời để mang về nhà không chỉ là ký ức mà còn là kỹ năng. Hầu hết các lớp học bắt đầu bằng chuyến tham quan chợ địa phương để tự chọn nguyên liệu tươi ngon.",
          "Các tour ẩm thực đêm tại phố cổ sẽ dẫn bạn qua hàng chục quán ăn nhỏ, thưởng thức từng món đặc sản địa phương với mức giá cực kỳ hợp lý. Đây là cách tốt nhất để khám phá 'bản đồ ẩm thực' đích thực của Hội An.",
        ],
      },
    ],
  },
  {
    slug: "mekong-delta-experience",
    title: "Đồng bằng sông Cửu Long — Cuộc sống trên những dòng sông",
    excerpt:
      "Hòa mình vào nhịp sống bình yên của miền Tây Nam Bộ, khám phá chợ nổi Cái Răng, vườn trái cây bạt ngàn và những con kênh xanh mát chạy dài vô tận.",
    date: "2025-03-28",
    author: "Linh Tran",
    category: "Du lịch",
    readTime: "7 phút đọc",
    image: "/images/tour-3-mekong.png",
    sections: [
      {
        id: "cho-noi-cai-rang",
        subtitle: "Chợ nổi Cái Răng",
        image: "/images/exp-mid-2.jpg",
        paragraphs: [
          "Chợ nổi Cái Răng họp từ tờ mờ sáng, khoảng 5 giờ sáng là thời điểm sầm uất nhất khi hàng trăm chiếc thuyền chở đầy rau củ quả tụ họp trên sông. Mỗi thuyền treo những thứ mình bán lên cây sào cao, người mua chỉ cần nhìn từ xa là biết.",
          "Ngồi trên chiếc thuyền nhỏ, nhâm nhi ly cà phê sữa đá và ăn tô bún riêu nóng hổi giữa dòng sông — đó là trải nghiệm sáng sớm khó quên nhất trong chuyến du lịch miền Tây của bạn.",
        ],
      },
      {
        id: "vuon-trai-cay",
        subtitle: "Vườn trái cây và homestay miệt vườn",
        image: "/images/exp-mid-4.jpg",
        paragraphs: [
          "Các vườn trái cây ở Cái Mơn (Bến Tre), Cai Lậy (Tiền Giang) hay Lái Thiêu (Bình Dương) là điểm đến tuyệt vời để tự tay hái những quả chín ngọt lịm. Sầu riêng, chôm chôm, măng cụt, nhãn — tất cả đều tươi ngon đến mức khó quên.",
          "Lưu trú tại homestay miệt vườn giúp bạn hòa mình vào cuộc sống người dân địa phương. Bữa sáng với cơm tấm, bún bò hay cháo trắng ăn với cá khô giản dị nhưng đậm đà hương vị — chính là điều làm miền Tây trở nên đặc biệt.",
        ],
      },
      {
        id: "di-chuyen-mekong",
        subtitle: "Hướng dẫn di chuyển",
        image: "/images/exp-mid-6.jpg",
        paragraphs: [
          "Từ TP.HCM, bạn có thể đến Cần Thơ bằng xe khách (3,5 tiếng), xe limousine hoặc tàu cao tốc. Tour 2 ngày 1 đêm từ TP.HCM là lựa chọn phổ biến, bao gồm tham quan chợ nổi, vườn trái cây và nghỉ đêm tại homestay.",
          "Thuê xe máy hoặc xe đạp để tự khám phá các làng nghề và đường quê là cách lý tưởng nhất. Mùa khô (tháng 11 đến tháng 4) là thời điểm tốt nhất để thăm Đồng bằng sông Cửu Long.",
        ],
      },
    ],
  },
  {
    slug: "phu-quoc-paradise",
    title: "Phú Quốc — Hòn đảo ngọc của Việt Nam",
    excerpt:
      "Từ bãi biển cát trắng hoang sơ đến những khu resort sang trọng đẳng cấp, Phú Quốc là điểm đến hoàn hảo cho kỳ nghỉ thư giãn và khám phá thiên nhiên tuyệt đẹp.",
    date: "2025-02-15",
    author: "Grace Nguyen",
    category: "Nghỉ dưỡng",
    readTime: "15 phút đọc",
    image: "/images/tour-4-palm-trees.png",
    sections: [
      {
        id: "bai-bien-phu-quoc",
        subtitle: "Các bãi biển đẹp nhất Phú Quốc",
        image: "/images/exp-mid-7.jpg",
        paragraphs: [
          "Bãi Sao ở phía đông nam đảo là thiên đường với cát trắng mịn như bột và nước biển trong xanh ngọc bích. Ít đông đúc hơn so với bãi biển trung tâm, Bãi Sao giữ được vẻ hoang sơ và yên tĩnh hiếm có.",
          "Bãi Dài ở phía bắc đảo trải dài hơn 20km, được bình chọn là một trong những bãi biển đẹp nhất châu Á. Hoàng hôn tại đây với bầu trời đỏ rực phản chiếu xuống mặt biển phẳng lặng là khoảnh khắc không thể nào quên.",
        ],
      },
      {
        id: "hai-san-phu-quoc",
        subtitle: "Ẩm thực hải sản và đặc sản",
        image: "/images/exp-north-2.jpg",
        paragraphs: [
          "Hải sản Phú Quốc nổi tiếng với cua, tôm hùm, nhum biển và mực khổng lồ với mức giá hợp lý. Khu chợ đêm Phú Quốc và con đường Trần Hưng Đạo là thiên đường ẩm thực không thể bỏ qua.",
          "Nước mắm Phú Quốc với hàm lượng đạm cao và hương thơm đặc trưng là đặc sản số một của đảo. Tham quan các nhà thùng nước mắm truyền thống là trải nghiệm thú vị để hiểu thêm về nghề làm nước mắm lâu đời.",
        ],
      },
      {
        id: "hoat-dong-bien",
        subtitle: "Hoạt động trên biển và lặn ngắm san hô",
        image: "/images/exp-north-4.jpg",
        paragraphs: [
          "Tour lặn ngắm san hô tại quần đảo An Thới là trải nghiệm không thể thiếu. Với tầm nhìn trong suốt dưới làn nước xanh biếc, bạn sẽ được chiêm ngưỡng những rặng san hô đầy màu sắc và hàng trăm loài cá nhiệt đới.",
          "Câu cá đêm, chèo thuyền kayak, hay đơn giản là thư giãn trên bãi biển với ly nước dừa tươi mát — mỗi hoạt động đều mang đến sự thư thái tuyệt đối và kỷ niệm đẹp về Phú Quốc.",
        ],
      },
    ],
  },
  {
    slug: "ha-noi-36-pho-phuong",
    title: "Hà Nội 36 Phố Phường — Nơi lịch sử gặp gỡ hiện đại",
    excerpt:
      "Dạo bước qua 36 phố phường Hà Nội, thưởng thức Phở Hà Nội đích thực, khám phá Hồ Hoàn Kiếm và cảm nhận nhịp sống đặc biệt của thủ đô ngàn năm văn hiến.",
    date: "2025-01-05",
    author: "Sunny Pham",
    category: "Văn hóa",
    readTime: "9 phút đọc",
    image: "/images/destinations/hanoi.jpg",
    sections: [
      {
        id: "pho-co-ha-noi",
        subtitle: "Phố cổ Hà Nội và kiến trúc độc đáo",
        image: "/images/exp-north-6.jpg",
        paragraphs: [
          "Khu phố cổ Hà Nội gồm 36 phố phường với những con phố mang tên theo nghề truyền thống: phố Hàng Đào bán lụa, phố Hàng Bạc bán đồ bạc, phố Hàng Mã bán đồ vàng mã. Mỗi con phố là một bảo tàng sống về văn hóa thương mại Hà Nội xưa.",
          "Kiến trúc nhà ống với mặt tiền hẹp nhưng sâu trong lòng, mái ngói rêu phong — tất cả tạo nên bức tranh đô thị cổ kính đặc trưng. Buổi tối cuối tuần, các tuyến phố này biến thành phố đi bộ sầm uất.",
        ],
      },
      {
        id: "am-thuc-ha-noi",
        subtitle: "Ẩm thực đường phố Hà Nội",
        image: "/images/exp-north-7.jpg",
        paragraphs: [
          "Phở Hà Nội với nước dùng trong vắt, ngọt thanh từ xương bò hầm lâu giờ là quốc hồn quốc túy của ẩm thực Việt. Bún Chả Hương Liên trên phố Lê Văn Hưu — nơi cố Tổng thống Obama từng ghé thăm — là địa điểm phải đến cho mọi du khách.",
          "Bánh Cuốn Thanh Trì, Chả Cá Lã Vọng, Bún Đậu Mắm Tôm — mỗi món ăn là một câu chuyện về lịch sử và văn hóa ẩm thực của người Hà Nội. Một buổi sáng đi ăn rong quanh phố cổ là trải nghiệm không thể bỏ lỡ.",
        ],
      },
      {
        id: "ho-hoan-kiem",
        subtitle: "Hồ Hoàn Kiếm và đền Ngọc Sơn",
        image: "/images/exp-mid-1.jpg",
        paragraphs: [
          "Hồ Hoàn Kiếm là trái tim của Hà Nội, nơi người dân đến dạo bộ sáng sớm, ngắm hoa và tận hưởng không khí trong lành. Tháp Rùa giữa hồ và đền Ngọc Sơn trên cầu Thê Húc đỏ thắm là biểu tượng không thể tách rời của thủ đô.",
          "Dạo bộ quanh hồ vào buổi sáng sớm hoặc chiều tối để cảm nhận nhịp sống Hà Nội đích thực. Cuối tuần, phố đi bộ Đinh Tiên Hoàng tấp nập với các hoạt động văn hóa, biểu diễn nghệ thuật và ẩm thực đường phố.",
        ],
      },
    ],
  },
];

/** Format date to "JUN 12, 2025" style (Figma design) */
export function formatBlogDate(date: string): string {
  return new Date(date)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}
