export const questions = [
  {
    question: "در برابر فشار و تحریم‌های خارجی چه واکنشی نشان می‌دهید؟",
    options: [
      {
        text: "مقاومت و استقامت در برابر تحریم‌ها",
        traits: { nationalist: 3, authoritarian: 2, resistant: 3 },
      },
      {
        text: "گفتگو و مذاکره برای رفع تحریم‌ها",
        traits: { diplomatic: 3, pragmatic: 2, moderate: 2 },
      },
      {
        text: "خودکفایی و تکیه بر منابع داخلی",
        traits: { autarkic: 3, nationalist: 2, pragmatic: 1 },
      },
      {
        text: "تسلیم و پذیرش خواسته‌های طرف مقابل",
        traits: { submissive: 3, pragmatic: 1, peaceful: 2 },
      },
    ],
  },
  {
    question: "استقلال سیاسی مهم‌تر است یا اتحادهای بین‌المللی؟",
    options: [
      {
        text: "استقلال کامل و عدم وابستگی",
        traits: { nationalist: 3, independent: 3, isolationist: 2 },
      },
      {
        text: "اتحادهای استراتژیک با حفظ استقلال",
        traits: { strategic: 3, pragmatic: 2, diplomatic: 2 },
      },
      {
        text: "عضویت فعال در سازمان‌های بین‌المللی",
        traits: { internationalist: 3, liberal: 2, cooperative: 2 },
      },
      {
        text: "پیروی از قدرت‌های بزرگ",
        traits: { dependent: 3, pragmatic: 1, submissive: 2 },
      },
    ],
  },
  {
    question: "سیاست شما درباره رسانه‌ها و آزادی بیان چیست؟",
    options: [
      {
        text: "آزادی کامل رسانه‌ها",
        traits: { liberal: 3, democratic: 3, tolerant: 2 },
      },
      {
        text: "آزادی نسبی با نظارت محدود",
        traits: { moderate: 3, pragmatic: 2, balanced: 2 },
      },
      {
        text: "کنترل رسانه‌ها برای امنیت ملی",
        traits: { authoritarian: 3, nationalist: 2, controlled: 3 },
      },
      {
        text: "رسانه‌ها باید ابزار تبلیغات دولت باشند",
        traits: { propagandist: 3, authoritarian: 3, controlled: 2 },
      },
    ],
  },
  {
    question: "برای توسعه کشور، بر صنعت تکیه می‌کنید یا کشاورزی یا دانش نوین؟",
    options: [
      {
        text: "توسعه صنعتی و تولید",
        traits: { industrialist: 3, modernist: 2, pragmatic: 2 },
      },
      {
        text: "کشاورزی و خودکفایی غذایی",
        traits: { traditionalist: 3, nationalist: 2, sustainable: 2 },
      },
      {
        text: "اقتصاد دانش‌محور و فناوری",
        traits: { technocratic: 3, modernist: 3, innovative: 3 },
      },
      {
        text: "ترکیب متعادل از همه بخش‌ها",
        traits: { balanced: 3, pragmatic: 3, moderate: 2 },
      },
    ],
  },
  {
    question: "در زمان بحران‌های انتخاباتی یا مردمی چه راهبردی دارید؟",
    options: [
      {
        text: "گفتگو و پاسخگویی به مردم",
        traits: { democratic: 3, transparent: 3, responsive: 2 },
      },
      {
        text: "سرکوب قاطع اغتشاشات",
        traits: { authoritarian: 3, militarist: 2, tough: 3 },
      },
      {
        text: "اصلاحات فوری برای آرام کردن اوضاع",
        traits: { reformist: 3, pragmatic: 2, adaptive: 2 },
      },
      {
        text: "صبر و انتظار تا خود به خود آرام شود",
        traits: { passive: 3, conservative: 2, patient: 2 },
      },
    ],
  },
  {
    question: "نقش دین در سیاست باید چقدر پررنگ باشد؟",
    options: [
      {
        text: "سیاست باید کاملاً سکولار باشد",
        traits: { secular: 3, liberal: 2, modernist: 2 },
      },
      {
        text: "دین راهنمای ارزش‌های اخلاقی سیاست",
        traits: { spiritual: 3, traditional: 2, principled: 2 },
      },
      {
        text: "دولت اسلامی و حاکمیت شریعت",
        traits: { theocratic: 3, traditional: 3, spiritual: 2 },
      },
      {
        text: "استفاده ابزاری از دین برای مشروعیت",
        traits: { pragmatic: 3, manipulative: 2, strategic: 2 },
      },
    ],
  },
  {
    question: "سیاست شما درباره ارتش و قدرت نظامی چیست؟",
    options: [
      {
        text: "ارتش قوی برای دفاع از کشور",
        traits: { militarist: 3, nationalist: 2, defensive: 2 },
      },
      {
        text: "قدرت نظامی برای نفوذ منطقه‌ای",
        traits: { expansionist: 3, militarist: 3, aggressive: 2 },
      },
      {
        text: "کاهش بودجه نظامی و تمرکز بر رفاه",
        traits: { peaceful: 3, liberal: 2, welfare: 3 },
      },
      {
        text: "متناسب با تهدیدات امنیتی",
        traits: { pragmatic: 3, strategic: 2, balanced: 2 },
      },
    ],
  },
  {
    question: "در سیاست اقتصادی، طرفدار دولت‌گرایی هستید یا بازار آزاد؟",
    options: [
      {
        text: "اقتصاد کاملاً دولتی و برنامه‌ریزی متمرکز",
        traits: { socialist: 3, centralized: 3, controlled: 2 },
      },
      {
        text: "بازار آزاد و حداقل دخالت دولت",
        traits: { capitalist: 3, liberal: 3, free_market: 2 },
      },
      {
        text: "اقتصاد مختلط با نقش قوی دولت",
        traits: { mixed_economy: 3, pragmatic: 2, moderate: 2 },
      },
      {
        text: "اقتصاد عدالت‌محور و توزیع ثروت",
        traits: { egalitarian: 3, socialist: 2, redistributive: 3 },
      },
    ],
  },
  {
    question: "در سیاست خارجی، به دیپلماسی نرم باور دارید یا قدرت سخت؟",
    options: [
      {
        text: "دیپلماسی، گفتگو و صلح",
        traits: { diplomatic: 3, peaceful: 3, soft_power: 2 },
      },
      {
        text: "قدرت نظامی و اقتصادی",
        traits: { militarist: 3, hard_power: 3, aggressive: 2 },
      },
      {
        text: "ترکیب دیپلماسی و قدرت",
        traits: { strategic: 3, balanced: 2, pragmatic: 2 },
      },
      {
        text: "انزوا و عدم مداخله",
        traits: { isolationist: 3, defensive: 2, neutral: 2 },
      },
    ],
  },
  {
    question: "درباره حقوق اقلیت‌ها و آزادی‌های مدنی چه نظری دارید؟",
    options: [
      {
        text: "حقوق کامل و برابری همه شهروندان",
        traits: { egalitarian: 3, liberal: 3, tolerant: 3 },
      },
      {
        text: "حقوق محدود در چارچوب فرهنگ غالب",
        traits: { nationalist: 3, traditionalist: 2, restrictive: 2 },
      },
      {
        text: "احترام به تنوع در چارچوب وحدت ملی",
        traits: { pluralist: 3, moderate: 2, inclusive: 2 },
      },
      {
        text: "اولویت با امنیت و نظم عمومی",
        traits: { authoritarian: 3, security_first: 3, restrictive: 2 },
      },
    ],
  },
  {
    question: "برای مقابله با فساد، چه اولویتی قائلید؟",
    options: [
      {
        text: "نهادسازی و شفافیت کامل",
        traits: { transparent: 3, institutional: 3, systematic: 2 },
      },
      {
        text: "برخورد قاطع و مجازات سنگین",
        traits: { tough: 3, authoritarian: 2, punitive: 3 },
      },
      {
        text: "اصلاح تدریجی ساختارها",
        traits: { reformist: 3, gradual: 2, pragmatic: 2 },
      },
      {
        text: "تقویت اخلاق و فرهنگ‌سازی",
        traits: { cultural: 3, educational: 2, moral: 3 },
      },
    ],
  },
  {
    question: "در بحران‌های جهانی (مثل جنگ یا کرونا) چه تصمیمی می‌گیرید؟",
    options: [
      {
        text: "همکاری بین‌المللی و کمک متقابل",
        traits: { cooperative: 3, internationalist: 3, humanitarian: 2 },
      },
      {
        text: "اول منافع ملی، بعد کمک به دیگران",
        traits: { nationalist: 3, pragmatic: 2, self_interest: 3 },
      },
      {
        text: "رهبری جهانی در مقابله با بحران",
        traits: { leadership: 3, ambitious: 2, responsible: 2 },
      },
      {
        text: "انزوا و محافظت از کشور",
        traits: { isolationist: 3, defensive: 3, protective: 2 },
      },
    ],
  },
  {
    question:
      "رابطه شما با قدرت‌های بزرگ (آمریکا، روسیه، چین) چگونه خواهد بود؟",
    options: [
      {
        text: "تعامل سازنده و دوستانه با همه",
        traits: { diplomatic: 3, balanced: 3, cooperative: 2 },
      },
      {
        text: "مقابله و عدم تسلیم در برابر فشارها",
        traits: { resistant: 3, nationalist: 3, confrontational: 2 },
      },
      {
        text: "اتحاد استراتژیک با یکی از آنها",
        traits: { aligned: 3, strategic: 2, dependent: 1 },
      },
      {
        text: "مستقل از همه و غیرمتعهد",
        traits: { independent: 3, neutral: 3, nonaligned: 2 },
      },
    ],
  },
  {
    question: "توسعه علمی و فناوری چه جایگاهی در سیاست شما دارد؟",
    options: [
      {
        text: "اولویت اول و سرمایه‌گذاری گسترده",
        traits: { technocratic: 3, modernist: 3, innovative: 3 },
      },
      {
        text: "مهم اما در چارچوب ارزش‌های سنتی",
        traits: { balanced: 3, traditionalist: 2, cautious: 2 },
      },
      {
        text: "ابزاری برای قدرت و امنیت ملی",
        traits: { strategic: 3, militarist: 2, nationalist: 2 },
      },
      {
        text: "کمتر مهم از مسائل اجتماعی و اقتصادی",
        traits: { populist: 3, practical: 2, basic_needs: 2 },
      },
    ],
  },
  {
    question:
      "آیا پوپولیسم و بسیج مردمی را ترجیح می‌دهید یا تکنوکراسی و مدیریت نخبگان؟",
    options: [
      {
        text: "حکومت مردمی و بسیج توده‌ها",
        traits: { populist: 3, democratic: 2, grassroots: 3 },
      },
      {
        text: "مدیریت علمی و تکنوکراتیک",
        traits: { technocratic: 3, elitist: 2, scientific: 3 },
      },
      {
        text: "ترکیب مشارکت مردم و کارشناسی",
        traits: { balanced: 3, democratic: 2, pragmatic: 2 },
      },
      {
        text: "رهبری نخبگان با حمایت مردم",
        traits: { elitist: 3, paternalistic: 2, guided: 2 },
      },
    ],
  },
  {
    question: "اولویت شما در روابط بین‌الملل چیست؟",
    options: [
      {
        text: "تقویت روابط با همسایگان و منطقه",
        traits: { regionalist: 3, pragmatic: 2, cooperative: 2 },
      },
      {
        text: "همکاری با کشورهای هم‌ایدئولوژی",
        traits: { ideological: 3, principled: 2, aligned: 2 },
      },
      {
        text: "تعامل با همه بر اساس منافع ملی",
        traits: { pragmatic: 3, flexible: 2, strategic: 2 },
      },
      {
        text: "تمرکز بر روابط با قدرت‌های اقتصادی",
        traits: { economic: 3, realist: 2, pragmatic: 1 },
      },
    ],
  },
  {
    question: "نقش زنان در جامعه و سیاست چگونه باشد؟",
    options: [
      {
        text: "برابری کامل در تمام عرصه‌ها",
        traits: { egalitarian: 3, progressive: 3, liberal: 2 },
      },
      {
        text: "توسعه نقش‌ها در چارچوب ارزش‌های سنتی",
        traits: { traditionalist: 2, moderate: 3, cultural: 2 },
      },
      {
        text: "حفظ نقش‌های سنتی و خانوادگی",
        traits: { conservative: 3, traditionalist: 3, religious: 2 },
      },
      {
        text: "سیاست‌های حمایتی ویژه برای توانمندسازی",
        traits: { supportive: 3, reformist: 2, progressive: 2 },
      },
    ],
  },
  {
    question: "سیاست محیط زیستی شما چیست؟",
    options: [
      {
        text: "اولویت رشد اقتصادی بر محیط زیست",
        traits: { developmentalist: 3, industrialist: 2, pragmatic: 2 },
      },
      {
        text: "توسعه پایدار و حفظ محیط زیست",
        traits: { environmentalist: 3, sustainable: 3, balanced: 2 },
      },
      {
        text: "مشارکت در تلاش‌های جهانی برای اقلیم",
        traits: { internationalist: 3, cooperative: 2, responsible: 2 },
      },
      {
        text: "تمرکز بر مشکلات محیطی داخلی",
        traits: { nationalist: 2, pragmatic: 2, internal_focus: 3 },
      },
    ],
  },
  {
    question: "با اپوزیسیون و مخالفان سیاسی چگونه برخورد می‌کنید؟",
    options: [
      {
        text: "مشارکت دادن آنها در فرآیندهای سیاسی",
        traits: { inclusive: 3, democratic: 3, tolerant: 2 },
      },
      {
        text: "محدود کردن فعالیت‌هایشان در چارچوب قانون",
        traits: { legalist: 3, controlled: 2, restrictive: 2 },
      },
      {
        text: "سرکوب کامل و حذف آنها",
        traits: { authoritarian: 3, suppressive: 3, intolerant: 2 },
      },
      {
        text: "گفتگو و مصالحه برای ثبات کشور",
        traits: { diplomatic: 3, compromising: 2, pragmatic: 2 },
      },
    ],
  },
  {
    question: "سیاست شما در قبال مهاجران و پناهندگان چیست؟",
    options: [
      {
        text: "استقبال کنترل‌شده بر اساس نیازهای کشور",
        traits: { pragmatic: 3, managed: 2, selective: 2 },
      },
      {
        text: "میزبانی گسترده و حمایت انسان‌دوستانه",
        traits: { humanitarian: 3, welcoming: 3, compassionate: 2 },
      },
      {
        text: "محدودیت شدید و اولویت به شهروندان",
        traits: { nationalist: 3, restrictive: 3, protective: 2 },
      },
      {
        text: "همکاری بین‌المللی برای حل ریشه‌ای",
        traits: { internationalist: 3, cooperative: 2, strategic: 2 },
      },
    ],
  },
  {
    question: "درباره جهانی‌سازی (Globalization) چه دیدگاهی دارید؟",
    options: [
      {
        text: "ادغام کامل در اقتصاد جهانی",
        traits: { globalist: 3, liberal: 2, open: 3 },
      },
      {
        text: "تعامل انتخابی و محتاطانه",
        traits: { cautious: 3, pragmatic: 2, selective: 2 },
      },
      {
        text: "مقاومت در برابر سیطره فرهنگی-اقتصادی خارجی",
        traits: { resistant: 3, nationalist: 2, protectionist: 3 },
      },
      {
        text: "بهره‌گیری از فرصت‌ها با حفظ هویت",
        traits: { balanced: 3, adaptive: 2, pragmatic: 2 },
      },
    ],
  },
  {
    question: "اولویت نظام آموزشی چیست؟",
    options: [
      {
        text: "پرورش نیروی کار ماهر برای بازار",
        traits: { practical: 3, economic: 2, vocational: 3 },
      },
      {
        text: "توسعه تفکر انتقادی و خلاقیت",
        traits: { progressive: 3, liberal: 2, intellectual: 3 },
      },
      {
        text: "تقویت هویت ملی و ارزش‌های فرهنگی",
        traits: { nationalist: 3, traditionalist: 2, cultural: 3 },
      },
      {
        text: "ترکیبی از علم، مهارت و اخلاق",
        traits: { balanced: 3, holistic: 3, moderate: 2 },
      },
    ],
  },
  {
    question: "در توزیع بودجه بین مناطق مختلف کشور چه معیاری دارید؟",
    options: [
      {
        text: "اولویت به مناطق محروم و کمترتوسعه‌یافته",
        traits: { egalitarian: 3, redistributive: 3, just: 2 },
      },
      {
        text: "سرمایه‌گذاری در مناطق دارای پتانسیل رشد",
        traits: { developmentalist: 3, pragmatic: 2, efficient: 2 },
      },
      {
        text: "توزیع عادلانه بر اساس جمعیت",
        traits: { fair: 3, balanced: 2, proportional: 3 },
      },
      {
        text: "تمرکز بر مناطق استراتژیک برای امنیت ملی",
        traits: { strategic: 3, security_first: 2, nationalist: 2 },
      },
    ],
  },
  {
    question: "نقش هنر و فرهنگ در حکومت شما چیست؟",
    options: [
      {
        text: "آزادی کامل هنری بدون محدودیت",
        traits: { liberal: 3, permissive: 2, artistic: 3 },
      },
      {
        text: "حمایت در چارچوب ارزش‌های ملی",
        traits: { cultural: 3, nationalist: 2, guided: 2 },
      },
      {
        text: "هنر در خدمت تبلیغ ایدئولوژی حکومت",
        traits: { propagandist: 3, ideological: 2, instrumental: 3 },
      },
      {
        text: "عدم دخالت و کاهش حمایت دولتی",
        traits: { laissez_faire: 3, minimal_state: 2, neutral: 2 },
      },
    ],
  },
  {
    question: "درباره انرژی هسته‌ای چه سیاستی دارید؟",
    options: [
      {
        text: "توسعه کامل برای انرژی و فناوری",
        traits: { technocratic: 3, modernist: 3, ambitious: 2 },
      },
      {
        text: "توسعه صلح‌آمیز تحت نظارت بین‌المللی",
        traits: { cooperative: 3, peaceful: 3, transparent: 2 },
      },
      {
        text: "توقف کامل به دلیل خطرات امنیتی",
        traits: { cautious: 3, security_first: 3, anti_nuclear: 2 },
      },
      {
        text: "تمرکز بر انرژی‌های تجدیدپذیر به جای هسته‌ای",
        traits: { environmentalist: 3, sustainable: 3, alternative: 2 },
      },
    ],
  },
];

export const questionExplanations = {
  0: {
    title: "این سوال چی رو می‌سنجه؟",
    text: "این سوال میزان مقاومت، انعطاف‌پذیری و استراتژی شما در برابر فشارهای خارجی را ارزیابی می‌کند.",
  },
  1: {
    title: "این سوال چی رو می‌سنجه؟",
    text: "این سوال نگرش شما نسبت به استقلال سیاسی و اتحادهای بین‌المللی را بررسی می‌کند.",
  },
  2: {
    title: "این سوال چی رو می‌سنجه؟",
    text: "این سوال میزان آزادی‌خواهی یا کنترل‌گرایی شما را در مورد رسانه‌ها و آزادی بیان نشان می‌دهد.",
  },
  3: {
    title: "این سوال چی رو می‌سنجه؟",
    text: "این سوال اولویت‌های اقتصادی شما را مشخص می‌کند.",
  },
  4: {
    title: "این سوال چی رو می‌سنجه؟",
    text: "این سوال نحوه مدیریت بحران‌ها و اعتراضات مردمی را ارزیابی می‌کند.",
  },
  5: {
    title: "این سوال چی رو می‌سنجه؟",
    text: "این سوال نقش دین در سیاست از دید شما را نشان می‌دهد.",
  },
  6: {
    title: "این سوال چی رو می‌سنجه؟",
    text: "این سوال دیدگاه شما درباره قدرت نظامی و ارتش را بررسی می‌کند.",
  },
  7: {
    title: "این سوال چی رو می‌سنجه؟",
    text: "این سوال نگرش اقتصادی شما را مشخص می‌کند.",
  },
  8: {
    title: "این سوال چی رو می‌سنجه؟",
    text: "این سوال استراتژی سیاست خارجی شما را نشان می‌دهد.",
  },
  9: {
    title: "این سوال چی رو می‌سنجه؟",
    text: "این سوال میزان مداراگرایی و احترام به حقوق اقلیت‌ها را ارزیابی می‌کند.",
  },
  10: {
    title: "این سوال چی رو می‌سنجه؟",
    text: "این سوال رویکرد شما به مبارزه با فساد را بررسی می‌کند.",
  },
  11: {
    title: "این سوال چی رو می‌سنجه؟",
    text: "این سوال میزان همکاری بین‌المللی یا ملی‌گرایی شما را در بحران‌های جهانی نشان می‌دهد.",
  },
  12: {
    title: "این سوال چی رو می‌سنجه؟",
    text: "این سوال سیاست خارجی شما نسبت به قدرت‌های بزرگ را مشخص می‌کند.",
  },
  13: {
    title: "این سوال چی رو می‌سنجه؟",
    text: "این سوال اهمیت توسعه علمی و فناوری در سیاست شما را نشان می‌دهد.",
  },
  14: {
    title: "این سوال چی رو می‌سنجه؟",
    text: "این سوال ترجیح شما بین پوپولیسم و تکنوکراسی را مشخص می‌کند.",
  },
  15: {
    title: "این سوال چی رو می‌سنجه؟",
    text: "این سوال جهت‌گیری کلی شما در دیپلماسی و اولویت‌های بین‌المللی را نشان می‌دهد.",
  },
  16: {
    title: "این سوال چی رو می‌سنجه؟",
    text: "این سوال نگرش شما نسبت به جنسیت و نقش اجتماعی زنان را بررسی می‌کند.",
  },
  17: {
    title: "این سوال چی رو می‌سنجه؟",
    text: "این سوال میزان اهمیت محیط زیست در سیاست‌گذاری‌های شما را مشخص می‌کند.",
  },
  18: {
    title: "این سوال چی رو می‌سنجه؟",
    text: "این سوال میزان مدارا یا سخت‌گیری شما با مخالفان سیاسی را ارزیابی می‌کند.",
  },
  19: {
    title: "این سوال چی رو می‌سنجه؟",
    text: "این سوال رویکرد انسان‌دوستانه یا محافظه‌کارانه شما نسبت به مهاجران را نشان می‌دهد.",
  },
  20: {
    title: "این سوال چی رو می‌سنجه؟",
    text: "این سوال موضع شما را در برابر پدیده جهانی‌سازی مشخص می‌کند.",
  },
  21: {
    title: "این سوال چی رو می‌سنجه؟",
    text: "این سوال فلسفه و اهداف آموزشی مورد نظر شما را بررسی می‌کند.",
  },
  22: {
    title: "این سوال چی رو می‌سنجه؟",
    text: "این سوال معیارهای شما برای توزیع منابع و امکانات بین مناطق را نشان می‌دهد.",
  },
  23: {
    title: "این سوال چی رو می‌سنجه؟",
    text: "این سوال رابطه حکومت با هنر و میزان آزادی یا کنترل فرهنگی را ارزیابی می‌کند.",
  },
  24: {
    title: "این سوال چی رو می‌سنجه؟",
    text: "این سوال موضع شما درباره انرژی هسته‌ای و فناوری‌های پیشرفته را مشخص می‌کند.",
  },
};
