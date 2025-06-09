"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-white">ตั้งค่าระบบ</h1>

      <div className="space-y-6">
        <div className="bg-[#1e293b] rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white">ข้อมูลร้าน</h2>
            <p className="text-gray-400">จัดการข้อมูลพื้นฐานของร้านซ่อมคอมพิวเตอร์</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="shop-name" className="text-white">ชื่อร้าน</Label>
              <Input id="shop-name" placeholder="ชื่อร้านของคุณ" className="mt-1" />
            </div>

            <div>
              <Label htmlFor="address" className="text-white">ที่อยู่</Label>
              <Input id="address" placeholder="ที่อยู่ร้าน" className="mt-1" />
            </div>

            <div>
              <Label htmlFor="phone" className="text-white">เบอร์โทรศัพท์</Label>
              <Input id="phone" placeholder="เบอร์โทรศัพท์" className="mt-1" />
            </div>

            <div>
              <Label htmlFor="tax-id" className="text-white">เลขประจำตัวผู้เสียภาษี</Label>
              <Input id="tax-id" placeholder="เลขประจำตัวผู้เสียภาษี" className="mt-1" />
            </div>

            <div>
              <Label htmlFor="currency" className="text-white">สกุลเงิน</Label>
              <Select>
                <SelectTrigger id="currency" className="mt-1">
                  <SelectValue placeholder="เลือกสกุลเงิน" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="thb">บาท (THB)</SelectItem>
                  <SelectItem value="usd">ดอลลาร์สหรัฐ (USD)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end mt-6">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                บันทึกการเปลี่ยนแปลง
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-[#1e293b] rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white">การแจ้งเตือน</h2>
            <p className="text-gray-400">ตั้งค่าการแจ้งเตือนต่างๆ</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email-notifications" className="text-white">อีเมลแจ้งเตือน</Label>
              <Input id="email-notifications" placeholder="อีเมลสำหรับรับการแจ้งเตือน" className="mt-1" />
            </div>

            <div>
              <Label htmlFor="notification-type" className="text-white">ประเภทการแจ้งเตือน</Label>
              <Select>
                <SelectTrigger id="notification-type" className="mt-1">
                  <SelectValue placeholder="เลือกประเภทการแจ้งเตือน" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="important">สำคัญเท่านั้น</SelectItem>
                  <SelectItem value="none">ไม่รับการแจ้งเตือน</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end mt-6">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                บันทึกการตั้งค่า
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 