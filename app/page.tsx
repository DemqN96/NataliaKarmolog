import Link from "next/link";
import PhotoCard from "@/components/PhotoCard";

const PAYMENT_URL =
  "https://secure.wayforpay.com/payment/sdf85981b9e62?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQPOTM2NjE5NzQzMzkyNDU5AAGnlZxmORhJR3MGoc36sFiIv8O_Mz1CV2qzCNgFV_CFUkw8M-ZIY3QHSiEwGI4_aem_MC1ptsSCKkq7GHuXuDyKUw";

export default function LandingPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#0f0d0a", color: "#f5f0e8" }}>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 65% 40%, #c9a84c 0%, transparent 65%)" }}
        />
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10 md:gap-16">

          {/* Text */}
          <div className="flex-1 text-center md:text-left relative z-10 order-2 md:order-1">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: "#c9a84c" }}>
              Онлайн-курс
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-5 leading-tight">
              Стан<br />
              <span style={{ color: "#c9a84c" }}>Достатку</span>
            </h1>
            <p className="text-lg md:text-xl mb-2" style={{ color: "#c9b880" }}>
              Курс Наталії Войтович
            </p>
            <p className="text-sm md:text-base mb-8" style={{ color: "#7a6a60" }}>
              Кармолог · Психосоматолог (ГНМ) · Регресолог<br className="hidden md:block" />
              Гіпнотерапевт · Духовний наставник
            </p>

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
          </div>

          {/* Hero photo */}
          <div className="relative flex-shrink-0 order-1 md:order-2">
            <PhotoCard
              src="/natalia-1.jpg"
              alt="Наталія Войтович"
              className="w-64 h-80 md:w-80 md:h-[28rem] rounded-2xl"
              style={{ border: "1px solid #c9a84c30" }}
            />
            <div
              className="absolute -bottom-3 -right-3 w-20 h-20 rounded-xl -z-10"
              style={{ backgroundColor: "#c9a84c15", border: "1px solid #c9a84c30" }}
            />
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Photos collage */}
          <div className="flex gap-3" style={{ height: "22rem" }}>
            <PhotoCard
              src="/natalia-2.jpg"
              alt="Наталія Войтович"
              className="flex-1 rounded-2xl w-full h-full"
            />
            <PhotoCard
              src="/natalia-3.jpg"
              alt="Наталія Войтович"
              className="flex-1 rounded-2xl w-full h-full mt-8"
              style={{ objectPosition: "center" }}
            />
          </div>

          {/* Text */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-5" style={{ color: "#c9a84c" }}>
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
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: "#c9a84c" }}>
          Що вас чекає на курсі
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: "🔓", title: "Відео по днях", desc: "Уроки відкриваються поступово — кожен день новий матеріал для глибокої інтеграції" },
            { icon: "🎯", title: "Практичні інструменти", desc: "Не тільки теорія — конкретні техніки та практики для реальної трансформації" },
            { icon: "✨", title: "Карма та психосоматика", desc: "Унікальне поєднання кармології та наукової психосоматики ГНМ" },
            { icon: "🧠", title: "Робота з безсвідомим", desc: "Глибинна робота з підсвідомими блоками, які заважають достатку" },
            { icon: "💰", title: "Фінансова карма", desc: "Розберемо фінансові програми, які передаються через покоління" },
            { icon: "🌟", title: "Особистісне зростання", desc: "Комплексний підхід до створення життя достатку та гармонії" },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl p-6"
              style={{ backgroundColor: "#1a1612", border: "1px solid #2a2420" }}
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-bold mb-2 text-base" style={{ color: "#f5f0e8" }}>{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#7a6a60" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BOTTOM ── */}
      <section
        className="mx-4 md:mx-auto max-w-4xl my-16 rounded-2xl px-8 py-12 text-center relative overflow-hidden"
        style={{ backgroundColor: "#1a1612", border: "1px solid #3a2e10" }}
      >
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, #c9a84c, transparent 70%)" }}
        />
        <p className="text-sm uppercase tracking-widest mb-3 relative" style={{ color: "#c9a84c" }}>
          Почніть вже сьогодні
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 relative">
          Готові змінити своє життя?
        </h2>
        <p className="text-base mb-8 relative max-w-xl mx-auto" style={{ color: "#a09080" }}>
          Приєднуйтесь до курсу «Стан Достатку» і почніть свій шлях до фінансової свободи та внутрішньої гармонії
        </p>
        <a href={PAYMENT_URL} target="_blank" rel="noopener noreferrer">
          <button className="btn-gold text-lg px-12 py-4 relative">
            Придбати курс →
          </button>
        </a>
        <p className="text-sm mt-4 relative" style={{ color: "#5a4a40" }}>
          Вже оплатили?{" "}
          <Link href="/login" style={{ color: "#c9a84c" }} className="hover:underline">
            Увійти до навчання
          </Link>
        </p>
      </section>

    </main>
  );
}
