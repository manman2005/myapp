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
import { useCustomer } from "@/contexts/CustomerContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "กรุณากรอกชื่อ-นามสกุลอย่างน้อย 2 ตัวอักษร",
  }),
  email: z.string().email({
    message: "กรุณากรอกอีเมลให้ถูกต้อง",
  }),
  phone: z.string().min(10, {
    message: "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง",
  }),
  address: z.string().min(10, {
    message: "กรุณากรอกที่อยู่อย่างน้อย 10 ตัวอักษร",
  }),
});

export default function NewCustomerPage() {
  const router = useRouter();
  const { createCustomer } = useCustomer();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      const success = await createCustomer({
        name: values.fullName,
        email: values.email,
        phone: values.phone,
        address: values.address,
      });

      if (success) {
        toast.success("เพิ่มลูกค้าสำเร็จ");
        router.push("/customers");
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการเพิ่มลูกค้า");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>เพิ่มลูกค้าใหม่</CardTitle>
          <CardDescription>กรอกข้อมูลลูกค้าเพื่อเพิ่มในระบบ</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อ-นามสกุล</FormLabel>
                    <FormControl>
                      <Input placeholder="ชื่อ นามสกุล" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>อีเมล</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>เบอร์โทรศัพท์</FormLabel>
                    <FormControl>
                      <Input placeholder="0812345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ที่อยู่</FormLabel>
                    <FormControl>
                      <Input placeholder="ที่อยู่ของลูกค้า" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                  ยกเลิก
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
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