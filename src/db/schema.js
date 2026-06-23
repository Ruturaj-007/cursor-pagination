import { pgTable, uuid, varchar, numeric, timestamp, index } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id:         uuid('id').primaryKey().defaultRandom(),

  name:       varchar('name', {
     length: 255 
  }).notNull(),

  category:   varchar('category', { 
    length: 100
  }).notNull(),

  price:      numeric('price', {
    precision: 10, scale: 2 
  }).notNull(),

  created_at: timestamp('created_at', {
    withTimezone: true 
  }).defaultNow().notNull(),

  updated_at: timestamp('updated_at', { 
    withTimezone: true
  }).defaultNow().notNull(),

}, (t) => ({
  
  // * Show newest products first DB finds product faster reduces scanning of huge portions   
  // * Reduces DB confusion of same timestamp created_at DESC, id DESC
  idx_created_id:          index('idx_created_id').on(t.created_at.desc(), t.id.desc()),

  // * Filter by category 
  idx_category_created_id: index('idx_category_created_id').on(t.category, t.created_at.desc(), t.id.desc()),
}));