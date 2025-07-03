// app/work-orders/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function WorkOrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const workOrder = await prisma.workOrder.findUnique({
    where: { id: params.id },
    include: {
      assignedTo: true,
      createdBy: true,
    },
  });

  if (!workOrder) notFound();

  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "รอดำเนินการ", color: "bg-yellow-600 text-white" },
    in_progress: { label: "กำลังดำเนินการ", color: "bg-blue-600 text-white" },
    completed: { label: "เสร็จสิ้น", color: "bg-green-600 text-white" },
    cancelled: { label: "ยกเลิก", color: "bg-red-600 text-white" },
  };
  const status = statusMap[workOrder.status] || { label: workOrder.status, color: "bg-gray-600 text-white" };

  return (  
    <div className="min-h-screen bg-[#151b27] py-10">
      <div className="max-w-3xl mx-auto bg-[#232b3e] rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">
            งานซ่อม #{workOrder.id} - {workOrder.title}
          </h1>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${status.color}`}>
            {status.label}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="font-bold text-lg mb-2 text-white">ข้อมูลอุปกรณ์</h2>
            <div className="space-y-1 text-gray-200">
              <div>ประเภท: <span className="font-semibold">{workOrder.deviceType}</span></div>
              <div>ยี่ห้อ: <span className="font-semibold">{workOrder.brand}</span></div>
              <div>รุ่น: <span className="font-semibold">{workOrder.model}</span></div>
              <div>หมายเลขเครื่อง: <span className="font-semibold">{workOrder.serialNumber}</span></div>
            </div>
          </div>
          <div>
            <h2 className="font-bold text-lg mb-2 text-white">ข้อมูลอื่นๆ</h2>
            <div className="space-y-1 text-gray-200">
              <div>ระดับความสำคัญ: <span className="font-semibold">{workOrder.priority}</span></div>
              <div>โดย: <span className="font-semibold">{workOrder.createdBy?.fullName || "-"}</span></div>
              <div>วันที่เริ่ม: <span className="font-semibold">{workOrder.startDate ? new Date(workOrder.startDate).toLocaleDateString("th-TH") : "-"}</span></div>
              <div>วันที่สิ้นสุด: <span className="font-semibold">{workOrder.endDate ? new Date(workOrder.endDate).toLocaleDateString("th-TH") : "-"}</span></div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-bold text-lg mb-2 text-white">รายละเอียดการซ่อม</h2>
          <div className="bg-[#1a2132] rounded p-4 mb-2 text-gray-200">
            <span className="font-semibold">ปัญหา:</span> {workOrder.problem}
          </div>
          <div className="text-right text-lg font-bold text-green-400">
            ค่าใช้จ่าย: {workOrder.amount?.toLocaleString() || "-"} บาท
          </div>
        </div>

        <div className="flex justify-end">
          <a
            href={`/work-orders/${workOrder.id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-bold"
          >
            แก้ไขข้อมูล
          </a>
        </div>
      </div>
    </div>
  );
}
