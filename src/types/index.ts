export interface Blog {
  id: string;
  title: string;
  slug: string;
  // ... baqi fields ...
  reading_time?: string; // <-- '?' lagane se optional ho jayegi
}