import type { Metadata } from "next";
import { generatePageMetadata, buildOrganizationJsonLd } from "@/lib/seo-utils";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { CtaSection } from "@/components/sections/cta-section";

export const metadata: Metadata = generatePageMetadata({
  title: "Ve chung toi",
  description: "Tim hieu ve YourBrand - doi ngu chuyen gia thiet ke va phat trien website hang dau Viet Nam voi hon 7 nam kinh nghiem.",
  path: "/about",
});

const TEAM = [
  { name: "Nguyen Minh Khoa", role: "CEO & Co-founder", bio: "10+ nam kinh nghiem trong linh vuc phat trien phan mem va chien luoc so." },
  { name: "Tran Phuong Linh", role: "Head of Design", bio: "Chuyen gia UI/UX voi kinh nghiem lam viec tai Singapore va Nhat Ban." },
  { name: "Le Van Thanh", role: "Lead Developer", bio: "Full-stack engineer, chuyen sau React, Next.js va he thong cloud." },
  { name: "Pham Thu Ha", role: "SEO Manager", bio: "8 nam tu van SEO cho cac thuong hieu lon tai Dong Nam A." },
];

const VALUES = [
  { title: "Chat luong hang dau", desc: "Chung toi khong chap nhan nhung thu trung binh. Moi du an deu duoc dau tu tam huyet va ky luong." },
  { title: "Minh bach & Tin tuong", desc: "Quy trinh lam viec ro rang, bao cao tien do thuong xuyen, khong phat sinh chi phi an." },
  { title: "Doi moi lien tuc", desc: "Luon cap nhat cong nghe moi nhat, dam bao san pham ban nhan duoc la giai phap tien tien nhat." },
];

export default function AboutPage() {
  return (
    <>
      <JsonLdScript data={buildOrganizationJsonLd()} />
      <Breadcrumbs items={[{ label: "Ve chung toi", href: "/about" }]} />

      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-[var(--color-accent)]/30 to-transparent">
        <div className="container-narrow text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Chung toi la <span className="text-[var(--color-primary)]">YourBrand</span>
          </h1>
          <p className="mt-6 text-lg text-[var(--color-muted-foreground)] leading-relaxed">
            Thanh lap nam 2018, YourBrand la cong ty thiet ke va phat trien website chuyen nghiep voi doi ngu hon 15 chuyen gia. Chung toi da giup hon 500 doanh nghiep tu khap noi tren the gioi xay dung su hien dien truc tuyen manh me.
          </p>
          <p className="mt-4 text-lg text-[var(--color-muted-foreground)] leading-relaxed">
            Su menh cua chung toi la giup moi doanh nghiep Viet Nam co the canh tranh binh dang tren san choi quoc te thong qua cong nghe va thiet ke dang cap.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-[var(--color-muted)]">
        <div className="container-wide">
          <h2 className="text-3xl font-bold text-center mb-10">Gia tri cot loi</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <div key={i} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                <h3 className="font-semibold text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="section-padding bg-[var(--color-background)]">
        <div className="container-wide">
          <h2 className="text-3xl font-bold text-center mb-10">Doi ngu cua chung toi</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member, i) => (
              <div key={i} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] font-bold text-xl">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-[var(--color-primary)] mb-2">{member.role}</p>
                <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        title="Hay cung nhau xay dung dieu gi tuyet voi"
        description="Chung toi luon san sang lang nghe va dong hanh cung ban tren hanh trinh so hoa."
      />
    </>
  );
}
