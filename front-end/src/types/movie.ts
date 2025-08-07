export interface Review {
  id: number;
  text: string; 
  rating: number;
  username?: string;
}

export interface Availability {
    streaming?: string[];
    rent?: string[];
    purchase?: string[];
}


export interface Movie {
  id: number;
  name: string;
  year: number;
  director?: string;
  description?: string;
  bannerURL?: string;
  averageRating?: number; 
  reviews?: Review[];      
  tags?: string[];
  availability?: Availability | null;
}