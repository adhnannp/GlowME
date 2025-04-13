import { IBadge } from "../../models/Badge";

export interface SafeBadge {
    badges: {
      badgeId: IBadge;
      acquiredAt: Date;
    }[];
    currentBadge: IBadge;
}