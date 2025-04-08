import {
  MessageSquare,
  Check,
  Play,
  AlertTriangle,
} from "lucide-react";


interface NotificationsPanelProps {
  onClose: () => void;
}

export default function NotificationsPanel({ onClose }: NotificationsPanelProps) {
  return (
    <div className="absolute left-15 bottom-0 top-0 z-50 w-80 bg-white border shadow-lg rounded-r-lg max-h-screen overflow-y-auto"
    style={{
      transform: "translateX(0)",
      animation: "slideIn 0.3s ease-in-out",
    }}
    >
      <div className="p-5 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Notification</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close notifications"
        >
          ✕
        </button>
      </div>

      <div className="divide-y">
        {/* Gift notification */}
        <div className="p-3 flex items-start">
          <div className="w-8 h-8 flex items-center justify-center mr-3 text-purple-600">
            <div className="w-6 h-6 border-2 border-current flex items-center justify-center">
              <div className="w-6 h-0.5 bg-current absolute"></div>
              <div className="w-0.5 h-6 bg-current absolute"></div>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm">
              you got 10 <span className="text-yellow-500">🔗</span> coin as gift
            </p>
            <p className="text-xs text-right text-gray-500">from Adhnan</p>
          </div>
        </div>

        {/* Connected notification */}
        <div className="p-3 flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 mr-3"></div>
          <div className="flex-1">
            <div className="flex items-center">
              <span className="text-sm font-medium">Adhnan P</span>
              <div className="ml-1 w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                <Check className="w-2 h-2 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500">Connected with you</div>
        </div>

        {/* Community notifications */}
        <div className="p-3 flex items-start">
          <div className="w-8 h-8 flex items-center justify-center mr-3">
            <MessageSquare className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm">
              new member joined in you community{" "}
              <span className="font-medium">Debuggers</span>
            </p>
          </div>
        </div>

        <div className="p-3 flex items-start">
          <div className="w-8 h-8 flex items-center justify-center mr-3">
            <MessageSquare className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm">
              you got accepted in <span className="font-medium">Debuggers</span>
            </p>
          </div>
        </div>

        {/* Question notifications */}
        <div className="p-3 flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 mr-3"></div>
          <div className="flex-1">
            <div className="flex items-center">
              <span className="text-sm font-medium">Adhnan P</span>
              <div className="ml-1 w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                <Check className="w-2 h-2 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500">answered your Question</div>
        </div>

        <div className="p-3 flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 mr-3"></div>
          <div className="flex-1">
            <div className="flex items-center">
              <span className="text-sm font-medium">Adhnan P</span>
              <div className="ml-1 w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                <Check className="w-2 h-2 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500">upvoted your answer</div>
        </div>

        {/* Meeting notifications */}
        <div className="p-3 flex items-start">
          <div className="w-8 h-8 flex items-center justify-center mr-3">
            <div className="w-5 h-5 bg-gray-800 rounded-sm flex items-center justify-center">
              <Play className="w-3 h-3 text-white ml-0.5" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm">
              random meeting name{" "}
              <span className="bg-green-500 text-white text-xs px-1 rounded">
                now
              </span>{" "}
              <span className="text-yellow-500">🔗</span>10
            </p>
            <div className="flex items-center mt-1">
              <div className="w-4 h-4 rounded-full bg-gray-500 mr-1"></div>
              <span className="text-xs">safwan</span>
            </div>
          </div>
        </div>

        <div className="p-3 flex items-start">
          <div className="w-8 h-8 flex items-center justify-center mr-3">
            <div className="w-5 h-5 bg-gray-800 rounded-sm flex items-center justify-center">
              <Play className="w-3 h-3 text-white ml-0.5" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm">random meeting name</p>
            <div className="flex items-center mt-1">
              <div className="w-4 h-4 rounded-full bg-gray-500 mr-1"></div>
              <span className="text-xs">safwan</span>
              <span className="text-xs text-gray-500 ml-1">created a meeting</span>
            </div>
          </div>
        </div>

        {/* Report notification */}
        <div className="p-3 flex items-start">
          <div className="w-8 h-8 flex items-center justify-center mr-3 text-yellow-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm">you got report For Question ..</p>
          </div>
        </div>
      </div>
    </div>
  );
}