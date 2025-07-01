"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCustomer } from "@/contexts/CustomerContext";
import { useWorkOrder } from '@/contexts/WorkOrderContext'
import { useRouter } from "next/navigation";

export default function WorkOrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { getWorkOrder } = useWorkOrder();
  const { getCustomer } = useCustomer();
  const id = React.use(params).id;
  const workOrder = getWorkOrder(id);
  const customer = workOrder ? getCustomer(workOrder.customerId) : null;

  if (!workOrder || !customer) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>ไม่พบข้อมูล</CardTitle>
            <CardDescription>ไม่พบข้อมูลงานซ่อมที่ต้องการ</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.back()}>ย้อนกลับ</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "รอดำเนินการ";
      case "in_progress":
        return "กำลังดำเนินการ";
      case "completed":
        return "เสร็จสิ้น";
      case "cancelled":
        return "ยกเลิก";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>รายละเอียดงานซ่อม {workOrder.id}</CardTitle>
              <CardDescription>
                วันที่รับงาน:{" "}
                {new Date(workOrder.createdAt).toLocaleDateString("th-TH")}
              </CardDescription>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                workOrder.status
              )}`}
            >
              {getStatusText(workOrder.status)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">ข้อมูลลูกค้า</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">ชื่อ-นามสกุล:</span>{" "}
                  {customer.fullName}
                </p>
                <p>
                  <span className="font-medium">อีเมล:</span> {customer.email}
                </p>
                <p>
                  <span className="font-medium">เบอร์โทรศัพท์:</span>{" "}
                  {customer.phone}
                </p>
                <p>
                  <span className="font-medium">ที่อยู่:</span> {customer.address}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">ข้อมูลอุปกรณ์</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">ประเภท:</span>{" "}
                  {workOrder.deviceType}
                </p>
                <p>
                  <span className="font-medium">ยี่ห้อ:</span> {workOrder.brand}
                </p>
                <p>
                  <span className="font-medium">รุ่น:</span> {workOrder.model}
                </p>
                <p>
                  <span className="font-medium">หมายเลขเครื่อง:</span>{" "}
                  {workOrder.serialNumber}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">รายละเอียดการซ่อม</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium">อาการเสีย/ปัญหา:</p>
                <p className="mt-1 p-4 bg-gray-50 rounded-md">
                  {workOrder.problem}
                </p>
              </div>
              {workOrder.notes && (
                <div>
                  <p className="font-medium">หมายเหตุ:</p>
                  <p className="mt-1 p-4 bg-gray-50 rounded-md">
                    {workOrder.notes}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">ค่าซ่อมโดยประมาณ:</p>
                  <p className="mt-1 text-lg">
                    {workOrder.estimatedCost.toLocaleString()} บาท
                  </p>
                </div>
                <div>
                  <p className="font-medium">ค่าซ่อมจริง:</p>
                  <p className="mt-1 text-lg">
                    {workOrder.actualCost.toLocaleString()} บาท
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" onClick={() => router.back()}>
              ย้อนกลับ
            </Button>
            <Button onClick={() => router.push(`/work-orders/${id}/edit`)}>
              แก้ไขข้อมูล
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 