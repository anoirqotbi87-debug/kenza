export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      api_rate_limits: {
        Row: {
          count: number
          key: string
          reset_at: string
        }
        Insert: {
          count?: number
          key: string
          reset_at: string
        }
        Update: {
          count?: number
          key?: string
          reset_at?: string
        }
        Relationships: []
      }
      checkpoint_lessons: {
        Row: {
          checkpoint_id: string
          lesson_id: string
        }
        Insert: {
          checkpoint_id: string
          lesson_id: string
        }
        Update: {
          checkpoint_id?: string
          lesson_id?: string
        }
        Relationships: []
      }
      csp_violations: {
        Row: {
          blocked_uri: string
          created_at: string
          directive: string
          document_uri: string
          id: number
        }
        Insert: {
          blocked_uri?: string
          created_at?: string
          directive?: string
          document_uri?: string
          id?: number
        }
        Update: {
          blocked_uri?: string
          created_at?: string
          directive?: string
          document_uri?: string
          id?: number
        }
        Relationships: []
      }
      funnel_events: {
        Row: {
          anonymous_id: string
          created_at: string
          event_name: string
          id: number
          page_path: string | null
          properties: Json
          referrer: string | null
          user_id: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          anonymous_id: string
          created_at?: string
          event_name: string
          id?: never
          page_path?: string | null
          properties?: Json
          referrer?: string | null
          user_id?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          anonymous_id?: string
          created_at?: string
          event_name?: string
          id?: never
          page_path?: string | null
          properties?: Json
          referrer?: string | null
          user_id?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          id: string
          lesson_id: string
          score: number | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          lesson_id: string
          score?: number | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          lesson_id?: string
          score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          daily_ai_messages_count: number | null
          hearts: number | null
          id: string
          is_premium: boolean | null
          last_activity_date: string | null
          last_ai_usage_date: string | null
          script_preference: string | null
          streak_days: number | null
          streak_freezes: number | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_cycle: string | null
          unlocked_badges: string[] | null
          updated_at: string
          username: string | null
          xp: number | null
        }
        Insert: {
          created_at?: string
          daily_ai_messages_count?: number | null
          hearts?: number | null
          id: string
          is_premium?: boolean | null
          last_activity_date?: string | null
          last_ai_usage_date?: string | null
          script_preference?: string | null
          streak_days?: number | null
          streak_freezes?: number | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_cycle?: string | null
          unlocked_badges?: string[] | null
          updated_at?: string
          username?: string | null
          xp?: number | null
        }
        Update: {
          created_at?: string
          daily_ai_messages_count?: number | null
          hearts?: number | null
          id?: string
          is_premium?: boolean | null
          last_activity_date?: string | null
          last_ai_usage_date?: string | null
          script_preference?: string | null
          streak_days?: number | null
          streak_freezes?: number | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_cycle?: string | null
          unlocked_badges?: string[] | null
          updated_at?: string
          username?: string | null
          xp?: number | null
        }
        Relationships: []
      }
      srs_items: {
        Row: {
          due_date: string | null
          ease_factor: number | null
          id: string
          interval: number | null
          repetition: number | null
          state: string | null
          user_id: string | null
          word_id: string
        }
        Insert: {
          due_date?: string | null
          ease_factor?: number | null
          id?: string
          interval?: number | null
          repetition?: number | null
          state?: string | null
          user_id?: string | null
          word_id: string
        }
        Update: {
          due_date?: string | null
          ease_factor?: number | null
          id?: string
          interval?: number | null
          repetition?: number | null
          state?: string | null
          user_id?: string | null
          word_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "srs_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_attribution: {
        Row: {
          anonymous_id: string | null
          first_seen_at: string | null
          landing_page: string | null
          referrer: string | null
          signup_at: string
          user_id: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          anonymous_id?: string | null
          first_seen_at?: string | null
          landing_page?: string | null
          referrer?: string | null
          signup_at?: string
          user_id: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          anonymous_id?: string | null
          first_seen_at?: string | null
          landing_page?: string | null
          referrer?: string | null
          signup_at?: string
          user_id?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      user_checkpoints: {
        Row: {
          certificate_code: string | null
          checkpoint_id: string
          passed_at: string | null
          score: number
          user_id: string
        }
        Insert: {
          certificate_code?: string | null
          checkpoint_id: string
          passed_at?: string | null
          score: number
          user_id: string
        }
        Update: {
          certificate_code?: string | null
          checkpoint_id?: string
          passed_at?: string | null
          score?: number
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cancel_user_subscription: {
        Args: { p_subscription_id: string }
        Returns: boolean
      }
      check_rate_limit: {
        Args: { p_key: string; p_limit: number; p_window_ms: number }
        Returns: boolean
      }
      claim_attribution: { Args: { p: Json }; Returns: undefined }
      claim_checkpoint_reward: {
        Args: { p_checkpoint_id: string; p_score: number }
        Returns: string
      }
      complete_lesson: {
        Args: { p_lesson_id: string; p_score?: number }
        Returns: undefined
      }
      complete_lessons_bulk: {
        Args: { p_lesson_ids: string[] }
        Returns: undefined
      }
      consume_ai_quota: { Args: never; Returns: boolean }
      purge_expired_rate_limits: { Args: never; Returns: undefined }
      purge_old_csp_violations: {
        Args: { p_keep_days?: number }
        Returns: number
      }
      set_user_subscription: {
        Args: {
          p_customer_id?: string
          p_cycle?: string
          p_is_premium: boolean
          p_subscription_id?: string
          p_user_id: string
        }
        Returns: boolean
      }
      sync_user_progress: {
        Args: {
          new_badges: string[]
          new_streak_days: number
          new_streak_freezes: number
          new_xp: number
        }
        Returns: undefined
      }
      update_user_subscription_status: {
        Args: { p_is_active: boolean; p_subscription_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
