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
      addresses: {
        Row: {
          city: string
          country: string
          full_name: string
          id: string
          is_default: boolean
          line1: string
          line2: string | null
          phone: string | null
          postal_code: string
          profile_id: string
          state: string | null
          type: string
        }
        Insert: {
          city: string
          country: string
          full_name: string
          id?: string
          is_default?: boolean
          line1: string
          line2?: string | null
          phone?: string | null
          postal_code: string
          profile_id: string
          state?: string | null
          type?: string
        }
        Update: {
          city?: string
          country?: string
          full_name?: string
          id?: string
          is_default?: boolean
          line1?: string
          line2?: string | null
          phone?: string | null
          postal_code?: string
          profile_id?: string
          state?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_categories: {
        Row: {
          id: string
          is_active: boolean
          parent_id: string | null
          slug: string
        }
        Insert: {
          id?: string
          is_active?: boolean
          parent_id?: string | null
          slug: string
        }
        Update: {
          id?: string
          is_active?: boolean
          parent_id?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_category_translations: {
        Row: {
          category_id: string
          description: string | null
          id: string
          language_code: string
          name: string
        }
        Insert: {
          category_id: string
          description?: string | null
          id?: string
          language_code: string
          name: string
        }
        Update: {
          category_id?: string
          description?: string | null
          id?: string
          language_code?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_category_translations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_category_translations_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
        ]
      }
      blog_post_translations: {
        Row: {
          content: string | null
          excerpt: string | null
          id: string
          language_code: string
          meta_description: string | null
          meta_title: string | null
          post_id: string
          title: string
        }
        Insert: {
          content?: string | null
          excerpt?: string | null
          id?: string
          language_code: string
          meta_description?: string | null
          meta_title?: string | null
          post_id: string
          title: string
        }
        Update: {
          content?: string | null
          excerpt?: string | null
          id?: string
          language_code?: string
          meta_description?: string | null
          meta_title?: string | null
          post_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_translations_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "blog_post_translations_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          author_name: string | null
          category_id: string | null
          created_at: string
          featured_image_url: string | null
          id: string
          is_published: boolean
          published_at: string | null
          read_time_minutes: number | null
          slug: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          category_id?: string | null
          created_at?: string
          featured_image_url?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          read_time_minutes?: number | null
          slug: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          category_id?: string | null
          created_at?: string
          featured_image_url?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          read_time_minutes?: number | null
          slug?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          cart_id: string
          configuration: Json
          created_at: string
          id: string
          product_id: string
          quantity: number
          variant_id: string | null
        }
        Insert: {
          cart_id: string
          configuration?: Json
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          variant_id?: string | null
        }
        Update: {
          cart_id?: string
          configuration?: Json
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          completed_at: string | null
          created_at: string
          currency: string
          email: string | null
          expires_at: string | null
          id: string
          item_count: number
          lines: Json
          locale: string | null
          order_id: string | null
          profile_id: string | null
          recovery_token: string
          reminder_sent_at: string | null
          session_id: string | null
          subtotal: number
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          currency?: string
          email?: string | null
          expires_at?: string | null
          id?: string
          item_count?: number
          lines?: Json
          locale?: string | null
          order_id?: string | null
          profile_id?: string | null
          recovery_token?: string
          reminder_sent_at?: string | null
          session_id?: string | null
          subtotal?: number
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          currency?: string
          email?: string | null
          expires_at?: string | null
          id?: string
          item_count?: number
          lines?: Json
          locale?: string | null
          order_id?: string | null
          profile_id?: string | null
          recovery_token?: string
          reminder_sent_at?: string | null
          session_id?: string | null
          subtotal?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "carts_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          id: string
          image_url: string | null
          is_active: boolean
          parent_id: string | null
          slug: string
          sort_order: number
        }
        Insert: {
          id?: string
          image_url?: string | null
          is_active?: boolean
          parent_id?: string | null
          slug: string
          sort_order?: number
        }
        Update: {
          id?: string
          image_url?: string | null
          is_active?: boolean
          parent_id?: string | null
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      category_translations: {
        Row: {
          category_id: string
          description: string | null
          id: string
          language_code: string
          name: string
        }
        Insert: {
          category_id: string
          description?: string | null
          id?: string
          language_code: string
          name: string
        }
        Update: {
          category_id?: string
          description?: string | null
          id?: string
          language_code?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_translations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_translations_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
        ]
      }
      collection_products: {
        Row: {
          collection_id: string
          product_id: string
          sort_order: number
        }
        Insert: {
          collection_id: string
          product_id: string
          sort_order?: number
        }
        Update: {
          collection_id?: string
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "collection_products_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_translations: {
        Row: {
          collection_id: string
          description: string | null
          id: string
          language_code: string
          meta_title: string | null
          name: string
        }
        Insert: {
          collection_id: string
          description?: string | null
          id?: string
          language_code: string
          meta_title?: string | null
          name: string
        }
        Update: {
          collection_id?: string
          description?: string | null
          id?: string
          language_code?: string
          meta_title?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_translations_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_translations_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
        ]
      }
      collections: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      configurator_option_translations: {
        Row: {
          description: string | null
          id: string
          language_code: string
          name: string
          option_id: string
        }
        Insert: {
          description?: string | null
          id?: string
          language_code: string
          name: string
          option_id: string
        }
        Update: {
          description?: string | null
          id?: string
          language_code?: string
          name?: string
          option_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "configurator_option_translations_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "configurator_option_translations_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "configurator_options"
            referencedColumns: ["id"]
          },
        ]
      }
      configurator_options: {
        Row: {
          id: string
          is_active: boolean
          option_group: string
          option_key: string
          preview_image_url: string | null
          price_adjustment: number
          product_id: string
          sort_order: number
        }
        Insert: {
          id?: string
          is_active?: boolean
          option_group: string
          option_key: string
          preview_image_url?: string | null
          price_adjustment?: number
          product_id: string
          sort_order?: number
        }
        Update: {
          id?: string
          is_active?: boolean
          option_group?: string
          option_key?: string
          preview_image_url?: string | null
          price_adjustment?: number
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "configurator_options_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          locale: string | null
          message: string
          name: string
          phone: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          locale?: string | null
          message: string
          name: string
          phone?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          locale?: string | null
          message?: string
          name?: string
          phone?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          min_order_amount: number | null
          type: string
          used_count: number
          value: number
        }
        Insert: {
          code: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_order_amount?: number | null
          type: string
          used_count?: number
          value: number
        }
        Update: {
          code?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_order_amount?: number | null
          type?: string
          used_count?: number
          value?: number
        }
        Relationships: []
      }
      languages: {
        Row: {
          code: string
          flag_url: string | null
          is_active: boolean
          is_default: boolean
          name: string
          sort_order: number
        }
        Insert: {
          code: string
          flag_url?: string | null
          is_active?: boolean
          is_default?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          code?: string
          flag_url?: string | null
          is_active?: boolean
          is_default?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      mirror_size_sessions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          measurements: Json | null
          payload: Json | null
          product_id: string | null
          profile_id: string | null
          session_token: string
          sku: string | null
          source: string
          user_session_id: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          measurements?: Json | null
          payload?: Json | null
          product_id?: string | null
          profile_id?: string | null
          session_token: string
          sku?: string | null
          source?: string
          user_session_id?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          measurements?: Json | null
          payload?: Json | null
          product_id?: string | null
          profile_id?: string | null
          session_token?: string
          sku?: string | null
          source?: string
          user_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mirror_size_sessions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mirror_size_sessions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean
          preferred_locale: string | null
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          preferred_locale?: string | null
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          preferred_locale?: string | null
          subscribed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_subscribers_preferred_locale_fkey"
            columns: ["preferred_locale"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
        ]
      }
      order_events: {
        Row: {
          created_at: string
          created_by: string | null
          data: Json | null
          id: string
          message: string
          order_id: string
          type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data?: Json | null
          id?: string
          message: string
          order_id: string
          type: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data?: Json | null
          id?: string
          message?: string
          order_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          configuration: Json
          id: string
          mirror_size_session_id: string | null
          mirror_size_user_session_id: string | null
          order_id: string
          product_id: string | null
          product_snapshot: Json
          quantity: number
          total_price: number
          unit_price: number
          variant_id: string | null
        }
        Insert: {
          configuration?: Json
          id?: string
          mirror_size_session_id?: string | null
          mirror_size_user_session_id?: string | null
          order_id: string
          product_id?: string | null
          product_snapshot: Json
          quantity: number
          total_price: number
          unit_price: number
          variant_id?: string | null
        }
        Update: {
          configuration?: Json
          id?: string
          mirror_size_session_id?: string | null
          mirror_size_user_session_id?: string | null
          order_id?: string
          product_id?: string | null
          product_snapshot?: Json
          quantity?: number
          total_price?: number
          unit_price?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_mirror_size_session_id_fkey"
            columns: ["mirror_size_session_id"]
            isOneToOne: false
            referencedRelation: "mirror_size_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json
          cancelled_at: string | null
          cart_id: string | null
          coupon_id: string | null
          created_at: string
          currency: string
          discount_amount: number
          email: string | null
          fulfillment_status: string
          id: string
          locale: string | null
          notes: string | null
          order_number: string
          paid_at: string | null
          payment_method: string | null
          profile_id: string | null
          refunded_amount: number
          shipped_at: string | null
          shipping_address: Json
          shipping_amount: number
          shipping_method_id: string | null
          source: string
          status: string
          stock_committed: boolean
          stripe_payment_intent_id: string | null
          stripe_payment_status: string | null
          subtotal: number
          tax_amount: number
          total_amount: number
          tracking_carrier: string | null
          tracking_number: string | null
          tracking_url: string | null
          updated_at: string
        }
        Insert: {
          billing_address?: Json
          cancelled_at?: string | null
          cart_id?: string | null
          coupon_id?: string | null
          created_at?: string
          currency?: string
          discount_amount?: number
          email?: string | null
          fulfillment_status?: string
          id?: string
          locale?: string | null
          notes?: string | null
          order_number?: string
          paid_at?: string | null
          payment_method?: string | null
          profile_id?: string | null
          refunded_amount?: number
          shipped_at?: string | null
          shipping_address: Json
          shipping_amount?: number
          shipping_method_id?: string | null
          source?: string
          status?: string
          stock_committed?: boolean
          stripe_payment_intent_id?: string | null
          stripe_payment_status?: string | null
          subtotal: number
          tax_amount?: number
          total_amount: number
          tracking_carrier?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
        }
        Update: {
          billing_address?: Json
          cancelled_at?: string | null
          cart_id?: string | null
          coupon_id?: string | null
          created_at?: string
          currency?: string
          discount_amount?: number
          email?: string | null
          fulfillment_status?: string
          id?: string
          locale?: string | null
          notes?: string | null
          order_number?: string
          paid_at?: string | null
          payment_method?: string | null
          profile_id?: string | null
          refunded_amount?: number
          shipped_at?: string | null
          shipping_address?: Json
          shipping_amount?: number
          shipping_method_id?: string | null
          source?: string
          status?: string
          stock_committed?: boolean
          stripe_payment_intent_id?: string | null
          stripe_payment_status?: string | null
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          tracking_carrier?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_shipping_method_id_fkey"
            columns: ["shipping_method_id"]
            isOneToOne: false
            referencedRelation: "shipping_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          id: string
          is_primary: boolean
          product_id: string
          sort_order: number
          url: string
          variant_color: string | null
        }
        Insert: {
          alt_text?: string | null
          id?: string
          is_primary?: boolean
          product_id: string
          sort_order?: number
          url: string
          variant_color?: string | null
        }
        Update: {
          alt_text?: string | null
          id?: string
          is_primary?: boolean
          product_id?: string
          sort_order?: number
          url?: string
          variant_color?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_tags: {
        Row: {
          product_id: string
          tag_id: string
        }
        Insert: {
          product_id: string
          tag_id: string
        }
        Update: {
          product_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_tags_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      product_translations: {
        Row: {
          care_instructions: string[]
          delivery_time: string | null
          description: string | null
          details: string[]
          fabric_info: string | null
          id: string
          language_code: string
          meta_description: string | null
          meta_title: string | null
          name: string
          product_id: string
          short_description: string | null
        }
        Insert: {
          care_instructions?: string[]
          delivery_time?: string | null
          description?: string | null
          details?: string[]
          fabric_info?: string | null
          id?: string
          language_code: string
          meta_description?: string | null
          meta_title?: string | null
          name: string
          product_id: string
          short_description?: string | null
        }
        Update: {
          care_instructions?: string[]
          delivery_time?: string | null
          description?: string | null
          details?: string[]
          fabric_info?: string | null
          id?: string
          language_code?: string
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          product_id?: string
          short_description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_translations_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "product_translations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          attributes: Json
          compare_at_price: number | null
          id: string
          is_active: boolean
          price: number | null
          product_id: string
          sku: string
          stock_quantity: number
        }
        Insert: {
          attributes?: Json
          compare_at_price?: number | null
          id?: string
          is_active?: boolean
          price?: number | null
          product_id: string
          sku: string
          stock_quantity?: number
        }
        Update: {
          attributes?: Json
          compare_at_price?: number | null
          id?: string
          is_active?: boolean
          price?: number | null
          product_id?: string
          sku?: string
          stock_quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          badge: string | null
          base_price: number
          category_id: string | null
          compare_at_price: number | null
          created_at: string
          id: string
          is_active: boolean
          is_featured: boolean
          meta: Json | null
          mirror_size_data: Json | null
          mirror_size_product_id: string | null
          mirror_size_synced_at: string | null
          sizes: string[]
          sku: string
          slug: string
          type: string
          updated_at: string
          weight_grams: number | null
        }
        Insert: {
          badge?: string | null
          base_price: number
          category_id?: string | null
          compare_at_price?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_featured?: boolean
          meta?: Json | null
          mirror_size_data?: Json | null
          mirror_size_product_id?: string | null
          mirror_size_synced_at?: string | null
          sizes?: string[]
          sku: string
          slug: string
          type?: string
          updated_at?: string
          weight_grams?: number | null
        }
        Update: {
          badge?: string | null
          base_price?: number
          category_id?: string | null
          compare_at_price?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_featured?: boolean
          meta?: Json | null
          mirror_size_data?: Json | null
          mirror_size_product_id?: string | null
          mirror_size_synced_at?: string | null
          sizes?: string[]
          sku?: string
          slug?: string
          type?: string
          updated_at?: string
          weight_grams?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          mirror_size_profile_id: string | null
          phone: string | null
          preferred_locale: string | null
          role: string
          stripe_customer_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          mirror_size_profile_id?: string | null
          phone?: string | null
          preferred_locale?: string | null
          role?: string
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          mirror_size_profile_id?: string | null
          phone?: string | null
          preferred_locale?: string | null
          role?: string
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_preferred_locale_fkey"
            columns: ["preferred_locale"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
        ]
      }
      reviews: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_approved: boolean
          is_verified_purchase: boolean
          product_id: string
          profile_id: string
          rating: number
          title: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          is_verified_purchase?: boolean
          product_id: string
          profile_id: string
          rating: number
          title?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          is_verified_purchase?: boolean
          product_id?: string
          profile_id?: string
          rating?: number
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          group_name: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          group_name?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          group_name?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      shipping_methods: {
        Row: {
          base_cost: number
          carrier: string | null
          id: string
          is_active: boolean
          max_days: number | null
          min_days: number | null
          name: string
        }
        Insert: {
          base_cost?: number
          carrier?: string | null
          id?: string
          is_active?: boolean
          max_days?: number | null
          min_days?: number | null
          name: string
        }
        Update: {
          base_cost?: number
          carrier?: string | null
          id?: string
          is_active?: boolean
          max_days?: number | null
          min_days?: number | null
          name?: string
        }
        Relationships: []
      }
      shipping_zones: {
        Row: {
          country_code: string
          extra_cost: number
          id: string
          region: string | null
          shipping_method_id: string
        }
        Insert: {
          country_code: string
          extra_cost?: number
          id?: string
          region?: string | null
          shipping_method_id: string
        }
        Update: {
          country_code?: string
          extra_cost?: number
          id?: string
          region?: string | null
          shipping_method_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipping_zones_shipping_method_id_fkey"
            columns: ["shipping_method_id"]
            isOneToOne: false
            referencedRelation: "shipping_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_events: {
        Row: {
          created_at: string
          id: string
          payload: Json
          processed: boolean
          stripe_event_id: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          payload: Json
          processed?: boolean
          stripe_event_id: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          payload?: Json
          processed?: boolean
          stripe_event_id?: string
          type?: string
        }
        Relationships: []
      }
      tag_translations: {
        Row: {
          id: string
          language_code: string
          name: string
          tag_id: string
        }
        Insert: {
          id?: string
          language_code: string
          name: string
          tag_id: string
        }
        Update: {
          id?: string
          language_code?: string
          name?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tag_translations_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "tag_translations_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          id: string
          slug: string
        }
        Insert: {
          id?: string
          slug: string
        }
        Update: {
          id?: string
          slug?: string
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          added_at: string
          product_id: string
          profile_id: string
        }
        Insert: {
          added_at?: string
          product_id: string
          profile_id: string
        }
        Update: {
          added_at?: string
          product_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      mark_order_paid: {
        Args: { p_payment_intent_id: string; p_payment_method?: string }
        Returns: string
      }
      mark_order_paid_manual: {
        Args: { p_order_id: string; p_payment_method?: string }
        Returns: string
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
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
    Enums: {},
  },
} as const

