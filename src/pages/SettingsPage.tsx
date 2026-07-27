import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { User, Bell, Shield, Key, Database, Globe, Save } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", name: "Tài khoản", icon: User },
    { id: "notifications", name: "Thông báo", icon: Bell },
    { id: "security", name: "Bảo mật", icon: Shield },
    { id: "api", name: "API & Tích hợp", icon: Key },
    { id: "system", name: "Hệ thống", icon: Database },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-on-surface mb-2">Cài đặt hệ thống</h1>
        <p className="text-on-surface-variant">Quản lý cấu hình tài khoản, phân quyền và kết nối hệ thống.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary-container text-on-primary-container"
                  : "text-on-surface hover:bg-surface-container"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>Cập nhật thông tin cơ bản và ảnh đại diện của bạn.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center overflow-hidden border border-outline-variant">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <Button variant="outline" size="sm" className="mb-2">Thay đổi ảnh</Button>
                    <p className="text-xs text-on-surface-variant">JPG, GIF hoặc PNG. Tối đa 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Họ và tên</label>
                    <Input defaultValue="Minh Nguyễn" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Chức vụ</label>
                    <Input defaultValue="Compliance Officer" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input defaultValue="minh.nguyen@auroracoffee.com" type="email" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Số điện thoại</label>
                    <Input defaultValue="+84 90 123 4567" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Múi giờ</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 h-5 w-5 text-outline" />
                    <select className="block h-10 w-full rounded border border-outline-variant bg-surface-container-lowest pl-10 pr-3 py-2 text-sm font-sans focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                      <option>(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
                      <option>(GMT+00:00) London</option>
                    </select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end border-t border-outline-variant pt-6">
                <Button className="gap-2"><Save className="w-4 h-4" /> Lưu thay đổi</Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt thông báo</CardTitle>
                <CardDescription>Quản lý cách bạn nhận thông tin cập nhật về pháp lý và báo cáo.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-outline-variant rounded bg-surface-container-lowest">
                       <div>
                          <h4 className="font-semibold text-sm">Cập nhật pháp lý khẩn cấp</h4>
                          <p className="text-xs text-on-surface-variant">Nhận email ngay khi có thay đổi quy định ảnh hưởng đến sản phẩm của bạn.</p>
                       </div>
                       <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                          <input type="checkbox" name="toggle" id="toggle1" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-primary checked:right-0 checked:border-primary" defaultChecked />
                          <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-5 rounded-full bg-primary-container cursor-pointer"></label>
                       </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-outline-variant rounded bg-surface-container-lowest">
                       <div>
                          <h4 className="font-semibold text-sm">Báo cáo hàng tuần</h4>
                          <p className="text-xs text-on-surface-variant">Nhận báo cáo tổng hợp về tình trạng tuân thủ vào mỗi sáng thứ Hai.</p>
                       </div>
                       <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                          <input type="checkbox" name="toggle" id="toggle2" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-outline-variant checked:right-0 checked:border-primary" />
                          <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-5 rounded-full bg-outline-variant cursor-pointer"></label>
                       </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-outline-variant rounded bg-surface-container-lowest">
                       <div>
                          <h4 className="font-semibold text-sm">Cảnh báo hạn chót</h4>
                          <p className="text-xs text-on-surface-variant">Thông báo khi các chứng chỉ hoặc giấy phép sắp hết hạn (trước 30 ngày).</p>
                       </div>
                       <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                          <input type="checkbox" name="toggle" id="toggle3" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-primary checked:right-0 checked:border-primary" defaultChecked />
                          <label htmlFor="toggle3" className="toggle-label block overflow-hidden h-5 rounded-full bg-primary-container cursor-pointer"></label>
                       </div>
                    </div>
                 </div>
              </CardContent>
              <CardFooter className="justify-end border-t border-outline-variant pt-6">
                <Button className="gap-2"><Save className="w-4 h-4" /> Lưu tùy chọn</Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "api" && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>API Keys & Webhooks</CardTitle>
                    <CardDescription>Kết nối ERP và hệ thống nội bộ của bạn với AI Engine.</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2"><PlusIcon className="w-4 h-4"/> Tạo Key Mới</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border border-outline-variant rounded overflow-hidden">
                  <table className="w-full text-left text-sm font-sans">
                    <thead className="bg-surface-container-low text-xs font-mono uppercase text-outline">
                      <tr>
                        <th className="px-4 py-3 font-semibold">TÊN KEY</th>
                        <th className="px-4 py-3 font-semibold">NGÀY TẠO</th>
                        <th className="px-4 py-3 font-semibold">TRẠNG THÁI</th>
                        <th className="px-4 py-3 font-semibold text-right">THAO TÁC</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      <tr className="hover:bg-surface-container-lowest">
                        <td className="px-4 py-3 font-medium text-on-surface">Production ERP Sync</td>
                        <td className="px-4 py-3 text-on-surface-variant">12/08/2023</td>
                        <td className="px-4 py-3"><Badge variant="success">Hoạt động</Badge></td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm" className="text-primary">Thu hồi</Button>
                        </td>
                      </tr>
                      <tr className="hover:bg-surface-container-lowest">
                        <td className="px-4 py-3 font-medium text-on-surface">Testing Env</td>
                        <td className="px-4 py-3 text-on-surface-variant">01/09/2023</td>
                        <td className="px-4 py-3"><Badge variant="success">Hoạt động</Badge></td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm" className="text-primary">Thu hồi</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-surface-container-low p-4 rounded border border-outline-variant">
                   <h4 className="font-semibold text-sm mb-2">Tài liệu API</h4>
                   <p className="text-xs text-on-surface-variant mb-4">Tìm hiểu cách tích hợp tính năng kiểm tra tự động và đồng bộ danh mục sản phẩm qua REST API.</p>
                   <Button variant="outline" size="sm">Xem tài liệu Developer</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {(activeTab === "security" || activeTab === "system") && (
             <Card>
                <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                   <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
                      <Shield className="w-8 h-8 text-outline" />
                   </div>
                   <h3 className="text-lg font-bold mb-2">Đang phát triển</h3>
                   <p className="text-sm text-on-surface-variant max-w-sm">Tính năng này đang được hoàn thiện và sẽ sớm ra mắt trong bản cập nhật tiếp theo.</p>
                </CardContent>
             </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function PlusIcon(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
    </svg>
  );
}
