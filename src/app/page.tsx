import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { StatsSection } from "@/components/sections/stats-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { FaqSection } from "@/components/sections/faq-section";
import { CtaSection } from "@/components/sections/cta-section";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import {
  generatePageMetadata,
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
  buildFaqJsonLd,
} from "@/lib/seo-utils";

/** Homepage gets its own metadata to override the template default title */
export const metadata: Metadata = generatePageMetadata({
  title: "YourBrand - Giai phap website chuyen nghiep cho doanh nghiep Viet Nam",
  description:
    "Thiet ke website dep, toc do cao, toi uu SEO & GEO giup doanh nghiep vuon ra thi truong quoc te. Tu van mien phi.",
  path: "/",
});

const HOME_FAQS = [
  {
    question: "Thoi gian hoan thanh mot du an website la bao lau?",
    answer: "Tuy thuoc vao do phuc tap, mot landing page co ban mat 1-2 tuan, website doanh nghiep day du mat 4-8 tuan. Chung toi se cung cap timeline cu the sau khi nam ro yeu cau cua ban.",
  },
  {
    question: "Chi phi bao tri website hang thang la bao nhieu?",
    answer: "Phi bao tri tu 500.000 - 2.000.000 VND/thang tuy vao goi dich vu, bao gom hosting, SSL, cap nhat bao mat, sao luu du lieu va ho tro ky thuat.",
  },
  {
    question: "Toi co the tu cap nhat noi dung website khong?",
    answer: "Co, tat ca cac website doanh nghiep deu duoc tich hop CMS (Content Management System) giup ban de dang cap nhat bai viet, hinh anh, san pham ma khong can kien thuc lap trinh.",
  },
  {
    question: "YourBrand co ho tro SEO sau khi ban giao khong?",
    answer: "Co, chung toi cung cap dich vu SEO hang thang bao gom toi uu tu khoa, xay dung backlink, bao cao traffic va tu van chien luoc noi dung theo gia tri rieng.",
  },
  {
    question: "Quy trinh lam viec voi YourBrand nhu the nao?",
    answer: "Gom 5 buoc: Tu van & phan tich yeu cau → Thiet ke giao dien mau → Phat trien & tich hop → Kiem thu & chinh sua → Ban giao & dao tao. Moi buoc deu co bien ban nghiem thu ro rang.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* JSON-LD: Organization + Website + FAQ schemas for SEO & GEO */}
      <JsonLdScript data={[buildOrganizationJsonLd(), buildWebsiteJsonLd(), buildFaqJsonLd(HOME_FAQS)]} />

      <HeroSection
        badge="Ra mat phien ban moi 2025"
        title="Giai phap website chuyen nghiep cho"
        titleHighlight="doanh nghiep Viet Nam"
        description="Chung toi xay dung website dep, toc do cao, toi uu SEO giup doanh nghiep cua ban vuon ra thi truong quoc te. Tu thiet ke den phat trien, chung toi dong hanh cung ban."
        primaryCta={{ label: "Bat dau mien phi", href: "/contact" }}
        secondaryCta={{ label: "Xem dich vu", href: "/services" }}
      />

      <FeaturesSection
        title="Tai sao chon chung toi?"
        subtitle="Chung toi cung cap giai phap toan dien giup doanh nghiep ban phat trien ben vung tren moi truong so."
        features={[
          {
            icon: "Zap",
            title: "Toc do vuot troi",
            description: "Website dat diem Core Web Vitals cao, tải trang duoi 2 giay, toi uu tren moi thiet bi.",
          },
          {
            icon: "Search",
            title: "SEO chuan Google",
            description: "Toi uu hoa tu khoa, meta tags, structured data giup website len top tim kiem tu nhien.",
          },
          {
            icon: "Shield",
            title: "Bao mat toan dien",
            description: "SSL, HTTPS, bao ve DDoS, sao luu du lieu hang ngay dam bao an toan tuyet doi.",
          },
          {
            icon: "Smartphone",
            title: "Responsive da thiet bi",
            description: "Giao dien hien thi dep tren moi man hinh tu dien thoai, may tinh bang den desktop.",
          },
          {
            icon: "BarChart3",
            title: "Phan tich & bao cao",
            description: "Tich hop Google Analytics, theo doi hanh vi nguoi dung, bao cao chi tiet hang thang.",
          },
          {
            icon: "Headphones",
            title: "Ho tro 24/7",
            description: "Doi ngu ky thuat vien luon san sang ho tro ban moi luc, moi noi qua nhieu kenh.",
          },
        ]}
      />

      <StatsSection
        stats={[
          { value: 500, suffix: "+", label: "Du an hoan thanh", description: "Tu 2018 den nay" },
          { value: 98, suffix: "%", label: "Khach hang hai long", description: "Ty le giu chan khach hang" },
          { value: 15, suffix: "+", label: "Chuyen gia kinh nghiem", description: "Doi ngu phuong chau Au" },
          { value: 50, suffix: "+", label: "Quoc gia phuc vu", description: "Toan cau hoa dich vu" },
        ]}
      />

      <TestimonialsSection
        testimonials={[
          {
            name: "Nguyen Van An",
            role: "CEO",
            company: "TechViet JSC",
            content: "YourBrand da giup chung toi tang traffic len 300% chi trong 6 thang. Doi ngu rat chuyen nghiep va nhiet tinh, luon lang nghe yeu cau cua khach hang.",
            rating: 5,
          },
          {
            name: "Tran Thi Bich",
            role: "Marketing Director",
            company: "Saigon Fashion",
            content: "Website moi cua chung toi dep hon nhieu, toc do tai trang nhanh gap doi. Doanh thu online tang 45% sau 3 thang ra mat. Rat xung dang dau tu.",
            rating: 5,
          },
          {
            name: "Le Minh Duc",
            role: "Founder",
            company: "EduOnline VN",
            content: "Ho tro khach hang rat tot, moi van de deu duoc giai quyet trong ngay. Gia ca hop ly, chat luong cao. Chac chan se tiep tuc hop tac lau dai.",
            rating: 5,
          },
        ]}
      />

      <PricingSection
        subtitle="Lua chon goi dich vu phu hop voi nhu cau va ngan sach cua ban."
        plans={[
          {
            name: "Co ban",
            price: "5.000.000",
            period: "du an",
            description: "Phu hop cho startup va doanh nghiep nho moi bat dau.",
            features: [
              "Landing page 1 trang",
              "Thiet ke responsive",
              "Toi uu SEO co ban",
              "Ho tro 3 thang",
              "SSL mien phi",
            ],
            cta: { label: "Chon goi nay", href: "/contact" },
          },
          {
            name: "Chuyen nghiep",
            price: "15.000.000",
            period: "du an",
            description: "Giai phap toan dien cho doanh nghiep dang tang truong.",
            features: [
              "Website nhieu trang",
              "CMS quan tri noi dung",
              "SEO nang cao + bao cao",
              "Tich hop mang xa hoi",
              "Ho tro 12 thang",
              "Toc do toi uu cao cap",
            ],
            cta: { label: "Chon goi nay", href: "/contact" },
            highlighted: true,
            badge: "Pho bien nhat",
          },
          {
            name: "Doanh nghiep",
            price: "Lien he",
            description: "Giai phap tuy chinh cho tap doan va thuong hieu lon.",
            features: [
              "Thiet ke rieng 100%",
              "Tinh nang tuy chinh",
              "API & tich hop he thong",
              "Ho tro uu tien 24/7",
              "SLA cam ket",
              "Dao tao nhan vien",
            ],
            cta: { label: "Lien he tu van", href: "/contact" },
          },
        ]}
      />

      <FaqSection faqs={HOME_FAQS} />

      <CtaSection />
    </>
  );
}
