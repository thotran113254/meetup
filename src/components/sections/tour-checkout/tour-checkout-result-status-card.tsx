import { CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";

type StatusConfig = {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  bgColor: string;
  title: string;
  description: string;
};

const STATUS_MAP: Record<string, StatusConfig> = {
  success: {
    icon: CheckCircle2,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
    title: "Thanh toán th��nh công!",
    description:
      "Booking của bạn đã được xác nhận. Chúng tôi sẽ liên hệ qua email và WhatsApp.",
  },
  payfail: {
    icon: XCircle,
    iconColor: "text-red-600",
    bgColor: "bg-red-50",
    title: "Thanh toán thất bại",
    description:
      "Giao dịch không thành công. Vui lòng thử lại hoặc liên hệ hỗ trợ.",
  },
  processing: {
    icon: Clock,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
    title: "Đang xử lý...",
    description: "Giao dịch đang được xử lý. Vui lòng chờ trong giây lát.",
  },
  error: {
    icon: AlertTriangle,
    iconColor: "text-red-600",
    bgColor: "bg-red-50",
    title: "Có lỗi xảy ra",
    description: "Không thể xác minh giao dịch. Vui lòng liên hệ hỗ trợ.",
  },
};

export function TourCheckoutResultStatusCard({
  status,
}: {
  status: string;
}) {
  const config = STATUS_MAP[status] || STATUS_MAP.error;
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} rounded-xl p-6 text-center`}>
      <Icon className={`w-12 h-12 mx-auto mb-3 ${config.iconColor}`} />
      <h1 className="text-xl font-bold text-[#1D1D1D] mb-2">
        {config.title}
      </h1>
      <p className="text-sm text-[#828282]">{config.description}</p>
    </div>
  );
}
