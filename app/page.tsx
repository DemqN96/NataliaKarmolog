import Link from "next/link";
import PhotoCard from "@/components/PhotoCard";
import FadeIn from "@/components/FadeIn";
import GoldParticles from "@/components/GoldParticles";
import FeatureCards from "@/components/FeatureCards";

const PAYMENT_URL =
  "https://secure.wayforpay.com/payment/sdf85981b9e62?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQPOTM2NjE5NzQzMzkyNDU5AAGnlZxmORhJR3MGoc36sFiIv8O_Mz1CV2qzCNgFV_CFUkw8M-ZIY3QHSiEwGI4_aem_MC1ptsSCKkq7GHuXuDyKUw";

export default function LandingPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#0f0d0a", color: "#f5f0e8" }}>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Gold glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 65% 40%, rgba(201,168,76,0.12) 0%, transparent 65%)" }} />
        {/* Particles */}
        <GoldParticles />

        <div className="max-w-6xl mx-auto px-6 py-20 w-full flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Text */}
          <div className="flex-1 text-center md:text-left relative z-10 order-2 md:order-1">
            <FadeIn delay={0.1} direction="up">
              <p className="text-sm uppercase tracking-[0.3em] mb-5" style={{ color: "#c9a84c", fontFamily: "var(--font-inter)" }}>
                Онлайн-курс
              </p>
            </FadeIn>

            <FadeIn delay={0.25} direction="up">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-5 leading-[1.05]"
                style={{ fontFamily: "var(--font-playfair)" }}>
                Стан<br />
                <span style={{
                  color: "#c9a84c",
                  textShadow: "0 0 60px rgba(201,168,76,0.3)"
                }}>
                  Достатку
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.4} direction="up">
              <p className="text-xl mb-2" style={{ color: "#c9b880", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>
                Курс Наталії Войтович
              </p>
              <p className="text-sm mb-10" style={{ color: "#7a6a60", fontFamily: "var(--font-inter)" }}>
                Кармолог · Психосоматолог (ГНМ) · Регресолог · Гіпнотерапевт
              </p>
            </FadeIn>

            <FadeIn delay={0.55} direction="up">
              <a href={PAYMENT_URL} target="_blank" rel="noopener noreferrer">
                <button className="btn-gold text-lg px-10 py-4 w-full md:w-auto">
                  Придбати курс →
                </button>
              </a>
              <p className="text-sm mt-4" style={{ color: "#5a4a40" }}>
                Вже оплатили?{" "}
                <Link href="/login" style={{ color: "#c9a84c" }} className="hover:underline">
                  Увійти до навчання
                </Link>
              </p>
            </FadeIn>
          </div>

          {/* Hero photo */}
          <FadeIn delay={0.3} direction="left" className="relative flex-shrink-0 order-1 md:order-2">
            <div className="absolute -inset-4 rounded-3xl opacity-20"
              style={{ background: "radial-gradient(circle, #c9a84c, transparent 70%)" }} />
            <PhotoCard
              src="/natalia-1.jpg"
              alt="Наталія Войтович"
              className="w-64 h-80 md:w-80 md:h-[30rem] rounded-2xl relative z-10"
              style={{ border: "1px solid rgba(201,168,76,0.3)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
            />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl -z-0"
              style={{ backgroundColor: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }} />
          </FadeIn>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Photos collage */}
          <FadeIn direction="right">
            <div className="flex gap-4" style={{ height: "24rem" }}>
              <PhotoCard src="/natalia-2.jpg" alt="Наталія Войтович"
                className="flex-1 rounded-2xl w-full h-full"
                style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.4)" }} />
              <PhotoCard src="/natalia-3.jpg" alt="Наталія Войтович"
                className="flex-1 rounded-2xl w-full h-full mt-10"
                style={{ objectPosition: "center", boxShadow: "0 10px 40px rgba(0,0,0,0.4)" }} />
            </div>
          </FadeIn>

          {/* Text */}
          <FadeIn direction="left" delay={0.15}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: "#c9a84c", fontFamily: "var(--font-playfair)" }}>
              Про ментора
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: "#d4c9b8" }}>
              Мене звати <strong style={{ color: "#f5f0e8" }}>Войтович Наталія</strong> — кармолог,
              психосомалотолог (наукова психосоматика ГНМ), регресолог, гіпнотерапевт, духовний
              наставник та ментор особистісного зростання.
            </p>
            <p className="text-base leading-relaxed mb-4" style={{ color: "#a09080" }}>
              Я допомагаю людям відчути опору на себе, віднайти контакт з собою та створити
              життя, яке ви прагнете — через різні методи роботи із свідомим та безсвідомим
              і, звісно, за допомогою її величності — карми.
            </p>
            <p className="text-base leading-relaxed" style={{ color: "#a09080" }}>
              На цьому курсі ми багато будемо говорити про безсвідомі процеси та карму. АЛЕ,
              не менш важливими будуть реальні дії — адже я за{" "}
              <strong style={{ color: "#c9a84c" }}>РЕЗУЛЬТАТ!</strong>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, #c9a84c40, transparent)" }} />
      </div>

      {/* ── FEATURES ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <FadeIn direction="up">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: "#c9a84c", fontFamily: "var(--font-playfair)" }}>
            Що вас чекає на курсі
          </h2>
        </FadeIn>

        <FeatureCards />
      </section>

      {/* ── CTA ── */}
      <section className="px-4 pb-20">
        <FadeIn direction="up">
          <div
            className="max-w-4xl mx-auto rounded-3xl px-8 py-14 text-center relative overflow-hidden"
            style={{ backgroundColor: "#1a1612", border: "1px solid rgba(201,168,76,0.2)" }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at center, rgba(201,168,76,0.06), transparent 70%)" }} />
            <GoldParticles />
            <p className="text-sm uppercase tracking-[0.25em] mb-4 relative" style={{ color: "#c9a84c" }}>
              Почніть вже сьогодні
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-5 relative" style={{ fontFamily: "var(--font-playfair)" }}>
              Готові змінити своє життя?
            </h2>
            <p className="text-base mb-10 relative max-w-xl mx-auto" style={{ color: "#a09080" }}>
              Приєднуйтесь до курсу «Стан Достатку» і почніть свій шлях до фінансової свободи та внутрішньої гармонії
            </p>
            <a href={PAYMENT_URL} target="_blank" rel="noopener noreferrer" className="relative">
              <button className="btn-gold text-lg px-14 py-4">
                Придбати курс →
              </button>
            </a>
            <p className="text-sm mt-5 relative" style={{ color: "#5a4a40" }}>
              Вже оплатили?{" "}
              <Link href="/login" style={{ color: "#c9a84c" }} className="hover:underline">
                Увійти до навчання
              </Link>
            </p>
          </div>
        </FadeIn>
      </section>

    </main>
  );
}
