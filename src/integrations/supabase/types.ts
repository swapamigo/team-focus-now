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
      blocked_websites: {
        Row: {
          company_id: string
          created_at: string
          domain: string
          id: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          domain: string
          id?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          domain?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocked_websites_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      breaks: {
        Row: {
          company_id: string
          created_at: string
          end_time: string
          id: string
          label: string
          start_time: string
        }
        Insert: {
          company_id: string
          created_at?: string
          end_time: string
          id?: string
          label: string
          start_time: string
        }
        Update: {
          company_id?: string
          created_at?: string
          end_time?: string
          id?: string
          label?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "breaks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          company_id: string
          created_at: string
          created_by: string
          description: string | null
          duration: Database["public"]["Enums"]["challenge_duration"]
          end_date: string
          id: string
          start_date: string
          status: Database["public"]["Enums"]["challenge_status"]
          title: string
          updated_at: string
          winner_team_id: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by: string
          description?: string | null
          duration?: Database["public"]["Enums"]["challenge_duration"]
          end_date: string
          id?: string
          start_date: string
          status?: Database["public"]["Enums"]["challenge_status"]
          title: string
          updated_at?: string
          winner_team_id?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          duration?: Database["public"]["Enums"]["challenge_duration"]
          end_date?: string
          id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["challenge_status"]
          title?: string
          updated_at?: string
          winner_team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenges_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_winner_team_id_fkey"
            columns: ["winner_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          id: string
          industry: string | null
          min_team_k: number
          name: string
          owner_id: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          industry?: string | null
          min_team_k?: number
          name: string
          owner_id: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          industry?: string | null
          min_team_k?: number
          name?: string
          owner_id?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      company_members: {
        Row: {
          company_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_team_summaries: {
        Row: {
          avg_penalty_minutes: number
          avg_screen_minutes: number
          company_id: string
          created_at: string
          date: string
          id: string
          member_count: number
          team_id: string
          total_screen_minutes: number
          updated_at: string
        }
        Insert: {
          avg_penalty_minutes?: number
          avg_screen_minutes?: number
          company_id: string
          created_at?: string
          date: string
          id?: string
          member_count?: number
          team_id: string
          total_screen_minutes?: number
          updated_at?: string
        }
        Update: {
          avg_penalty_minutes?: number
          avg_screen_minutes?: number
          company_id?: string
          created_at?: string
          date?: string
          id?: string
          member_count?: number
          team_id?: string
          total_screen_minutes?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_team_summaries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_team_summaries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_user_summaries: {
        Row: {
          company_id: string
          created_at: string
          date: string
          focus_violations: number
          id: string
          penalty_minutes: number
          screen_minutes: number
          team_id: string | null
          unlocks: number
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          date: string
          focus_violations?: number
          id?: string
          penalty_minutes?: number
          screen_minutes?: number
          team_id?: string | null
          unlocks?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          date?: string
          focus_violations?: number
          id?: string
          penalty_minutes?: number
          screen_minutes?: number
          team_id?: string | null
          unlocks?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_user_summaries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_user_summaries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_leads: {
        Row: {
          company_name: string | null
          contact_name: string | null
          country: string | null
          country_code: string | null
          created_at: string
          email: string
          employee_count: number | null
          id: string
          plan: string | null
          source: string | null
        }
        Insert: {
          company_name?: string | null
          contact_name?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string
          email: string
          employee_count?: number | null
          id?: string
          plan?: string | null
          source?: string | null
        }
        Update: {
          company_name?: string | null
          contact_name?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string
          email?: string
          employee_count?: number | null
          id?: string
          plan?: string | null
          source?: string | null
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      feedback_responses: {
        Row: {
          awareness_score: number | null
          business_area: string | null
          company_name: string | null
          country: string | null
          country_code: string | null
          created_at: string
          email: string | null
          employee_count: number | null
          id: string
          sector: string | null
          source: string | null
          suggestion: string | null
        }
        Insert: {
          awareness_score?: number | null
          business_area?: string | null
          company_name?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string
          email?: string | null
          employee_count?: number | null
          id?: string
          sector?: string | null
          source?: string | null
          suggestion?: string | null
        }
        Update: {
          awareness_score?: number | null
          business_area?: string | null
          company_name?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string
          email?: string | null
          employee_count?: number | null
          id?: string
          sector?: string | null
          source?: string | null
          suggestion?: string | null
        }
        Relationships: []
      }
      free_phone_times: {
        Row: {
          company_id: string
          created_at: string
          end_time: string
          id: string
          label: string
          start_time: string
        }
        Insert: {
          company_id: string
          created_at?: string
          end_time: string
          id?: string
          label: string
          start_time: string
        }
        Update: {
          company_id?: string
          created_at?: string
          end_time?: string
          id?: string
          label?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "free_phone_times_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      high_focus_periods: {
        Row: {
          active: boolean
          ad_hoc_until: string | null
          company_id: string
          created_at: string
          end_time: string
          id: string
          label: string
          multiplier: number
          start_time: string
          weekdays: number[]
        }
        Insert: {
          active?: boolean
          ad_hoc_until?: string | null
          company_id: string
          created_at?: string
          end_time: string
          id?: string
          label: string
          multiplier?: number
          start_time: string
          weekdays?: number[]
        }
        Update: {
          active?: boolean
          ad_hoc_until?: string | null
          company_id?: string
          created_at?: string
          end_time?: string
          id?: string
          label?: string
          multiplier?: number
          start_time?: string
          weekdays?: number[]
        }
        Relationships: [
          {
            foreignKeyName: "high_focus_periods_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      invites: {
        Row: {
          code: string
          company_id: string
          created_at: string
          created_by: string
          email: string | null
          expires_at: string
          id: string
          team_id: string | null
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          code: string
          company_id: string
          created_at?: string
          created_by: string
          email?: string | null
          expires_at?: string
          id?: string
          team_id?: string | null
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          code?: string
          company_id?: string
          created_at?: string
          created_by?: string
          email?: string | null
          expires_at?: string
          id?: string
          team_id?: string | null
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invites_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      link_events: {
        Row: {
          country: string | null
          country_code: string | null
          created_at: string
          device: string | null
          duration_seconds: number | null
          event_type: string
          href: string | null
          id: string
          label: string | null
          link_id: string
          page_path: string | null
          referrer: string | null
          session_id: string | null
        }
        Insert: {
          country?: string | null
          country_code?: string | null
          created_at?: string
          device?: string | null
          duration_seconds?: number | null
          event_type?: string
          href?: string | null
          id?: string
          label?: string | null
          link_id: string
          page_path?: string | null
          referrer?: string | null
          session_id?: string | null
        }
        Update: {
          country?: string | null
          country_code?: string | null
          created_at?: string
          device?: string | null
          duration_seconds?: number | null
          event_type?: string
          href?: string | null
          id?: string
          label?: string | null
          link_id?: string
          page_path?: string | null
          referrer?: string | null
          session_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          category: string
          created_at: string
          id: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body: string
          category?: string
          created_at?: string
          id?: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string
          category?: string
          created_at?: string
          id?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          beta_access: boolean
          consent_accepted_at: string | null
          created_at: string
          display_name: string | null
          id: string
          locale: string
          onboarded: boolean
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          beta_access?: boolean
          consent_accepted_at?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          locale?: string
          onboarded?: boolean
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          beta_access?: boolean
          consent_accepted_at?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          locale?: string
          onboarded?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      rewards: {
        Row: {
          challenge_id: string
          created_at: string
          description: string | null
          id: string
          title: string
        }
        Insert: {
          challenge_id: string
          created_at?: string
          description?: string | null
          id?: string
          title: string
        }
        Update: {
          challenge_id?: string
          created_at?: string
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "rewards_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          company_id: string
          created_at: string
          id: string
          price_per_seat_eur: number
          seats: number
          status: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          price_per_seat_eur?: number
          seats?: number
          status?: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          price_per_seat_eur?: number
          seats?: number
          status?: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      team_goals: {
        Row: {
          baseline_focus_minutes: number
          challenge_id: string | null
          company_id: string
          created_at: string
          id: string
          period_end: string
          period_start: string
          reward_note: string | null
          reward_title: string
          target_focus_minutes: number
          team_id: string
          unlocked: boolean
          unlocked_at: string | null
          updated_at: string
        }
        Insert: {
          baseline_focus_minutes?: number
          challenge_id?: string | null
          company_id: string
          created_at?: string
          id?: string
          period_end?: string
          period_start?: string
          reward_note?: string | null
          reward_title: string
          target_focus_minutes?: number
          team_id: string
          unlocked?: boolean
          unlocked_at?: string | null
          updated_at?: string
        }
        Update: {
          baseline_focus_minutes?: number
          challenge_id?: string | null
          company_id?: string
          created_at?: string
          id?: string
          period_end?: string
          period_start?: string
          reward_note?: string | null
          reward_title?: string
          target_focus_minutes?: number
          team_id?: string
          unlocked?: boolean
          unlocked_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_goals_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_goals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_goals_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          id: string
          joined_at: string
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          color: string
          company_id: string
          created_at: string
          emoji: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          color?: string
          company_id: string
          created_at?: string
          emoji?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          color?: string
          company_id?: string
          created_at?: string
          emoji?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_events: {
        Row: {
          app_name: string | null
          company_id: string
          created_at: string
          device_type: Database["public"]["Enums"]["device_type"]
          duration_seconds: number
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          is_high_focus: boolean
          is_whitelisted: boolean
          occurred_at: string
          penalty_minutes: number
          user_id: string
          website_url: string | null
        }
        Insert: {
          app_name?: string | null
          company_id: string
          created_at?: string
          device_type?: Database["public"]["Enums"]["device_type"]
          duration_seconds?: number
          event_type: Database["public"]["Enums"]["event_type"]
          id?: string
          is_high_focus?: boolean
          is_whitelisted?: boolean
          occurred_at?: string
          penalty_minutes?: number
          user_id: string
          website_url?: string | null
        }
        Update: {
          app_name?: string | null
          company_id?: string
          created_at?: string
          device_type?: Database["public"]["Enums"]["device_type"]
          duration_seconds?: number
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          is_high_focus?: boolean
          is_whitelisted?: boolean
          occurred_at?: string
          penalty_minutes?: number
          user_id?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_allowed_apps: {
        Row: {
          app_name: string
          company_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          app_name: string
          company_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          app_name?: string
          company_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_breaks: {
        Row: {
          company_id: string
          created_at: string
          end_time: string
          id: string
          label: string
          start_time: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          end_time: string
          id?: string
          label: string
          start_time: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          end_time?: string
          id?: string
          label?: string
          start_time?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_work_schedules: {
        Row: {
          company_id: string
          created_at: string
          end_time: string
          id: string
          start_time: string
          user_id: string
          weekday: number
        }
        Insert: {
          company_id: string
          created_at?: string
          end_time: string
          id?: string
          start_time: string
          user_id: string
          weekday: number
        }
        Update: {
          company_id?: string
          created_at?: string
          end_time?: string
          id?: string
          start_time?: string
          user_id?: string
          weekday?: number
        }
        Relationships: []
      }
      whitelisted_apps: {
        Row: {
          app_name: string
          company_id: string
          created_at: string
          id: string
        }
        Insert: {
          app_name: string
          company_id: string
          created_at?: string
          id?: string
        }
        Update: {
          app_name?: string
          company_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whitelisted_apps_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      whitelisted_websites: {
        Row: {
          company_id: string
          created_at: string
          domain: string
          id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          domain: string
          id?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          domain?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whitelisted_websites_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      work_schedules: {
        Row: {
          company_id: string
          created_at: string
          end_time: string
          id: string
          start_time: string
          weekday: number
        }
        Insert: {
          company_id: string
          created_at?: string
          end_time: string
          id?: string
          start_time: string
          weekday: number
        }
        Update: {
          company_id?: string
          created_at?: string
          end_time?: string
          id?: string
          start_time?: string
          weekday?: number
        }
        Relationships: [
          {
            foreignKeyName: "work_schedules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_invite: {
        Args: { _company_id: string; _team_id?: string }
        Returns: string
      }
      create_workspace: {
        Args: { _industry?: string; _name: string }
        Returns: string
      }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      delete_my_account: { Args: never; Returns: undefined }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      join_with_invite: { Args: { _code: string }; Returns: string }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      privacy_self_test: {
        Args: never
        Returns: {
          min_team_k_default: number
          raw_events_older_than_24h: number
          team_aggregates_below_k: number
        }[]
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      run_aggregate_and_purge: { Args: never; Returns: Json }
      run_evaluate_team_goals: { Args: never; Returns: Json }
    }
    Enums: {
      app_role: "manager" | "employee" | "admin"
      challenge_duration:
        | "1_week"
        | "2_weeks"
        | "3_weeks"
        | "1_month"
        | "custom"
      challenge_status: "draft" | "active" | "finished" | "cancelled"
      device_type:
        | "phone"
        | "tablet"
        | "laptop"
        | "desktop"
        | "browser_extension"
      event_type:
        | "unlock"
        | "app_usage"
        | "website_usage"
        | "focus_violation"
        | "desktop_usage"
      subscription_status: "trial" | "active" | "past_due" | "cancelled"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["manager", "employee", "admin"],
      challenge_duration: ["1_week", "2_weeks", "3_weeks", "1_month", "custom"],
      challenge_status: ["draft", "active", "finished", "cancelled"],
      device_type: [
        "phone",
        "tablet",
        "laptop",
        "desktop",
        "browser_extension",
      ],
      event_type: [
        "unlock",
        "app_usage",
        "website_usage",
        "focus_violation",
        "desktop_usage",
      ],
      subscription_status: ["trial", "active", "past_due", "cancelled"],
    },
  },
} as const
