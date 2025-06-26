import React, { useEffect, useState, useRef } from 'react';
import { Check } from 'lucide-react';
import { fetchNotifications } from '@/services/user/user.notification.service';
import { ConnectionNotification } from '@/interfaces/notification';

interface NotificationsPanelProps {
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose }) => {
  const [notifications, setNotifications] = useState<ConnectionNotification[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadNotifications = async (pageNum: number) => {
    if (loading || error) return;

    setLoading(true);
    setError(null);
    try {
      const newNotifications = await fetchNotifications(pageNum);
      if (newNotifications.length < 30) {
        setHasMore(false);
      }
      setNotifications((prev) => (pageNum === 1 ? newNotifications : [...prev, ...newNotifications]));
    } catch (error) {
      setError('Failed to load notifications.');
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications(page);
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !error) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, loading, error]);

  const handleRetry = () => {
    setError(null);
    setPage(1);
    loadNotifications(1);
  };

  return (
    <div
      className="absolute left-15 bottom-0 top-0 z-50 w-80 bg-white border shadow-lg rounded-r-lg max-h-screen overflow-y-auto"
      style={{
        transform: 'translateX(0)',
        animation: 'slideIn 0.3s ease-in-out',
      }}
    >
      <div className="p-5 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close notifications"
        >
          ✕
        </button>
      </div>

      <div className="divide-y">
        {error && (
          <div className="p-3 text-center text-red-500">
            {error}
            <button
              onClick={handleRetry}
              className="ml-2 text-blue-500 hover:text-blue-700 text-sm underline"
            >
              Retry
            </button>
          </div>
        )}
        {notifications.length === 0 && !loading && !error && (
          <div className="p-3 text-center text-gray-500">No notifications</div>
        )}
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className={`p-3 flex items-center ${notification.is_read ? 'bg-gray-50' : 'bg-white'}`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 mr-3">
              {notification?.related_user?.profile_image ? (
                <img
                  src={notification.related_user.profile_image}
                  alt={notification.related_user.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : null}
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <span className="text-sm font-medium">{notification?.related_user?.username}</span>
                <div className="ml-1 w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <Check className="w-2 h-2 text-blue-500" />
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500">{notification.message}</div>
          </div>
        ))}
        {hasMore && !error && (
          <div ref={loaderRef} className="p-3 text-center">
            {loading ? (
              <span className="text-gray-500">Loading...</span>
            ) : (
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                Load More
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;