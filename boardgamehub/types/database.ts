// Auto-generate with: npx supabase gen types typescript --project-id <id> > types/database.ts
// This file will be replaced by the generated version once Supabase project is linked.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
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
        Update: Partial<Database['public']['Tables']['games_collection']['Insert']>
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
        Update: Partial<Database['public']['Tables']['players']['Insert']>
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
        Update: Partial<Database['public']['Tables']['match_logs']['Insert']>
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
        Update: Partial<Database['public']['Tables']['match_players']['Insert']>
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
        Update: Partial<Database['public']['Tables']['wishlist']['Insert']>
      }
    }
  }
}
