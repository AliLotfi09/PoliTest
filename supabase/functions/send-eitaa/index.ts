// supabase/functions/send-eitaa/index.ts
import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!
);

const TOKEN = Deno.env.get("EITAA_PROGRAM_TOKEN")!;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const BATCH_SIZE = 20;

type Mode = "welcome" | "vip" | "broadcast";

serve(async (req) => {
  try {
    console.log("Request received:", {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
      url: req.url
    });

    // بررسی متد درخواست
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed. Use POST" }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }

    // بررسی وجود body
    const contentType = req.headers.get("content-type") || "";
    
    if (!req.body) {
      return new Response(
        JSON.stringify({ error: "No request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let body: any = {};
    
    try {
      // اگر content-type application/json نیست، باز هم سعی کنیم parse کنیم
      body = await req.json();
      console.log("Parsed body:", body);
    } catch (e) {
      console.error("JSON parsing error:", e);
      
      // سعی کنیم body را به صورت text بخوانیم
      try {
        const textBody = await req.text();
        console.log("Raw body text:", textBody);
        
        // سعی در parse دستی
        if (textBody.trim().startsWith("{") || textBody.trim().startsWith("[")) {
          body = JSON.parse(textBody);
        } else {
          return new Response(
            JSON.stringify({ 
              error: "Invalid JSON body",
              details: e.message,
              received: textBody.substring(0, 100)
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
      } catch (textError) {
        return new Response(
          JSON.stringify({ 
            error: "Could not parse request body",
            jsonError: e.message,
            textError: textError.message
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    const { mode, message } = body as { mode: Mode; message?: string };

    // اعتبارسنجی mode
    if (!mode || !["welcome", "vip", "broadcast"].includes(mode)) {
      return new Response(
        JSON.stringify({ error: "Invalid mode. Must be 'welcome', 'vip', or 'broadcast'" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let query = supabase.from("users").select("id, first_name, visit_count");

    // 🔀 رفتار بر اساس mode
    if (mode === "welcome") {
      query = query.eq("welcome_sent", false).limit(20);
    } else if (mode === "vip") {
      query = query.gt("visit_count", 3).eq("vip_message_sent", false).limit(50);
    } else if (mode === "broadcast") {
      query = query.eq("broadcast_sent", false);
    }

    const { data: users, error } = await query;
    if (error) {
      console.error("Supabase query error:", error);
      return new Response(
        JSON.stringify({ error: "Database error", details: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    if (!users?.length) {
      return new Response(
        JSON.stringify({ message: "No users found for this mode" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${users.length} users for mode: ${mode}`);

    const results: any[] = [];

    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const batch = users.slice(i, i + BATCH_SIZE);

      const jobs = batch.map(async (user) => {
        try {
          const chat_id = Number(String(user.id).replace("eitaa_", ""));
          if (!chat_id) {
            console.warn(`Invalid chat_id for user: ${user.id}`);
            return { id: user.id, error: "Invalid chat_id" };
          }

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
              : mode === "broadcast"
              ? `سلام ${user.first_name || "دوست عزیز"}! 👋

یه فرصت دوباره برای تست شخصیت سیاسی داری 🚀  
برای شروع دوباره، روی سه‌نقطه بالا بزن و صفحه رو Reload  یا بارگذاری مجدد صفحه رو بزن کن تا ویژگی های جدید رو ببینی

بعد از دیدن نتیجه، تجربه‌ت رو با ما به اشتراک بذار  
فرم رضایت‌سنجی:  
https://eitaa.com/Pollbot_app/app?startapp=an_CwcS8nnr?btn=پاسخ.به.پرسشنامه`
              : "");

          const sendResult = await fetch("https://eitaayar.ir/api/app/sendMessage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: TOKEN, chat_id, text }),
          });

          const sendData = await sendResult.json();
          console.log(`Sent to ${chat_id}:`, sendData);

          const updateData: any = {};
          if (mode === "welcome") updateData.welcome_sent = true;
          if (mode === "vip") updateData.vip_message_sent = true;
          if (mode === "broadcast") updateData.broadcast_sent = true;

          await supabase.from("users").update(updateData).eq("id", user.id);

          return { 
            id: chat_id, 
            mode, 
            status: "sent",
            message_id: sendData.result?.message_id 
          };
        } catch (jobError) {
          console.error(`Error sending to user ${user.id}:`, jobError);
          return { id: user.id, error: jobError.message };
        }
      });

      const batchResults = await Promise.all(jobs);
      results.push(...batchResults);
      
      if (i + BATCH_SIZE < users.length) {
        console.log(`Waiting 1 second before next batch...`);
        await sleep(1000);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        mode,
        total_sent: results.filter(r => !r.error).length,
        total_failed: results.filter(r => r.error).length,
        results 
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  } catch (err: any) {
    console.error("Unhandled error:", err);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        message: err.message,
        stack: err.stack 
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});