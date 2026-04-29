"use client";

import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import PrintableReceipt from '@/components/features/PrintableReceipt';
import { createDispatchAction } from '@/actions/dispatch.action';

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    seller_name: '', seller_location: '', route_source: '', route_destination: '',
    vehicle_no: '', consignee_details: '', product_name: '', quantity: '',
    valid_from: '', valid_upto: '', mineral_granted_qty: '', mineral_rate: '', total_amount: '',
    gst_no: '', gst_qty: '', gst_amount: '', driver_details: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [qrId, setQrId] = useState(null);
  const [dispatchResult, setDispatchResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setQrId(null);
    try {
      // Call the server action directly
      const response = await createDispatchAction(formData);
      
      if (response.success) {
        setQrId(response.data.qr_id);
        setDispatchResult(response.data);
      } else {
        setError(response.error || 'Failed to generate dispatch.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (qrId && dispatchResult) {
    return (
      <PrintableReceipt 
        dispatchData={dispatchResult} 
        qrId={qrId} 
        onBack={() => {
          setQrId(null);    
          setDispatchResult(null);
          setFormData({
            seller_name: '', seller_location: '', route_source: '', route_destination: '',
            vehicle_no: '', consignee_details: '', product_name: '', quantity: '',
            valid_from: '', valid_upto: '', mineral_granted_qty: '', mineral_rate: '', total_amount: '',
            gst_no: '', gst_qty: '', gst_amount: '', driver_details: ''
          });
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden font-sans">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-60 animate-blob"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-60 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-60 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 flex flex-col items-center py-12 px-4 sm:px-6">
        <div className="w-full max-w-4xl glass-panel rounded-3xl overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="mb-10 text-center">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Generate Dispatch</h1>
              <p className="text-gray-500 mt-2 font-medium">Enter logistics details to secure a trackable e-Challan.</p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-700 rounded-xl backdrop-blur-sm flex items-center">
                <span className="mr-2">⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="md:col-span-2 border-b pb-2 mb-2"><h3 className="font-bold text-gray-700">General Info</h3></div>
              <Input label="Seller Name" name="seller_name" onChange={handleChange} />
              <Input label="Seller Location" name="seller_location" onChange={handleChange} />
              
              <div className="md:col-span-2 border-b pb-2 mb-2 mt-4"><h3 className="font-bold text-gray-700">Mineral & Cargo</h3></div>
              <Input label="Product Name" name="product_name" onChange={handleChange} />
              <Input label="Mineral Granted Quantity" name="mineral_granted_qty" onChange={handleChange} />
              <Input label="Dispatched Quantity" name="quantity" onChange={handleChange} />
              <Input label="Mineral Rate" name="mineral_rate" onChange={handleChange} />
              <Input label="Total Amount (Excl. GST)" name="total_amount" onChange={handleChange} />
              
              <div className="md:col-span-2 border-b pb-2 mb-2 mt-4"><h3 className="font-bold text-gray-700">GST Details</h3></div>
              <Input label="GST Bill/No" name="gst_no" onChange={handleChange} />
              <Input label="GST Quantity" name="gst_qty" onChange={handleChange} />
              <Input label="GST Amount" name="gst_amount" onChange={handleChange} />

              <div className="md:col-span-2 border-b pb-2 mb-2 mt-4"><h3 className="font-bold text-gray-700">Transit Info</h3></div>
              <Input label="Route Source" name="route_source" onChange={handleChange} />
              <Input label="Route Destination" name="route_destination" onChange={handleChange} />
              <Input label="Vehicle Number" name="vehicle_no" onChange={handleChange} />
              <Input label="Consignee Details" name="consignee_details" onChange={handleChange} />
              <Input label="Driver Name & Phone" name="driver_details" onChange={handleChange} />
              <Input label="Valid From (Time of Dispatch)" name="valid_from" type="datetime-local" required onChange={handleChange} />
              <Input label="Valid Upto (Expiry Time)" name="valid_upto" type="datetime-local" required onChange={handleChange} />

              <div className="md:col-span-2 pt-6">
                <Button type="submit" disabled={loading} className="w-full text-lg">
                  {loading ? 'Generating Secure QR...' : 'Generate Dispatch'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}