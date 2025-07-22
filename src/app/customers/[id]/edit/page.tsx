"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";

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
import { Textarea } from "@/components/ui/textarea";
import { useCustomer } from "@/contexts/CustomerContext";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "กรุณาระบุชื่อลูกค้า",
  }),
  phone: z.string().min(10, {
    message: "กรุณาระบุเบอร์โทรศัพท์ 10 หลัก",
  }).max(10, {
    message: "กรุณาระบุเบอร์โทรศัพท์ 10 หลัก",
  }),
  email: z.string().email({
    message: "กรุณาระบุอีเมลที่ถูกต้อง",
  }).optional().or(z.literal("")),
  address: z.string().optional(),
});

type CustomerFormData = z.infer<typeof formSchema>;

export default function EditCustomerPage({ params: unwrappedParams }: { params: Promise<{ id: string }> }) {
  const params = React.use(unwrappedParams);
  const router = useRouter();
  const { getCustomer, updateCustomer } = useCustomer();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customer, setCustomer] = useState<CustomerFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const fetchedCustomer = await getCustomer(params.id);
        if (fetchedCustomer) {
          setCustomer(fetchedCustomer);
          form.reset(fetchedCustomer);
        } else {
          toast.error("ไม่พบข้อมูลลูกค้า");
          router.push("/customers");
        }
      } catch (err) {
        toast.error("ไม่สามารถโหลดข้อมูลลูกค้าได้");
        router.push("/customers");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomer();
  }, [params.id, getCustomer, router, form]);

  async function onSubmit(values: CustomerFormData) {
    if (!customer) return;

    try {
      setIsSubmitting(true);
      const success = await updateCustomer(params.id, values);

      if (success) {
        toast.success("บันทึกข้อมูลลูกค้าสำเร็จ");
        router.push("/customers");
        router.refresh();
      } else {
        toast.error("ไม่สามารถบันทึกข้อมูลลูกค้าได้");
      }
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูลลูกค้า");
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

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>ไม่พบข้อมูลลูกค้า</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>แก้ไขข้อมูลลูกค้า</CardTitle>
          <CardDescription>แก้ไขข้อมูลรายละเอียดของลูกค้า</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อลูกค้า</FormLabel>
                    <FormControl>
                      <Input placeholder="ชื่อลูกค้า" {...field} />
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
                      <Input placeholder="เบอร์โทรศัพท์" {...field} />
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
                      <Input placeholder="อีเมล" {...field} />
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
                      <Textarea
                        placeholder="ที่อยู่ลูกค้า"
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
