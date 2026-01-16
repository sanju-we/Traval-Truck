'use client';

import { useState } from 'react';
import SideNavbar from '@/components/restaurant/SideNavbar';
import {
  Plus,
  Minus,
  Trash2,
  IndianRupee,
  Receipt,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { RESTAURANT_API_METHODS } from '@/services/APIs/restaurant.api.service';
import { BillItem } from '@/types/restaurant';

export default function OfflineBillingPage() {
  const [items, setItems] = useState<BillItem[]>([]);
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI'>('Cash');
  const [loading, setLoading] = useState(false);

  /* ----------------------- Calculations ----------------------- */

  const subTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const taxAmount = (subTotal * tax) / 100;
  const discountAmount = (subTotal * discount) / 100;
  const total = Math.max(0, subTotal + taxAmount - discountAmount);

  /* ----------------------- Actions ----------------------- */

  const addItem = () => {
    if (!itemName || price <= 0) {
      toast.error('Enter valid item name and price');
      return;
    }

    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        name: itemName,
        price,
        quantity: 1,
      },
    ]);

    setItemName('');
    setPrice(0);
  };

  const updateQty = (id: string, delta: number) => {
    setItems(items.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const submitBill = async () => {
    if (items.length === 0) {
      toast.error('Add at least one item');
      return;
    }

    try {
      setLoading(true);

      const res = await RESTAURANT_API_METHODS.createOfflineBill({
        items,
        subTotal,
        tax,
        discount,
        total,
        paymentMethod,
      });

      if (res.success) {
        toast.success('Bill generated successfully');
        setItems([]);
        setTax(0);
        setDiscount(0);
      } else {
        toast.error(res.message || 'Failed to generate bill');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------- UI ----------------------- */

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideNavbar />

      <div className="flex-1 p-6 md:p-10">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Offline Billing
            </h1>
            <p className="text-gray-500">
              Create cash / UPI bills for walk-in customers
            </p>
          </div>

          {/* Add Item */}
          <div className="bg-white rounded-xl shadow-sm border p-6 grid md:grid-cols-3 gap-4">
            <input
              placeholder="Item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="number"
              placeholder="Price"
              value={price || ''}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="border rounded-lg px-4 py-2"
            />
            <button
              onClick={addItem}
              className="bg-emerald-600 text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Add Item
            </button>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            {items.length === 0 ? (
              <p className="text-center text-gray-500">
                No items added
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th>Item</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td>{item.name}</td>
                      <td>₹{item.price}</td>
                      <td className="flex items-center gap-2 py-2">
                        <button onClick={() => updateQty(item.id, -1)}>
                          <Minus size={16} />
                        </button>
                        {item.quantity}
                        <button onClick={() => updateQty(item.id, 1)}>
                          <Plus size={16} />
                        </button>
                      </td>
                      <td>₹{item.price * item.quantity}</td>
                      <td>
                        <button onClick={() => removeItem(item.id)}>
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl shadow-sm border p-6 grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (%)</span>
                <input
                  type="number"
                  value={tax}
                  onChange={(e) => setTax(Number(e.target.value))}
                  className="border rounded px-2 w-20 text-right"
                />
              </div>
              <div className="flex justify-between">
                <span>Discount (%)</span>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="border rounded px-2 w-20 text-right"
                />
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-emerald-600">
                  ₹{total}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <select
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value as 'Cash' | 'UPI')
                }
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
              </select>

              <button
                onClick={submitBill}
                disabled={loading}
                className="w-full bg-emerald-600 text-white rounded-lg px-4 py-3 flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Generating...'
                ) : (
                  <>
                    <Receipt size={18} />
                    Generate Bill
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                <CheckCircle size={14} className="inline mr-1" />
                Payment collected offline
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
