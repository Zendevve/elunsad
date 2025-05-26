
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
    console.log("Creating activity:", activity);
    
    // Get current user with more detailed logging
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log("Auth check for activity creation:", { user: user?.id, error: authError });
    
    if (authError) {
      console.error("Authentication error in createActivity:", authError);
      throw new Error(`Authentication error: ${authError.message}`);
    }
    
    if (!user) {
      console.error("No authenticated user found for activity creation");
      throw new Error("User not authenticated - cannot create activity");
    }

    console.log("Creating activity for user:", user.id);

    const activityData = {
      ...activity,
      user_id: user.id,
    };

    console.log("Activity data to insert:", activityData);

    const { data, error } = await supabase
      .from("activities")
      .insert(activityData)
      .select()
      .single();

    if (error) {
      console.error("Error creating activity:", error);
      throw error;
    }

    console.log("Activity created successfully:", data);
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
