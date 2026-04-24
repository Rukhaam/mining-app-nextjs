"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Changed to Next.js router
import { QRCodeCanvas } from 'qrcode.react';
import { verifyDispatchAction } from '@/actions/verify.action'; // Using Server Action
import Navbar from '@/components/layout/Navbar';

export default function VerifyPage() {
  const { qrId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDispatchInfo = async () => {
      try {
        // Call the Next.js Server Action directly
        const response = await verifyDispatchAction(qrId);
        
        if (response.success) {
          setData(response.data);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError('Failed to connect to verification server.');
      } finally {
        setLoading(false);
      }
    };

    if (qrId) fetchDispatchInfo();
  }, [qrId]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-IN", {
        day: "2-digit", month: "2-digit", year: "numeric",
      })
      .replace(/\//g, "-");
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date
      .toLocaleString("en-IN", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true,
      })
      .replace(/\//g, "-");
  };

  const formatOnlyDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB').replace(/\//g, '-'); 
  };

  const formatOnlyTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); 
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white max-w-md w-full p-8 rounded-xl shadow-lg text-center border-t-4 border-red-500">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <span className="text-red-600 text-4xl">✖</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const { is_expired, ...dispatchInfo } = data;
  const verificationUrl = typeof window !== 'undefined' ? `${window.location.origin}/verify/${qrId}` : '';

  const themeColors = is_expired
    ? { wrapper: '#dc8504', inner: '#ff9800', border: '#dc8504', highlight: 'text-[#111111]' } 
    : { wrapper: '#FF9700', inner: '#FF9700', border: '#2e7d32', highlight: 'text-[#FBEB3B]' }; 

  return (
    <>
      <style>
        {`
          @keyframes colorChange {
            0% { color: #dc2626; }
            33% { color: #1d4ed8; }
            66% { color: #047857; }
            100% { color: #dc2626; }
          }
          .animate-color-change {
            animation: colorChange 1.5s infinite;
          }
        `}
      </style>

      <div className="min-h-screen bg-white py-6">
        <div className="max-w-4xl mx-auto px-2">
          <div className="border border-gray-800 my-2 p-5" style={{ backgroundColor: themeColors.wrapper }}>
            {/* Top Warning Note */}
            <div>
              <p className="text-white text-[15px] mb-3 leading-relaxed">
                <b><strong className="underline text-[18px] text-[#111111]">Note:</strong> The Information mentioned in e-Challan, Such as (Validity and Vehicle No.) should be matched with the information mentioned in the https://geologymining.jk.gov.in/ which can be seen after scanning the QR code encrypted on e-Challan.</b>
              </p>
              <p className="text-white text-[15px] mb-4 leading-relaxed">
                <b><strong className="underline text-[18px] text-[#111111]">सूचना:</strong> ई-चालान में उल्लिखित जानकारी, जैसे (वैधता और वाहन संख्या आदि) का मिलान https://geologymining.jk.gov.in/ में उल्लिखित जानकारी से किया जाना चाहिए, जिसे ई-चालान पर छपे क्यूआर कोड को स्कैन करने के बाद देखा जा सकता है।</b>
              </p>
              <hr className="h-[2px] border-0 bg-gray-600 mb-2" />
            </div>

            {/* Inner Content Container */}
            <div className="my-2 p-5 text-black" style={{ backgroundColor: themeColors.inner }}>
              {is_expired ? (
                /* ================= EXPIRED CHALLAN VIEW ================= */
                <>
                  <div className="text-center mb-6">
                    <p className="text-center flex justify-center mb-4">
                      <img src="https://geologymining.jk.gov.in/images/home/logo.png" alt="Logo" className="w-24 h-auto bg-white rounded-full p-1" />
                    </p>
                    <h3 className="animate-color-change text-2xl font-bold mb-1">e-Challan expired.</h3>
                    <h3 className="text-black text-xl font-bold mb-3">ईचालन की अवधि समाप्त हो गई है।</h3>
                    <h6 className="text-black text-sm font-bold mb-1 tracking-wide">
                      URL: <span className="font-normal text-[#FFEB3B]">https://geologymining.jk.gov.in/</span>
                    </h6>
                    <h4 className="text-black text-xl font-bold mt-2">
                      Challan No. : {dispatchInfo.qr_id}
                    </h4>
                  </div>

                  <div className="w-full overflow-x-auto mt-4">
                    <table className="w-full text-left border-collapse" style={{ backgroundColor: themeColors.wrapper }}>
                      <tbody>
                        <tr className="border-b border-white/20">
                          <th className="text-white font-bold p-3 w-1/3 text-[14px]">Name & Location of Seller</th>
                          <td className="p-3">
                            <h6 className=" font-bold text-[14px] tracking-wide text-[#FFEB3B]">
                              {dispatchInfo.seller_name} {dispatchInfo.seller_location && `, ${dispatchInfo.seller_location}`}
                            </h6>
                          </td>
                        </tr>
                        <tr className="border-b border-white/20">
                          <th className="text-white font-bold p-3 text-[14px]">Validity</th>
                          <td className="p-3">
                            <h6 className="text-white text-[14px] font-bold">
                              Date (<span className="text-[#FFEB3B]">{formatOnlyDate(dispatchInfo.valid_from)}</span> to <span className="text-[#FFEB3B]">{formatOnlyDate(dispatchInfo.valid_upto)}</span>) Time (<span className="text-[#FFEB3B]">{formatOnlyTime(dispatchInfo.valid_from)}</span> to <span className="text-[#FFEB3B]">{formatOnlyTime(dispatchInfo.valid_upto)}</span>)
                            </h6>
                          </td>
                        </tr>
                        <tr className="border-b border-white/20">
                          <th className="text-white font-bold p-3 text-[14px]">Route of the Transportation</th>
                          <td className="text-white p-3 text-[14px] font-bold">
                            Source <span className="underline">{dispatchInfo.route_source}</span> Destination <span className="underline">{dispatchInfo.route_destination}</span>
                          </td>
                        </tr>
                        <tr className="border-b border-white/20">
                          <th className="text-white font-bold p-3 text-[14px]">Vehicle no.</th>
                          <td className="text-white p-3 text-[14px] font-bold">
                            {dispatchInfo.vehicle_no?.toUpperCase()}
                          </td>
                        </tr>
                        <tr className="border-b border-white/20">
                          <th className="text-white font-bold p-3 text-[14px]">Name & Address of Consignee</th>
                          <td className="text-white p-3 text-[14px] font-bold">
                            {dispatchInfo.consignee_details}
                          </td>
                        </tr>
                        <tr>
                          <th className="text-white font-bold p-3 text-[14px]">Mineral</th>
                          <td className="text-white p-3 text-[14px] font-bold">
                            {dispatchInfo.product_name} ({dispatchInfo.quantity})
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                /* ================= ACTIVE CHALLAN VIEW ================= */
                <>
                  <div className="text-center mb-6">
                    <p className="text-center flex justify-center mb-4">
                      <img src="https://geologymining.jk.gov.in/images/home/logo.png" alt="Logo" className="w-24 h-auto bg-white rounded-full p-1" />
                    </p>
                    <h1 className="text-lg font-bold uppercase tracking-wide">Government of Jammu & Kashmir</h1>
                    <h2 className="text-xl font-semibold mt-1">Department of Geology & Mining</h2>
                    <h3 className="text-lg font-bold mt-2">FORM 'A'</h3>
                    <p className="text-sm font-bold text-white">[See Rule 38(5), 50(12), 60(1)(v), 70, 71]</p>
                    <p className="text-sm font-bold tracking-tight mt-1 mb-3">of challan for dispatch of mineral and its products</p>

                    <div className="flex flex-col items-center">
                      <h3 className="text-lg font-bold mb-2">Challan No. : <span className={themeColors.highlight}>{dispatchInfo.qr_id}</span></h3>
                      <QRCodeCanvas value={verificationUrl} size={110} className="border-4 border-white p-1 bg-white rounded" />
                      <span className="text-xs mt-2 font-semibold tracking-widest uppercase">(QR-Code)</span>
                    </div>
                    
                    <div className="text-sm mt-2">
                      <span className="font-semibold">Mineral:</span> <span className={`font-bold  ${themeColors.highlight}`}> {dispatchInfo.product_name }  ({dispatchInfo.quantity})</span>
                    </div>
                
                    <div className="text-[25px] text-black mt-2">
                      Validity from <span className="font-bold text-black">{formatDateTime(dispatchInfo.valid_from)}</span> to <span className="font-bold text-black">{formatDateTime(dispatchInfo.valid_upto)}</span>
                    </div>
                    <div className="text-[25px] text-black">
                      <span className="font-bold text-black">{formatDateTime(dispatchInfo.valid_from)}</span> से <span className="font-bold text-black">{formatDateTime(dispatchInfo.valid_upto)}</span> तक
                    </div>
                    <div className="text-[15px] mt-4">
                      URL: <a href="https://geologymining.jk.gov.in/" className={`font-bold underline ${themeColors.highlight} mt-2`}>https://geologymining.jk.gov.in/</a>
                    </div>
                  </div>

                  <div className="text-[14px] md:text-[15px] text-white">
                    {/* ... Your 15 active fields exactly as provided ... */}
                    <div className="flex border-b border-white/20 pb-3 bg-[#D07D09]">
                      <span className="w-8 font-semibold pl-2">1.</span>
                      <span className="flex-1">
                        Type of mineral concessions Lease / License / Permit no. <span className="font-bold">{dispatchInfo.seller_name || "................................."}</span>
                      </span>
                    </div>
                    <div className="flex border-b border-white/20 pb-3 bg-[#DD8507]">
                      <span className="w-8 pl-2"></span>
                      <span className="flex-1 text-xs">
                        Issuing date: <span className="font-bold">{formatDate(dispatchInfo.valid_from)}</span> &nbsp;&nbsp; Valid upto: <span className="font-bold">{formatDate(dispatchInfo.valid_upto)}</span>
                      </span>
                    </div>
                    <div className="flex border-b border-white/20 pb-3 bg-[#D07D09]">
                      <span className="w-8 font-semibold pl-2">2.</span>
                      <span className="flex-1">Name & Style of Concessionary <span className="font-bold">{dispatchInfo.seller_name || "................................."}</span></span>
                    </div>
                    <div className="flex border-b border-white/20 pb-3 bg-[#DD8507]">
                      <span className="w-8 font-semibold pl-2">3.</span>
                      <span className="flex-1">Location of mineral concession area <span className="font-bold">{dispatchInfo.seller_location || "................................."}</span></span>
                    </div>
                    <div className="flex border-b border-white/20 pb-3 bg-[#D07D09]">
                      <span className="w-8 font-semibold pl-2">4.</span>
                      <span className="flex-1">Type of mineral Granted on mineral concessions <span className="font-bold">{dispatchInfo.product_name || "................................."}</span></span>
                    </div>
                    <div className="flex border-b border-white/20 pb-3 bg-[#DD8507]">
                      <span className="w-8 font-semibold pl-2">5.</span>
                      <span className="flex-1">Quantity of mineral granted on mineral Concessions <span className="font-bold">{dispatchInfo.mineral_granted_qty || "................................."}</span></span>
                    </div>
                    <div className="flex border-b border-white/20 pb-3 bg-[#D07D09]">
                      <span className="w-8 font-semibold pl-2">6.</span>
                      <span className="flex-1">Name & Location of Stone crusher Unit and Holder <span className="font-bold">{dispatchInfo.seller_name}{dispatchInfo.seller_location && `, ${dispatchInfo.seller_location}`}</span></span>
                    </div>
                    <div className="flex border-b border-white/20 pb-3 bg-[#DD8507]">
                      <span className="w-8 font-semibold pl-2">7.</span>
                      <span className="flex-1">Type of Finished Products : Sand/Bajri/Kankra (Aggregate)/Dust etc. <span className="font-bold">{dispatchInfo.product_name}</span></span>
                    </div>
                    <div className="flex border-b border-white/20 pb-3 bg-[#D07D09]">
                      <span className="w-8 font-semibold pl-2">8.</span>
                      <span className="flex-1">Quantity of mineral dispatched <span className="font-bold">{dispatchInfo.quantity}</span></span>
                    </div>
                    <div className="flex border-b border-white/20 pb-3 bg-[#DD8507]">
                      <span className="w-8 font-semibold pl-2">9.</span>
                      <span className="flex-1">Date & Time of dispatch <span className="font-bold">{formatDateTime(dispatchInfo.valid_from)}</span></span>
                    </div>
                    <div className="flex border-b border-white/20 pb-3 bg-[#D07D09]">
                      <span className="w-8 font-semibold pl-2">10.</span>
                      <span className="flex-1">Route of the Transportation- Source <span className="font-bold">{dispatchInfo.route_source}</span> Destination <span className="font-bold">{dispatchInfo.route_destination}</span></span>
                    </div>
                    <div className="flex border-b border-white/20 pb-3 bg-[#DD8507]">
                      <span className="w-8 font-semibold pl-2">11.</span>
                      <span className="flex-1">Rate of Mineral <span className="font-bold">{dispatchInfo.mineral_rate}</span> Total Amount (Excluding GST and Transportation charges) <span className="font-bold">{dispatchInfo.total_amount}</span></span>
                    </div>
                    <div className="flex border-b border-white/20 pb-3 bg-[#D07D09]">
                      <span className="w-8 font-semibold pl-2">12.</span>
                      <span className="flex-1">GST Bill/No. <span className="font-bold">{dispatchInfo.gst_no}</span> Quantity <span className="font-bold">{dispatchInfo.gst_qty}</span> Amount <span className="font-bold">{dispatchInfo.gst_amount}</span> (Enclose copy of GST Invoice)</span>
                    </div>
                    <div className="flex border-b border-white/20 pb-3 bg-[#DD8507]">
                      <span className="w-8 font-semibold pl-2">13.</span>
                      <span className="flex-1">Vehicle No. <span className="font-bold">{dispatchInfo.vehicle_no?.toUpperCase()}</span></span>
                    </div>
                    <div className="flex border-b border-white/20 pb-3 bg-[#D07D09]">
                      <span className="w-8 font-semibold pl-2">14.</span>
                      <span className="flex-1">Name & Address of Consignee / Buyer / Purchaser <span className="font-bold">{dispatchInfo.consignee_details}</span></span>
                    </div>
                    <div className="flex border-b border-white/20 pb-3 bg-[#DD8507]">
                      <span className="w-8 font-semibold pl-2">15.</span>
                      <span className="flex-1">Name & Phone No. of Driver <span className="font-bold">{dispatchInfo.driver_details}</span></span>
                    </div>
                  </div>

                  <div className="mt-12 flex justify-center">
                    <div className="w-full sm:w-full flex flex-col text-center relative border-2 border-white/40 overflow-hidden bg-[#FF9700] rounded-lg">
                      <span className="py-2 text-sm sm:text-base font-bold bg-[#FF9700] border-b border-white/40">
                        Self Approved by Mineral Concessionary
                      </span>
                      <div className="h-32 sm:h-40 relative flex items-center justify-center p-2">
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <img src="/stamp.png" alt="Approved Stamp" className="w-28 h-28 sm:w-32 sm:h-32 transform -rotate-12 opacity-90 object-contain " />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}