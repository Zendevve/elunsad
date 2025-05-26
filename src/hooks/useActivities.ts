
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { activityService } from "@/services/activityService";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useActivities = (limit?: number) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
    enabled: isAuthenticated, // Only run query when authenticated
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
    if (!isAuthenticated) {
      console.log("Skipping real-time subscription - user not authenticated");
      return;
    }

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
  }, [queryClient, toast, isAuthenticated]);

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
    isAuthenticated,
  };
};

export const useUnreadCount = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return useQuery({
    queryKey: ["unread-count"],
    queryFn: () => activityService.getUnreadCount(),
    retry: 3,
    retryDelay: 1000,
    enabled: isAuthenticated, // Only run query when authenticated
  });
};
