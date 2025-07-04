import { UserWithBadge } from "./auth.interface";
import { Tag } from "./user.tag.interface";

export interface SimilarQuestion{ 
    id: string; 
    title: string; 
    description:string; 
    slug: string 
}


export interface Question{
  _id: string;
  title: string;
  slug: string;
  createdBy: UserWithBadge
  header_image?: string;
  document?: string;
  description: string;
  type: 'descriptive' | 'bounty';
  bounty_coin?: number;
  embedding: number[];
  tags?: Tag[];
  isListed: boolean;
  is_archive?: boolean;
  created_at: string;
  edited_at: string; 
}