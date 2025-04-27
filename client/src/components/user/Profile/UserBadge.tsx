import { useState, useEffect } from "react";
import BadgeCard from "./BadgeCard";
import { fetchNonAcquiredBadges, fetchUserBadges } from "@/services/user/user.badge.service";
import toast from "react-hot-toast";

interface Badge {
  _id: string;
  name: string;
  image: string;
  requiredXp: number;
  isListed: boolean;
  created_at: string;
  updated_at: string;
}

export default function UserBadges({ userId }: { userId: string }) {
  const [badges, setBadges] = useState<
    Array<{
      badge: Badge;
      acquired: boolean;
      current: boolean;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchBadgesData = async () => {
    setLoading(true);
    try {
      const { acquiredBadges, currentBadge } = await fetchUserBadges(userId);
      const nonAcquiredBadges = await fetchNonAcquiredBadges(userId);

      const allBadges = [
        ...acquiredBadges.map((badge) => ({
          badge,
          acquired: true,
          current: currentBadge?._id === badge._id,
        })),
        ...nonAcquiredBadges.map((badge) => ({
          badge,
          acquired: false,
          current: false,
        })),
      ];

      const sortedBadges = allBadges
        .sort((a, b) => b.badge.requiredXp - a.badge.requiredXp);

      setBadges(sortedBadges);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load badges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBadgesData();
    }
  }, [userId]);

  return (
    <div className="md:col-span-2">
      <h2 className="text-xl font-semibold mb-4">Badges</h2>
      {loading ? (
        <p>Loading badges...</p>
      ) : badges.length === 0 ? (
        <p>No badges available</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map(({ badge, acquired, current }) => (
            <BadgeCard
              key={badge._id}
              badge={badge}
              acquired={acquired}
              current={current}
              onBadgeUpdate={fetchBadgesData}
            />
          ))}
        </div>
      )}
    </div>
  );
}