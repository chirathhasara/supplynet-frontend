import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Warehouse Dashboard</h1>
        <p className="text-gray-600">Welcome back, Manager</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">📦</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-xl font-bold">1,234</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">📈</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Orders Today</p>
              <p className="text-xl font-bold">56</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">👥</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Staff</p>
              <p className="text-xl font-bold">12</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-xl font-bold">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b pb-2">
            <span>Order #1001 shipped</span>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span>New shipment received</span>
            <span className="text-sm text-gray-500">4 hours ago</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Inventory updated</span>
            <span className="text-sm text-gray-500">6 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}