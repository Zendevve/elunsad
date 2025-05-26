
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { activityService } from "@/services/activityService";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useActivities = (limit?: number) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: activities = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["activities", limit],
    queryFn: () => activityService.getRecentActivities(limit),
    retry: 3,
    retryDelay: 1000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (activityId: string) => activityService.markAsRead(activityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
    onError: (error) => {
      console.error("Error marking activity as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark activity as read",
        variant: "destructive",
      });
    },
  });

  // Set up real-time subscription for new activities
  useEffect(() => {
    console.log("Setting up real-time subscription for activities");
    
    const channel = supabase
      .channel("activities-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "activities",
        },
        (payload) => {
          console.log("Activity change received:", payload);
          queryClient.invalidateQueries({ queryKey: ["activities"] });
          queryClient.invalidateQueries({ queryKey: ["unread-count"] });
          
          // Show toast for new activities
          if (payload.eventType === "INSERT") {
            toast({
              title: "New Activity",
              description: payload.new.title,
            });
          }
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up real-time subscription for activities");
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  // Log errors for debugging
  useEffect(() => {
    if (error) {
      console.error("Activities query error:", error);
    }
  }, [error]);

  return {
    activities,
    isLoading,
    error,
    refetch,
    markAsRead: markAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
  };
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ["unread-count"],
    queryFn: () => activityService.getUnreadCount(),
    retry: 3,
    retryDelay: 1000,
  });
};
