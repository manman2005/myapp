"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useCustomer } from "@/contexts/CustomerContext";
import { useRouter } from "next/navigation";

export default function CustomersPage() {
  const router = useRouter();
  const { state: { customers, loading, error }, fetchCustomers } = useCustomer();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="mb-4">
        <Input
          type="text"
          placeholder="ค้นหาลูกค้าด้วยชื่อ, อีเมล หรือเบอร์โทรศัพท์..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {loading && (
        <div className="flex justify-center items-center h-40">
          <LoadingSpinner />
          <p className="ml-2">กำลังโหลดข้อมูลลูกค้า...</p>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center py-10">
          <p>เกิดข้อผิดพลาดในการโหลดข้อมูล: {error}</p>
        </div>
      )}

      {!loading && !error && filteredCustomers.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <p>ไม่พบข้อมูลลูกค้า</p>
        </div>
      )}

      {!loading && !error && filteredCustomers.length > 0 && (
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
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.id}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.workOrders?.length || 0}</TableCell>
                  <TableCell>
                    {new Date(customer.createdAt).toLocaleDateString("th-TH")}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => router.push(`/customers/${customer.id}`)}
                    >
                      ดูรายละเอียด
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/customers/${customer.id}/edit`)}
                    >
                      แก้ไข
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
} 