
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
      
      // Wait for authentication to be established
      let attempts = 0;
      const maxAttempts = 5;
      let user = null;
      
      while (attempts < maxAttempts) {
        const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          console.error("Authentication error in createActivity:", authError);
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
          continue;
        }
        
        if (currentUser) {
          user = currentUser;
          break;
        }
        
        attempts++;
        console.log(`Waiting for authentication... attempt ${attempts}/${maxAttempts}`);
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
      }
      
      if (!user) {
        console.error("No authenticated user found after waiting");
        return null;
      }

      console.log("Creating activity for authenticated user:", user.id);

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
        console.error("Error details:", error.message, error.details, error.hint);
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

  // Helper method to create a test activity with proper authentication check
  async createTestActivity(): Promise<Activity | null> {
    // Check authentication first
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      console.error("User must be authenticated to create test activity");
      return null;
    }
    
    return this.createActivity({
      activity_type: "application_submitted",
      title: "Test Activity Created",
      description: `Test activity created by ${user.email} at ${new Date().toLocaleString()}`,
      related_entity_id: null,
      related_entity_type: null,
    });
  }
};
