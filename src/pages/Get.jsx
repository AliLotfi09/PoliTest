import React, { useState, useEffect } from 'react';

const GetPage = () => {
    const [opacity, setOpacity] = useState(0.05);
  
  // تغییر تدریجی میزان شفافیت نویز برای افکت پویا
  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(prev => {
        const newValue = prev + (Math.random() * 0.02 - 0.01);
        // محدود کردن مقدار بین 0.03 تا 0.08
        return Math.max(0.02, Math.min(0.04, newValue));
      });
    }, 300);
    
    return () => clearInterval(interval);
  }, []);
  return (
<main className="">
  <div
    className="absolute top-0 left-0 w-full h-full content-[''] z-10 pointer-events-none bg-[url('https://www.ui-layouts.com/noise.gif')]"
    style={{ opacity: opacity }}
  ></div>
  <section className="  font-semibold  dark:to-gray-800 dark:from-gray-950 to-[#dadada] from-[#ebebeb] flex flex-col items-center justify-center dark:text-white text-black">
    <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[35px_34px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

    <h1 className="2xl:text-7xl text-5xl px-8 font-semibold text-center tracking-tight leading-[120%]">
      برنامک ما در سراسر پلتفرم ها!
    </h1>
    <h3 className='2xl:text-4xl text-2xl px-8  text-center tracking-tight leading-[120%]'>
        همین الان دانلود کنید
    </h3>
  </section>
</main>
  );
};

export default GetPage;