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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  customerId: z.string({
    required_error: "กรุณาเลือกลูกค้า",
  }),
  title: z.string().min(2, {
    message: "กรุณาระบุหัวข้องาน",
  }),
  description: z.string().min(10, {
    message: "กรุณาระบุรายละเอียดงาน",
  }),
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
  estimatedCost: z.coerce.number().min(0, {
    message: "กรุณาระบุค่าซ่อมโดยประมาณ",
  }),
  notes: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
});

export default function NewWorkOrderPage() {
  const router = useRouter();
  const { state: { customers } } = useCustomer();
  const { createWorkOrder, error } = useWorkOrder();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
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
      estimatedCost: 0,
      notes: "",
      priority: "MEDIUM",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session?.user?.id) {
      toast.error("กรุณาเข้าสู่ระบบก่อนทำรายการ");
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await addWorkOrder({
        ...values,
        status: "PENDING",
        priority: values.priority,
        createdById: session.user.id,
        startDate: null,
        endDate: null,
        amount: values.estimatedCost,
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

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>เพิ่มงานซ่อมใหม่</CardTitle>
          <CardDescription>กรอกข้อมูลงานซ่อมเพื่อเพิ่มในระบบ</CardDescription>
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
                            {customer.fullName}
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
                name="estimatedCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ค่าซ่อมโดยประมาณ (บาท)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>หมายเหตุ</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="บันทึกเพิ่มเติม (ถ้ามี)"
                        className="min-h-[100px]"
                        {...field}
                      />
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