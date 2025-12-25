// src/utils/supabaseHelper.js
import { supabase } from '../supabase';

class SupabaseHelper {
  // ذخیره یا آپدیت کاربر Eitaa
  async saveEitaaUser(eitaaUser) {
    try {
      const userId = `eitaa_${eitaaUser.id}`;
      const now = Date.now();

      console.log('💾 Saving Eitaa user:', userId);

      // چک کردن اگه کاربر قبلاً وجود داره
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, visit_count')
        .eq('id', userId)
        .maybeSingle();

      let result;

      if (existingUser) {
        // آپدیت: افزایش تعداد بازدید و آپدیت آخرین بازدید
        result = await supabase
          .from('users')
          .update({
            last_visit: now,
            visit_count: existingUser.visit_count + 1
          })
          .eq('id', userId)
          .select();

        console.log('🔄 User updated - Visit #' + (existingUser.visit_count + 1));
      } else {
        // ایجاد کاربر جدید
        result = await supabase
          .from('users')
          .insert([{
            id: userId,
            first_name: eitaaUser.first_name || eitaaUser.firstName,
            last_name: eitaaUser.last_name || eitaaUser.lastName,
            last_visit: now,
            visit_count: 1
          }])
          .select();

        console.log('✨ New user created');
      }

      if (result.error) {
        console.error('❌ Supabase error:', result.error);
        return { success: false, error: result.error };
      }

      return { success: true, data: result.data[0] };

    } catch (err) {
      console.error('❌ Save error:', err);
      return { success: false, error: err.message };
    }
  }
}

const supabaseHelper = new SupabaseHelper();
export default supabaseHelper;