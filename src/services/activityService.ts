
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Activity = Database["public"]["Tables"]["activities"]["Row"];
type ActivityInsert = Database["public"]["Tables"]["activities"]["Insert"];

export const activityService = {
  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching activities:", error);
      throw error;
    }

    return data || [];
  },

  async markAsRead(activityId: string): Promise<void> {
    const { error } = await supabase
      .from("activities")
      .update({ is_read: true })
      .eq("id", activityId);

    if (error) {
      console.error("Error marking activity as read:", error);
      throw error;
    }
  },

  async createActivity(activity: Omit<ActivityInsert, "user_id">): Promise<Activity> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("activities")
      .insert({
        ...activity,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating activity:", error);
      throw error;
    }

    return data;
  },

  async getUnreadCount(): Promise<number> {
    const { count, error } = await supabase
      .from("activities")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false);

    if (error) {
      console.error("Error getting unread count:", error);
      throw error;
    }

    return count || 0;
  }
};
