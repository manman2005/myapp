"use client";

import { Button } from "@/components/ui/button";
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

export default function CustomersPage() {
  const router = useRouter();
  const { state: { customers } } = useCustomer();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">รายชื่อลูกค้า</h1>
        <Button 
          variant="primary" 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => router.push("/customers/new")}
        >
          เพิ่มลูกค้าใหม่
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รหัสลูกค้า</TableHead>
              <TableHead>ชื่อ-นามสกุล</TableHead>
              <TableHead>อีเมล</TableHead>
              <TableHead>เบอร์โทรศัพท์</TableHead>
              <TableHead>จำนวนงานซ่อม</TableHead>
              <TableHead>วันที่สมัคร</TableHead>
              <TableHead>การดำเนินการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.fullName}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.workOrders?.length || 0}</TableCell>
                <TableCell>
                  {new Date(customer.createdAt).toLocaleDateString("th-TH")}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/customers/${customer.id}`)}
                  >
                    ดูรายละเอียด
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 