import Link from "next/link";
import PhotoCard from "@/components/PhotoCard";
import FadeIn from "@/components/FadeIn";
import GoldParticles from "@/components/GoldParticles";
import FeatureCards from "@/components/FeatureCards";
import ProgramSection from "@/components/ProgramSection";

const PAYMENT_URL =
  "https://secure.wayforpay.com/payment/sdf85981b9e62?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQPOTM2NjE5NzQzMzkyNDU5AAGnlZxmORhJR3MGoc36sFiIv8O_Mz1CV2qzCNgFV_CFUkw8M-ZIY3QHSiEwGI4_aem_MC1ptsSCKkq7GHuXuDyKUw";

export default function LandingPage() {
  return (
    <main style={{ backgroundColor: "#0f0d0a", color: "#f5f0e8" }}>

      {/* ━━━━━━━━━━━━ 1. HERO ━━━━━━━━━━━━ */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 70% 40%, rgba(201,168,76,0.13) 0%, transparent 60%)" }} />
        <GoldParticles />

        <div className="max-w-6xl mx-auto px-6 py-24 w-full grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <FadeIn delay={0.1}>
              <span className="inline-block text-xs uppercase tracking-[0.3em] px-4 py-1.5 rounded-full mb-6"
                style={{ color: "#c9a84c", border: "1px solid rgba(201,168,76,0.3)", backgroundColor: "rgba(201,168,76,0.07)" }}>
                Онлайн-курс
              </span>
            </FadeIn>
            <FadeIn delay={0.2}>
              <h1 className="font-bold leading-[1.05] mb-5"
                style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(3rem, 7vw, 5.5rem)" }}>
                Стан<br />
                <span style={{ color: "#c9a84c", textShadow: "0 0 80px rgba(201,168,76,0.25)" }}>
                  Достатку
                </span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: "#a09080" }}>
                Онлайн-курс, який допоможе вам зняти внутрішні блоки,
                перепрограмувати фінансове мислення та увійти в стан,
                де гроші приходять легко
              </p>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href={PAYMENT_URL} target="_blank" rel="noopener noreferrer">
                  <button className="btn-gold text-base px-8 py-4 w-full sm:w-auto">
                    Придбати курс →
                  </button>
                </a>
                <a href="#program">
                  <button className="text-sm px-8 py-4 rounded-lg w-full sm:w-auto transition-all hover:border-yellow-600"
                    style={{ border: "1px solid #3a3420", color: "#a09080" }}>
                    Програма курсу
                  </button>
                </a>
              </div>
              <p className="text-sm mt-4" style={{ color: "#4a3a30" }}>
                Вже оплатили?{" "}
                <Link href="/login" style={{ color: "#c9a84c" }} className="hover:underline">
                  Увійти до навчання
                </Link>
              </p>
            </FadeIn>
          </div>

          <FadeIn delay={0.25} direction="left" className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-6 rounded-3xl opacity-25 blur-2xl"
                style={{ background: "radial-gradient(circle, #c9a84c, transparent 70%)" }} />
              <PhotoCard
                src="/natalia-1.jpg"
                alt="Наталія Войтович"
                className="relative w-72 h-[26rem] md:w-80 md:h-[32rem] rounded-3xl"
                style={{ border: "1px solid rgba(201,168,76,0.25)", boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}
              />
              {/* Badge */}
              <div className="absolute -bottom-4 -left-4 rounded-2xl px-5 py-3"
                style={{ backgroundColor: "#1a1612", border: "1px solid rgba(201,168,76,0.3)", boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}>
                <p className="text-xs mb-0.5" style={{ color: "#7a6a60" }}>Учасників курсу</p>
                <p className="text-2xl font-bold" style={{ color: "#c9a84c", fontFamily: "var(--font-playfair)" }}>500+</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ━━━━━━━━━━━━ 2. ДЛЯ КОГО ━━━━━━━━━━━━ */}
      <section className="py-24" style={{ backgroundColor: "#13110e" }}>
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-4xl font-bold text-center mb-4"
              style={{ fontFamily: "var(--font-playfair)", color: "#f5f0e8" }}>
              Цей курс для вас, якщо…
            </h2>
            <p className="text-center mb-12" style={{ color: "#6a5a50" }}>
              Ви відчуваєте, що щось заважає вам жити в достатку
            </p>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Ви багато працюєте, але грошей завжди «якраз» або не вистачає",
              "Відчуваєте провину або сором, коли думаєте про великі гроші",
              "Хочете змін, але страх і невпевненість зупиняють",
              "Відчуваєте, що «не заслуговуєте» на краще життя",
              "Маєте мрії, але не знаєте, як зробити перший крок",
              "Відчуваєте, що вже все пробували, але нічого не змінюється",
            ].map((text, i) => (
              <FadeIn key={i} delay={i * 0.07}>
                <div className="flex items-start gap-4 rounded-xl p-5"
                  style={{ backgroundColor: "#1a1612", border: "1px solid #2a2420" }}>
                  <span className="text-xl mt-0.5 flex-shrink-0" style={{ color: "#c9a84c" }}>✦</span>
                  <p className="text-sm leading-relaxed" style={{ color: "#c9b8a8" }}>{text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━ 3. ЩО ВИ ОТРИМАЄТЕ ━━━━━━━━━━━━ */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-4xl font-bold text-center mb-4"
              style={{ fontFamily: "var(--font-playfair)", color: "#f5f0e8" }}>
              Що ви отримаєте
            </h2>
            <p className="text-center mb-12" style={{ color: "#6a5a50" }}>
              Чотири напрямки трансформації, які змінять ваше ставлення до грошей
            </p>
          </FadeIn>
          <FeatureCards />
        </div>
      </section>

      {/* ━━━━━━━━━━━━ 4. ПРОГРАМА ━━━━━━━━━━━━ */}
      <section id="program" className="py-24" style={{ backgroundColor: "#13110e" }}>
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-4xl font-bold text-center mb-4"
              style={{ fontFamily: "var(--font-playfair)", color: "#f5f0e8" }}>
              Програма курсу
            </h2>
            <p className="text-center mb-12" style={{ color: "#6a5a50" }}>
              Покроковий шлях від внутрішніх блоків до стану достатку
            </p>
          </FadeIn>
          <ProgramSection />
        </div>
      </section>

      {/* ━━━━━━━━━━━━ 5. МЕНТОР ━━━━━━━━━━━━ */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <FadeIn direction="right">
              <div className="relative flex justify-center">
                <div className="absolute -inset-6 rounded-3xl opacity-20 blur-2xl"
                  style={{ background: "radial-gradient(circle, #c9a84c, transparent 70%)" }} />
                <PhotoCard
                  src="/natalia-2.jpg"
                  alt="Наталія Войтович"
                  className="relative rounded-3xl w-72 h-[32rem] md:w-80 md:h-[36rem]"
                  style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.6)", border: "1px solid rgba(201,168,76,0.2)" }}
                />
              </div>
            </FadeIn>
            <FadeIn direction="left" delay={0.15}>
              <p className="text-sm uppercase tracking-widest mb-3" style={{ color: "#c9a84c" }}>Ваш ментор</p>
              <h2 className="text-4xl font-bold mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                Войтович Наталія
              </h2>
              <p className="text-sm mb-6" style={{ color: "#7a6a60" }}>
                Кармолог · Психосоматолог (ГНМ) · Регресолог · Гіпнотерапевт
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Понад 5 років практики в кармології та психосоматиці",
                  "Більше 500 людей пройшли особисту трансформацію під моїм керівництвом",
                  "Авторська методика поєднання карми та наукової психосоматики ГНМ",
                  "Спеціалізація: фінансові блоки, стосунки, здоров'я",
                ].map((text, i) => (
                  <div key={i} className="flex gap-3">
                    <span style={{ color: "#c9a84c" }} className="flex-shrink-0 mt-1">✓</span>
                    <p className="text-sm leading-relaxed" style={{ color: "#a09080" }}>{text}</p>
                  </div>
                ))}
              </div>
              <blockquote className="rounded-2xl p-5 italic text-sm leading-relaxed"
                style={{ backgroundColor: "#1a1612", borderLeft: "3px solid #c9a84c", color: "#c9b8a8" }}>
                «Я допомагаю людям відчути опору на себе, віднайти контакт з собою та
                створити життя, яке вони прагнуть — через роботу із свідомим та
                безсвідомим. Адже я за РЕЗУЛЬТАТ!»
              </blockquote>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━ 6. РЕЗУЛЬТАТИ ━━━━━━━━━━━━ */}
      <section className="py-24" style={{ backgroundColor: "#13110e" }}>
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-4xl font-bold text-center mb-4"
              style={{ fontFamily: "var(--font-playfair)", color: "#f5f0e8" }}>
              Після курсу ви
            </h2>
            <p className="text-center mb-12" style={{ color: "#6a5a50" }}>
              Реальні зміни, які відчують ваше тіло і гаманець
            </p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { num: "01", text: "Знайдете і розберете кореневі причини фінансових блоків" },
              { num: "02", text: "Позбудетеся почуття провини та сорому навколо грошей" },
              { num: "03", text: "Сформуєте нові грошові переконання та патерни поведінки" },
              { num: "04", text: "Відчуєте внутрішній стан достатку незалежно від суми на рахунку" },
              { num: "05", text: "Отримаєте практичні інструменти для щоденної роботи з підсвідомим" },
              { num: "06", text: "Побудуєте нові стосунки з грошима, засновані на довірі та легкості" },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.07}>
                <div className="rounded-2xl p-6 h-full"
                  style={{ backgroundColor: "#1a1612", border: "1px solid #2a2420" }}>
                  <p className="text-3xl font-bold mb-3" style={{ color: "rgba(201,168,76,0.3)", fontFamily: "var(--font-playfair)" }}>
                    {item.num}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "#c9b8a8" }}>{item.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━ 7. CTA ━━━━━━━━━━━━ */}
      <section className="py-24 relative overflow-hidden">
        <GoldParticles />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(201,168,76,0.08), transparent 65%)" }} />
        <FadeIn className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <p className="text-sm uppercase tracking-[0.25em] mb-4" style={{ color: "#c9a84c" }}>
            Обмежена кількість місць
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-5"
            style={{ fontFamily: "var(--font-playfair)" }}>
            Готові змінити<br />своє життя?
          </h2>
          <p className="text-base mb-10 max-w-xl mx-auto" style={{ color: "#7a6a60" }}>
            Приєднуйтесь до курсу «Стан Достатку» і почніть свій шлях до
            фінансової свободи та внутрішньої гармонії вже сьогодні
          </p>
          <a href={PAYMENT_URL} target="_blank" rel="noopener noreferrer">
            <button className="btn-gold text-lg px-14 py-5">
              Придбати курс →
            </button>
          </a>
          <p className="text-sm mt-5" style={{ color: "#4a3a30" }}>
            Вже оплатили?{" "}
            <Link href="/login" style={{ color: "#c9a84c" }} className="hover:underline">
              Увійти до навчання
            </Link>
          </p>
        </FadeIn>
      </section>

      {/* ━━━━━━━━━━━━ 8. FAQ ━━━━━━━━━━━━ */}
      <section className="py-24" style={{ backgroundColor: "#13110e" }}>
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-4xl font-bold text-center mb-12"
              style={{ fontFamily: "var(--font-playfair)", color: "#f5f0e8" }}>
              Часті запитання
            </h2>
          </FadeIn>
          <div className="space-y-3">
            {[
              { q: "Скільки часу потрібно на курс?", a: "Кожен урок займає 20-40 хвилин. Нові уроки відкриваються щодня, тому ви рухаєтесь у власному темпі без поспіху." },
              { q: "Чи підходить курс, якщо я нічого не знаю про кармологію?", a: "Так, курс розроблений з нуля. Наталія пояснює все простою мовою без езотерики — тільки практичні інструменти." },
              { q: "На скільки днів розрахований курс?", a: "Курс включає декілька блоків з уроками. Кожен урок відкривається у визначений день після початку навчання." },
              { q: "Що якщо я пропущу день?", a: "Нічого страшного — уроки зберігаються і доступні для перегляду в будь-який час після відкриття." },
              { q: "Як отримати доступ після оплати?", a: "Після оплати напишіть нам, ми надамо вам email та пароль для входу на платформу протягом кількох годин." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <details className="rounded-2xl group"
                  style={{ backgroundColor: "#1a1612", border: "1px solid #2a2420" }}>
                  <summary className="flex justify-between items-center p-5 cursor-pointer list-none">
                    <span className="font-medium text-sm pr-4" style={{ color: "#f5f0e8" }}>{item.q}</span>
                    <span className="text-lg flex-shrink-0 transition-transform group-open:rotate-45"
                      style={{ color: "#c9a84c" }}>+</span>
                  </summary>
                  <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: "#7a6a60" }}>{item.a}</p>
                </details>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━ FOOTER ━━━━━━━━━━━━ */}
      <footer className="py-8 text-center" style={{ borderTop: "1px solid #1e1a16" }}>
        <p className="text-sm" style={{ color: "#3a2a20" }}>
          © 2026 Войтович Наталія · Курс «Стан Достатку»
        </p>
      </footer>

    </main>
  );
}
