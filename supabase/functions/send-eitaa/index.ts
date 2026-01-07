// supabase/functions/send-eitaa/index.ts
import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!
);

const TOKEN = Deno.env.get("EITAA_PROGRAM_TOKEN")!;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const BATCH_SIZE = 20;

type Mode = "welcome" | "vip" | "broadcast";

serve(async (req) => {
  try {
    const { mode, message } = await req.json() as {
      mode: Mode;
      message?: string;
    };

    let query = supabase.from("users").select("id, first_name, visit_count");

    // 🔀 رفتار بر اساس mode
    if (mode === "welcome") {
      query = query.eq("welcome_sent", false).limit(20);
    }

    if (mode === "vip") {
      query = query
        .gt("visit_count", 3)
        .eq("vip_message_sent", false)
        .limit(50);
    }

    if (mode === "broadcast") {
      query = query.eq("broadcast_sent", false);
    }

    const { data: users, error } = await query;
    if (error || !users?.length) {
      return new Response(JSON.stringify({ message: "No users" }), { status: 200 });
    }

    const results: any[] = [];

    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const batch = users.slice(i, i + BATCH_SIZE);

      const jobs = batch.map(async (user) => {
        const chat_id = Number(String(user.id).replace("eitaa_", ""));
        if (!chat_id) return;

        const text =
          message ||
          (mode === "welcome"
            ? `سلام ${user.first_name || "عزیز"}! 👋
خوش اومدی به تست شخصیت سیاسی ما! 😎
نتیجه غیرمنتظره‌ای در انتظارته، همین الان شروع کن! 🚀
نتیجه تست خودتو برای دوستان و علاقه‌مندان بفرست تا اون‌ها هم شرکت کنن✨`
            : mode === "vip"
            ? `سلام ${user.first_name || "دوست عزیز"}! 👀
دیدیم ${user.visit_count || 0} بار سر زدی 😉
این یعنی وفاداری و کنجکاوی داری! 🔥
هر روز به ما سربزن و همچنین آشناهات رو دعوت کن تا اونا هم تست بدن!
همین الان دوباره امتحانش کن و نتیجه‌تو با دوستانت به اشتراک بذار ✨`
            : "");

        await fetch("https://eitaayar.ir/api/app/sendMessage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: TOKEN, chat_id, text }),
        });

        // FIXED: Proper object update based on mode
        const updateData: any = {};
        if (mode === "welcome") updateData.welcome_sent = true;
        if (mode === "vip") updateData.vip_message_sent = true;
        if (mode === "broadcast") updateData.broadcast_sent = true;

        await supabase
          .from("users")
          .update(updateData)
          .eq("id", user.id);

        return { id: chat_id, mode, status: "sent" };
      });

      results.push(...await Promise.all(jobs));
      await sleep(1000);
    }

    return new Response(JSON.stringify({ results }), { status: 200 });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});