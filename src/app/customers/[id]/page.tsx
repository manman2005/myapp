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
import { useWorkOrders } from "@/contexts/WorkOrderContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CustomerDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { getCustomer } = useCustomer();
  const id = React.use(params).id;
  const customer = getCustomer(id);

  if (!customer) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>ไม่พบข้อมูล</CardTitle>
            <CardDescription>ไม่พบข้อมูลลูกค้าที่ต้องการ</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.back()}>ย้อนกลับ</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>ข้อมูลลูกค้า {customer.id}</CardTitle>
              <CardDescription>
                สมัครเมื่อ: {new Date(customer.createdAt).toLocaleDateString("th-TH")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">ข้อมูลส่วนตัว</h3>
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
            <h3 className="text-lg font-semibold mb-4">ประวัติการซ่อม</h3>
            {customer.workOrders && customer.workOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        รหัสงาน
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        วันที่
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        สถานะ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        การดำเนินการ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.workOrders.map((order: any) => (
                      <tr key={order.id} className="border-b">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(order.createdAt).toLocaleDateString("th-TH")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {order.status}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link
                            href={`/work-orders/${order.id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ดูรายละเอียด
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">ยังไม่มีประวัติการซ่อม</p>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" onClick={() => router.back()}>
              ย้อนกลับ
            </Button>
            <Button onClick={() => router.push(`/customers/${id}/edit`)}>
              แก้ไขข้อมูล
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 