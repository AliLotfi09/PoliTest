import { supabase } from "../supabase";

class SupabaseHelper {
  async saveEitaaUser(eitaaUser) {
    try {
      const userId = `${eitaaUser.id}`;
      const now = Date.now();

      console.log("💾 Saving Eitaa user:", userId);

      // چک کردن اگه کاربر قبلاً وجود داره
      const { data: existingUser, error: selectError } = await supabase
        .from("users")
        .select("id, visit_count")
        .eq("id", userId)
        .maybeSingle();

      if (selectError) {
        console.error("❌ Supabase select error:", selectError);
        return { success: false, error: selectError };
      }

      let isNewUser = false;
      let result;

      if (existingUser) {
        // آپدیت: افزایش تعداد بازدید و آپدیت آخرین بازدید
        result = await supabase
          .from("users")
          .update({
            last_visit: now,
            visit_count: existingUser.visit_count + 1,
          })
          .eq("id", userId)
          .select();

        console.log(
          "🔄 User updated - Visit #" + (existingUser.visit_count + 1)
        );
      } else {
        // ایجاد کاربر جدید
        result = await supabase
          .from("users")
          .insert([
            {
              id: userId,
              first_name: eitaaUser.first_name || eitaaUser.firstName,
              last_name: eitaaUser.last_name || eitaaUser.lastName,
              last_visit: now,
              visit_count: 1,
            },
          ])
          .select();

        isNewUser = true;
        console.log("✨ New user created");
      }

      if (result.error) {
        console.error("❌ Supabase error:", result.error);
        return { success: false, error: result.error };
      }

      const userData = result.data[0];

      // --- ارسال پیام خوش‌آمدگویی اگر کاربر جدید است ---
      if (isNewUser) {
        try {
          const EITAA_TOKEN = process.env.EITAA_PROGRAM_TOKEN;
          if (!EITAA_TOKEN) throw new Error("Missing EITAA_PROGRAM_TOKEN");

          const message = `سلام ${userData.first_name || "دوست"}! 👋
خوش اومدی به تست شخصیت سیاسی ما! 😎
 و تست غیرمنتظره‌ای در انتظارته، همین الان شروع کن! 🚀
تست رو برای دوستات و علاقه‌مندان هم بفرست و اون‌ها رو دعوت کن که شرکت کنن! 🎉`;

          const res = await fetch("https://eitaayar.ir/api/app/sendMessage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: EITAA_TOKEN,
              chat_id: Number(userId),
              text: message,
            }),
          });

          const data = await res.json();
          console.log("📩 Welcome message sent:", data);
        } catch (err) {
          console.error("❌ Error sending welcome message:", err.message);
        }
      }

      return { success: true, data: userData };
    } catch (err) {
      console.error("❌ Save error:", err);
      return { success: false, error: err.message };
    }
  }
}

const supabaseHelper = new SupabaseHelper();
export default supabaseHelper;
