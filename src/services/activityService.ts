
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Activity = Database["public"]["Tables"]["activities"]["Row"];
type ActivityInsert = Database["public"]["Tables"]["activities"]["Insert"];

export const activityService = {
  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching activities:", error);
        throw error;
      }

      console.log("Fetched activities:", data);
      return data || [];
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      return [];
    }
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

  async createActivity(activity: Omit<ActivityInsert, "user_id">): Promise<Activity | null> {
    try {
      console.log("Creating activity:", activity);
      
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error("Authentication error in createActivity:", authError);
        return null;
      }
      
      if (!user) {
        console.error("No authenticated user found for activity creation");
        return null;
      }

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
        return null;
      }

      console.log("Activity created successfully:", data);
      return data;
    } catch (error) {
      console.error("Failed to create activity:", error);
      return null;
    }
  },

  async getUnreadCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from("activities")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);

      if (error) {
        console.error("Error getting unread count:", error);
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error("Failed to get unread count:", error);
      return 0;
    }
  },

  // Create a simple test activity to verify the system works
  async createTestActivity(): Promise<Activity | null> {
    return this.createActivity({
      activity_type: "application_submitted",
      title: "System Test",
      description: "Testing activity creation - this confirms the Recent Activity system is working!",
      related_entity_id: null,
      related_entity_type: null,
    });
  }
};
