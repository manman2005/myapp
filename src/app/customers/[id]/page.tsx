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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCustomer } from "@/contexts/CustomerContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function CustomerDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { getCustomer } = useCustomer();
  const id = React.use(params).id;
  const [customerData, setCustomerData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      const fetchedCustomer = await getCustomer(id);
      setCustomerData(fetchedCustomer);
      setLoading(false);
    };
    fetchCustomer();
  }, [id, getCustomer]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center min-h-[calc(100vh-100px)]">
        <LoadingSpinner />
        <p className="ml-2 text-gray-700 dark:text-gray-300">กำลังโหลดข้อมูลลูกค้า...</p>
      </div>
    );
  }

  const customer = customerData;

  if (!customer) {
    return (
      <div className="container mx-auto py-10">
        <Card className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <CardHeader>
            <CardTitle>ไม่พบข้อมูล</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">ไม่พบข้อมูลลูกค้าที่ต้องการ</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.back()} className="bg-blue-600 hover:bg-blue-700 text-white">ย้อนกลับ</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <div>
              <CardTitle className="text-2xl font-bold">ข้อมูลลูกค้า</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                รหัสลูกค้า: {customer.id} | สมัครเมื่อ:{" "}
                {new Date(customer.createdAt).toLocaleDateString("th-TH")}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => router.back()} className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                ย้อนกลับ
              </Button>
              <Button onClick={() => router.push(`/customers/${id}/edit`)} className="bg-blue-600 hover:bg-blue-700 text-white">
                แก้ไขข้อมูล
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <section>
            <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">ข้อมูลส่วนตัว</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="font-medium text-gray-600 dark:text-gray-400">ชื่อ-นามสกุล:</span>
                <span className="text-lg font-semibold">{customer.name}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-600 dark:text-gray-400">อีเมล:</span>
                <span className="text-lg font-semibold">{customer.email || '-'}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-600 dark:text-gray-400">เบอร์โทรศัพท์:</span>
                <span className="text-lg font-semibold">{customer.phone || '-'}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-600 dark:text-gray-400">ที่อยู่:</span>
                <span className="text-lg font-semibold">{customer.address || '-'}</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">ประวัติการซ่อม</h3>
            {customer.workOrders && customer.workOrders.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-700">
                      <TableHead className="w-[100px]">รหัสงาน</TableHead>
                      <TableHead>วันที่</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead className="text-right">การดำเนินการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customer.workOrders.map((order: any) => (
                      <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString("th-TH")}</TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell className="text-right">
                          <Link
                            href={`/work-orders/${order.id}`}
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-9 px-4 py-2"
                          >
                            ดูรายละเอียด
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">ยังไม่มีประวัติการซ่อมสำหรับลูกค้ารายนี้</p>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
