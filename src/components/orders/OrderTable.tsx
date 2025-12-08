import React from "react";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge"; // Use your component
import { Order } from "@/types/order";
import OrderActionMenu from "./OrderAction";

interface OrderTableProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING": return "warning";
    case "CONFIRMED": return "info";
    case "COOKING": return "info";
    case "READY": return "success";
    case "DELIVERED": return "success";
    case "CANCELLED": return "error";
    default: return "light";
  }
};

export default function OrderTable({ orders, onViewOrder }: OrderTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-sm">Order ID</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-sm">Customer</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-sm">Type</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-sm">Date</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-sm">Status</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-sm">Amount</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-sm">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="px-5 py-4 font-medium text-gray-800 dark:text-white">
                    #{order.id.slice(-6).toUpperCase()}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        {order.user?.avatar ? (
                             <Image width={32} height={32} src={order.user.avatar} alt="User" />
                        ) : (
                             // Fallback Icon
                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        )}
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-sm dark:text-white">
                          {order.user?.name || "Guest"}
                        </span>
                        <span className="block text-xs text-gray-500">
                          {order.user?.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                     <span className="capitalize">{order.ordertype.toLowerCase()}</span>
                     <span className="text-xs text-gray-400 block">{order.paymenttype}</span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                    <span className="text-xs block text-gray-400">
                        {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <Badge size="sm" color={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 font-medium text-gray-800 dark:text-white">
                    ${order.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <OrderActionMenu order={order} onView={onViewOrder} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}