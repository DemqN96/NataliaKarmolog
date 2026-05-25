import Link from "next/link";
import PhotoCard from "@/components/PhotoCard";
import FadeIn from "@/components/FadeIn";
import GoldParticles from "@/components/GoldParticles";
import FeatureCards from "@/components/FeatureCards";
import ProgramSection from "@/components/ProgramSection";
import FaqSection from "@/components/FaqSection";
import CountUpBadge from "@/components/CountUp";
import Testimonials from "@/components/Testimonials";

const PAYMENT_URL =
  "https://secure.wayforpay.com/payment/sdf85981b9e62?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQPOTM2NjE5NzQzMzkyNDU5AAGnlZxmORhJR3MGoc36sFiIv8O_Mz1CV2qzCNgFV_CFUkw8M-ZIY3QHSiEwGI4_aem_MC1ptsSCKkq7GHuXuDyKUw";

export default function LandingPage() {
  return (
    <main style={{ backgroundColor: "#0f0d0a", color: "#f5f0e8" }}>

      {/* ━━━━━━━━━━━━ HEADER ━━━━━━━━━━━━ */}
      <header className="sticky top-0 z-50 flex justify-end px-6 py-4 pointer-events-none">
        <a href="https://www.instagram.com/nataliia_karmolog/"
           target="_blank" rel="noopener noreferrer"
           className="pointer-events-auto w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
           style={{ backgroundColor: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="1" fill="#c9a84c" stroke="none"/>
          </svg>
        </a>
      </header>

      {/* ━━━━━━━━━━━━ 1. HERO ━━━━━━━━━━━━ */}
      <section className="relative overflow-hidden min-h-screen flex items-center" style={{ marginTop: "-3.5rem" }}>
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
                Цей курс не лише про гроші. Це про те, як{" "}
                <span style={{ color: "#f5f0e8" }}>ЖИТИ в стані достатку</span> —
                через мислення, внутрішній стан, підсвідомі сценарії та родові
                програми, які визначають твій фінансовий результат
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
                src="/natalia-cover.jpg"
                alt="Наталія Войтович"
                className="relative w-72 h-[26rem] md:w-80 md:h-[32rem] rounded-3xl"
                style={{ border: "1px solid rgba(201,168,76,0.25)", boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}
              />
              {/* Badge */}
              <CountUpBadge target={1000} suffix="+" label="Задоволених клієнтів" />
            </div>
          </FadeIn>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ━━━━━━━━━━━━ 2. ДЛЯ КОГО ━━━━━━━━━━━━ */}
      <section className="py-24" style={{ backgroundColor: "#13110e" }}>
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-4xl font-bold text-center mb-4"
              style={{ fontFamily: "var(--font-playfair)", color: "#f5f0e8" }}>
              Цей курс для тебе, якщо…
            </h2>
            <p className="text-center mb-12" style={{ color: "#6a5a50" }}>
              Ти відчуваєш, що гроші є, але щось постійно заважає виходити на новий рівень
            </p>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Ти в стані постійної нестачі або фінансових гойдалок",
              "Несвідомо зливаєш енергію та гроші, не розуміючи як",
              "Не розумієш, що саме тобі заважає рости в доході",
              "Є борги або кредити, які здаються нескінченними",
              "Хочеш сформувати внутрішню опору та фінансову зрілість",
              "Відчуваєш, що внутрішні заборони роками блокують твій достаток",
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
              Що ти отримаєш
            </h2>
            <p className="text-center mb-12" style={{ color: "#6a5a50" }}>
              Достаток — це внутрішній стан і система мислення, яку можна сформувати
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
              Це навчання допоможе тобі
            </h2>
            <p className="text-center mb-12" style={{ color: "#6a5a50" }}>
              Реальні зміни, які відчуєш ти і твій гаманець
            </p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { num: "01", text: "Вийти зі стану постійної нестачі або фінансових гойдалок" },
              { num: "02", text: "Перестати несвідомо зливати енергію та гроші" },
              { num: "03", text: "Зрозуміти, які в тебе стосунки з грошима і що заважає рости в доході" },
              { num: "04", text: "Сформувати внутрішню опору та фінансову зрілість" },
              { num: "05", text: "Навчитися створювати достаток і утримувати його в своєму житті" },
              { num: "06", text: "Побачити установки і заборони, що роками непомітно блокували твій достаток" },
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

      <hr className="section-divider" />

      {/* ━━━━━━━━━━━━ 7. ВІДГУКИ ━━━━━━━━━━━━ */}
      <Testimonials />

      <hr className="section-divider" />

      {/* ━━━━━━━━━━━━ 8. ЦІНА ━━━━━━━━━━━━ */}
      <section className="py-24" style={{ backgroundColor: "#13110e" }}>
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-4xl font-bold text-center mb-3"
              style={{ fontFamily: "var(--font-playfair)", color: "#f5f0e8" }}>
              Оберіть свій тариф
            </h2>
            <p className="text-center mb-14" style={{ color: "#6a5a50" }}>
              Одноразова оплата — доступ назавжди
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 items-start">

            {/* ── Тариф Самостійний ── */}
            <FadeIn delay={0.1}>
              <div className="rounded-3xl p-8 relative overflow-hidden h-full flex flex-col"
                style={{ backgroundColor: "#1a1612", border: "1px solid #2a2420" }}>
                <div className="inline-block px-3 py-1 rounded-full text-xs uppercase tracking-widest mb-6 self-start"
                  style={{ backgroundColor: "#1e1a16", border: "1px solid #3a3420", color: "#7a6a60" }}>
                  Самостійний
                </div>
                <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
                  Стан Достатку
                </h3>
                <p className="text-sm mb-6" style={{ color: "#6a5a50" }}>Самостійне проходження</p>

                <div className="mb-8">
                  <span className="text-4xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#f5f0e8" }}>
                    7 000
                  </span>
                  <span className="text-lg ml-1" style={{ color: "#6a5a50" }}>грн</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    "Всі уроки та матеріали (13 блоків)",
                    "Закритий кабінет з відео",
                    "Нотатник з автозбереженням",
                    "Сертифікат після завершення",
                    "Доступ назавжди",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <svg className="flex-shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6a5a50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span className="text-sm" style={{ color: "#a09080" }}>{item}</span>
                    </li>
                  ))}
                </ul>

                <a href={PAYMENT_URL} target="_blank" rel="noopener noreferrer">
                  <button className="w-full py-4 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                    style={{ backgroundColor: "#201a0a", border: "1px solid rgba(201,168,76,0.3)", color: "#c9a84c" }}>
                    Придбати →
                  </button>
                </a>
              </div>
            </FadeIn>

            {/* ── Тариф PLUS ── */}
            <FadeIn delay={0.2}>
              <div className="rounded-3xl p-8 relative overflow-hidden h-full flex flex-col"
                style={{
                  backgroundColor: "#1e1a0e",
                  border: "1px solid rgba(201,168,76,0.4)",
                  boxShadow: "0 0 60px rgba(201,168,76,0.08), 0 24px 50px rgba(0,0,0,0.5)",
                }}>
                {/* Glow */}
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(201,168,76,0.18), transparent 70%)" }} />

                <div className="relative">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="inline-block px-3 py-1 rounded-full text-xs uppercase tracking-widest"
                      style={{ backgroundColor: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.35)", color: "#c9a84c" }}>
                      PLUS
                    </div>
                    <div className="inline-block px-2 py-1 rounded-full text-[10px] uppercase tracking-wider"
                      style={{ backgroundColor: "rgba(201,168,76,0.08)", color: "#c9a84c" }}>
                      ✦ Рекомендований
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
                    Стан Достатку
                  </h3>
                  <p className="text-sm mb-6" style={{ color: "#6a5a50" }}>З підтримкою та спільнотою</p>

                  <div className="mb-8">
                    <span className="text-4xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#c9a84c" }}>
                      11 000
                    </span>
                    <span className="text-lg ml-1" style={{ color: "#6a5a50" }}>грн</span>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {[
                      { text: "Всі уроки та матеріали (13 блоків)", plus: false },
                      { text: "Закритий кабінет з відео", plus: false },
                      { text: "Нотатник з автозбереженням", plus: false },
                      { text: "Сертифікат після завершення", plus: false },
                      { text: "Доступ назавжди", plus: false },
                      { text: "Жива online зустріч — мастермайнд", plus: true },
                      { text: "Чат з учасниками курсу", plus: true },
                      { text: "Відповіді на питання особисто від Наталії", plus: true },
                    ].map((item) => (
                      <li key={item.text} className="flex items-start gap-3">
                        <svg className="flex-shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none"
                          stroke={item.plus ? "#c9a84c" : "#6a5a50"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        <span className="text-sm" style={{ color: item.plus ? "#f5f0e8" : "#a09080" }}>
                          {item.plus && <span style={{ color: "#c9a84c" }}>+</span>} {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <a href={PAYMENT_URL} target="_blank" rel="noopener noreferrer">
                    <button className="btn-gold w-full text-base py-4">
                      Придбати PLUS →
                    </button>
                  </a>
                  <p className="text-xs mt-3 text-center" style={{ color: "#3a2a20" }}>
                    Безпечна оплата · Миттєвий доступ після підтвердження
                  </p>
                </div>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ━━━━━━━━━━━━ 9. CTA ━━━━━━━━━━━━ */}
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
            Ти побачиш ті установки і внутрішні заборони, які роками блокували твій достаток.
            І зможеш змінити їх на нову, підтримуючу систему мислення
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
          <FaqSection />
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
