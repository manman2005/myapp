"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCustomer } from "@/contexts/CustomerContext";
import { useWorkOrder } from '@/contexts/WorkOrderContext'
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { WorkOrder } from '@prisma/client'; // Import WorkOrder type

const formSchema = z.object({
  customerId: z.string({
    required_error: "กรุณาเลือกลูกค้า",
  }),
  title: z.string().min(2, {
    message: "กรุณาระบุหัวข้องาน",
  }),
  description: z.string().optional(), // Changed to optional
  deviceType: z.string().min(2, {
    message: "กรุณาระบุประเภทอุปกรณ์",
  }),
  brand: z.string().min(2, {
    message: "กรุณาระบุยี่ห้อ",
  }),
  model: z.string().min(2, {
    message: "กรุณาระบุรุ่น",
  }),
  serialNumber: z.string().min(2, {
    message: "กรุณาระบุหมายเลขเครื่อง",
  }),
  problem: z.string().min(10, {
    message: "กรุณาอธิบายปัญหาอย่างน้อย 10 ตัวอักษร",
  }),
  amount: z.coerce.number().min(0, { // Changed from estimatedCost to amount
    message: "กรุณาระบุค่าซ่อม",
  }).optional(), // Made optional
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).default('PENDING'), // Added status
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type WorkOrderFormData = z.infer<typeof formSchema>;

export default function EditWorkOrderPage({ params: unwrappedParams }: { params: Promise<{ id: string }> }) {
  const params = React.use(unwrappedParams);
  const router = useRouter();
  const { state: { customers } } = useCustomer();
  const { updateWorkOrder, error } = useWorkOrder(); // Assuming useWorkOrder has updateWorkOrder
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<WorkOrderFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: "",
      title: "",
      description: "",
      deviceType: "",
      brand: "",
      model: "",
      serialNumber: "",
      problem: "",
      amount: 0,
      priority: "MEDIUM",
      status: "PENDING",
      startDate: "",
      endDate: "",
    },
  });

  useEffect(() => {
    const fetchWorkOrder = async () => {
      try {
        const res = await fetch(`/api/work-orders/${params.id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch work order');
        }
        const data: WorkOrder = await res.json();
        setWorkOrder(data);
        form.reset({
          ...data,
          startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
          endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
          amount: data.amount || 0,
        });
      } catch (err) {
        toast.error('ไม่สามารถโหลดข้อมูลงานซ่อมได้');
        router.push('/work-orders');
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkOrder();
  }, [params.id, router, form]);

  async function onSubmit(values: WorkOrderFormData) {
    if (!session?.user?.id) {
      toast.error("กรุณาเข้าสู่ระบบก่อนทำรายการ");
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await updateWorkOrder(params.id, { // Assuming updateWorkOrder takes id and data
        ...values,
        startDate: values.startDate ? new Date(values.startDate) : null,
        endDate: values.endDate ? new Date(values.endDate) : null,
        amount: values.amount || null,
      });

      if (success) {
        toast.success("บันทึกงานซ่อมสำเร็จ");
        router.push("/work-orders");
        router.refresh();
      } else {
        toast.error(error || "ไม่สามารถบันทึกงานซ่อมได้");
      }
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการบันทึกงานซ่อม");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>กำลังโหลด...</p>
      </div>
    );
  }

  if (!workOrder) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>ไม่พบงานซ่อม</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>แก้ไขงานซ่อม</CardTitle>
          <CardDescription>แก้ไขข้อมูลงานซ่อม</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ลูกค้า</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกลูกค้า" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>หัวข้องาน</FormLabel>
                    <FormControl>
                      <Input placeholder="หัวข้องานซ่อม" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>รายละเอียดงาน</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="รายละเอียดงานซ่อม"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ประเภทอุปกรณ์</FormLabel>
                    <FormControl>
                      <Input placeholder="เช่น โน้ตบุ๊ก, คอมพิวเตอร์ตั้งโต๊ะ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ยี่ห้อ</FormLabel>
                    <FormControl>
                      <Input placeholder="ยี่ห้อของอุปกรณ์" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>รุ่น</FormLabel>
                    <FormControl>
                      <Input placeholder="รุ่นของอุปกรณ์" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>หมายเลขเครื่อง</FormLabel>
                    <FormControl>
                      <Input placeholder="หมายเลขเครื่องหรือ Serial Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="problem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>อาการเสีย/ปัญหา</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="อธิบายอาการเสียหรือปัญหาที่พบ"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ค่าซ่อม (บาท)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ความสำคัญ</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกความสำคัญ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LOW">ต่ำ</SelectItem>
                        <SelectItem value="MEDIUM">ปานกลาง</SelectItem>
                        <SelectItem value="HIGH">สูง</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>สถานะ</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกสถานะ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDING">รอดำเนินการ</SelectItem>
                        <SelectItem value="IN_PROGRESS">กำลังดำเนินการ</SelectItem>
                        <SelectItem value="COMPLETED">เสร็จสิ้น</SelectItem>
                        <SelectItem value="CANCELLED">ยกเลิก</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>วันที่เริ่ม</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>วันที่เสร็จ</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                  ยกเลิก
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
