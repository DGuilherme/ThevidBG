// Auto-generate with: npx supabase gen types typescript --project-id <id> > types/database.ts
// This file will be replaced by the generated version once Supabase project is linked.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string | null
          avatar_url: string | null
          is_premium: boolean
          created_at: string
        }
        Insert: {
          id: string
          email: string
          username?: string | null
          avatar_url?: string | null
          is_premium?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          avatar_url?: string | null
          is_premium?: boolean
          created_at?: string
        }
        Relationships: []
      }
      games_collection: {
        Row: {
          id: string
          user_id: string
          bgg_id: number
          title: string
          image_url: string | null
          thumbnail_url: string | null
          min_players: number | null
          max_players: number | null
          play_time: number | null
          year_published: number | null
          rating: number | null
          bgg_rating: number | null
          shelf_of_shame: boolean
          status: 'owned' | 'previously_owned' | 'for_trade' | 'want_to_buy'
          added_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bgg_id: number
          title: string
          image_url?: string | null
          thumbnail_url?: string | null
          min_players?: number | null
          max_players?: number | null
          play_time?: number | null
          year_published?: number | null
          rating?: number | null
          bgg_rating?: number | null
          shelf_of_shame?: boolean
          status?: 'owned' | 'previously_owned' | 'for_trade' | 'want_to_buy'
          added_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bgg_id?: number
          title?: string
          image_url?: string | null
          thumbnail_url?: string | null
          min_players?: number | null
          max_players?: number | null
          play_time?: number | null
          year_published?: number | null
          rating?: number | null
          bgg_rating?: number | null
          shelf_of_shame?: boolean
          status?: 'owned' | 'previously_owned' | 'for_trade' | 'want_to_buy'
          added_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "games_collection_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      players: {
        Row: {
          id: string
          user_id: string
          name: string
          avatar_url: string | null
          is_anonymous: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          avatar_url?: string | null
          is_anonymous?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          avatar_url?: string | null
          is_anonymous?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "players_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      match_logs: {
        Row: {
          id: string
          user_id: string
          game_id: string
          date: string
          duration_minutes: number | null
          notes: string | null
          location: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          game_id: string
          date?: string
          duration_minutes?: number | null
          notes?: string | null
          location?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          game_id?: string
          date?: string
          duration_minutes?: number | null
          notes?: string | null
          location?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_logs_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games_collection"
            referencedColumns: ["id"]
          }
        ]
      }
      match_players: {
        Row: {
          match_id: string
          player_id: string
          score: number | null
          is_winner: boolean
          position: number | null
        }
        Insert: {
          match_id: string
          player_id: string
          score?: number | null
          is_winner?: boolean
          position?: number | null
        }
        Update: {
          match_id?: string
          player_id?: string
          score?: number | null
          is_winner?: boolean
          position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "match_players_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          }
        ]
      }
      wishlist: {
        Row: {
          id: string
          user_id: string
          bgg_id: number
          title: string
          image_url: string | null
          thumbnail_url: string | null
          priority: number
          notes: string | null
          added_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bgg_id: number
          title: string
          image_url?: string | null
          thumbnail_url?: string | null
          priority?: number
          notes?: string | null
          added_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bgg_id?: number
          title?: string
          image_url?: string | null
          thumbnail_url?: string | null
          priority?: number
          notes?: string | null
          added_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
