export interface Series {
  series_id: string;
  name: string;
  cover?: string;
  category_id: string;
  rating?: number;
}

export interface Category {
  category_id: string;
  category_name: string;
}
