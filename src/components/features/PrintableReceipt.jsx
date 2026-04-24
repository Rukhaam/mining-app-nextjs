"use client";

import React from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function PrintableReceipt({ dispatchData, qrId, onBack }) {
  const verificationUrl = typeof window !== 'undefined' ? `${window.location.origin}/verify/${qrId}` : '';

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "-");
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true,
    }).replace(/\//g, "-");
  };

  return (
    <div className="bg-gray-200 min-h-screen p-5 print:bg-white print:p-0 flex justify-center">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between mb-4 print:hidden">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded shadow-sm"
          >
            Back
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-900 transition text-white rounded shadow-sm flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
            </svg>
            Print E-Challan
          </button>
        </div>

        <div className="relative overflow-hidden bg-white border border-gray-300 p-8 sm:p-12 print:px-6 print:py-4 text-[14px] print:text-[13px] leading-relaxed print:leading-snug text-black shadow-lg print:shadow-none print:border-none">
          
          <div className="absolute inset-[-60%] z-1000 flex flex-wrap justify-center items-center gap-x-5 gap-y-4 pointer-events-none opacity-[0.06] print:opacity-[0.05] select-none">
            {Array.from({ length: 650 }).map((_, i) => (
              <a key={i} href="https://geologymining.jk.gov.in/" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-sm font-black text-black whitespace-nowrap pointer-events-auto hover:text-blue-800 transition-colors">
                https://geologymining.jk.gov.in/
              </a>
            ))}
          </div>

          <div className="relative z-10">
            <div className="text-center mb-6 print:mb-3">
              <h1 className="text-sm font-bold uppercase tracking-wide">Government of Jammu & Kashmir</h1>
              <h2 className="text-lg print:text-base font-semibold mt-1 print:mt-0">Department of Geology & Mining</h2>
              <h3 className="text-md print:text-sm font-bold mt-1 print:mt-0">FORM 'A'</h3>
              <p className="text-sm print:text-xs font-bold">[See Rule 38(5), 50(12), 60(1)(v), 70, 71]</p>
              <p className="text-sm print:text-xs font-bold tracking-tight mt-1 print:mt-0">of challan for dispatch of mineral and its products</p>
              <h2 className="text-sm font-bold mt-2 print:mt-1">E-CHALLAN</h2>
            </div>

            <div className="text-center font-bold text-lg print:text-base mb-6 print:mb-3 tracking-wider">
              Challan No. : {qrId}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-end mb-6 print:mb-3">
              <div className="flex flex-col items-center">
                <QRCodeCanvas value={verificationUrl} size={90} className="border border-gray-300 p-1 bg-white print:w-20 print:h-20" />
                <span className="text-xs mt-1 font-semibold mb-2 print:mb-0">(QR-Code)</span>
              </div>
              <div className="text-right mt-4 sm:mt-0">
                <p className="font-semibold text-[15px] print:text-[13px]">
                  Validity from {formatDateTime(dispatchData.valid_from)} to {formatDateTime(dispatchData.valid_upto)}
                </p>
              </div>
            </div>

            <div className="space-y-4 print:space-y-1.5">
              <div className="flex">
                <span className="w-8 font-semibold">1.</span>
                <span className="flex-1">Type of mineral concessions Lease / License / Permit no. <span className="font-bold">{dispatchData.seller_name || "................................."}</span></span>
              </div>
              <p className="text-3px print:text-xs">
                Issuing date: <span className="font-semibold">{formatDate(dispatchData.valid_from)}</span> &nbsp;&nbsp; Valid upto: <span className="font-semibold">{formatDate(dispatchData.valid_upto)}</span>
              </p>
              <div className="flex"><span className="w-8 font-semibold">2.</span><span className="flex-1">Name & Style of Concessionary {dispatchData.seller_name || "................................."}</span></div>
              <div className="flex"><span className="w-8 font-semibold">3.</span><span className="flex-1">Location of mineral concession area {dispatchData.seller_location || "................................."}</span></div>
              <div className="flex"><span className="w-8 font-semibold">4.</span><span className="flex-1">Type of mineral Granted on mineral concessions {dispatchData.product_name || "................................."}</span></div>
              <div className="flex"><span className="w-8 font-semibold">5.</span><span className="flex-1">Quantity of mineral granted on mineral Concessions <span className="font-bold">{dispatchData.mineral_granted_qty || "................................."}</span></span></div>
              <div className="flex"><span className="w-8 font-semibold">6.</span><span className="flex-1">Name & Location of Stone crusher Unit and Holder <span className="font-bold">{dispatchData.seller_name}{dispatchData?.seller_location && `, ${dispatchData.seller_location}`}</span></span></div>
              <div className="flex"><span className="w-8 font-semibold">7.</span><span className="flex-1">Type of Finished Products : Sand/Bajri/Kankra (Aggregate)/Dust etc. <span className="font-bold">{dispatchData.product_name}</span></span></div>
              <div className="flex"><span className="w-8 font-semibold">8.</span><span className="flex-1">Quantity of mineral dispatched <span className="font-bold">{dispatchData.quantity}</span></span></div>
              <div className="flex"><span className="w-8 font-semibold">9.</span><span className="flex-1 font-extrabold">Date & Time of dispatch <span className="font-bold">{formatDateTime(dispatchData.valid_from)}</span></span></div>
              <div className="flex"><span className="w-8 font-semibold">10.</span><span className="flex-1 font-extrabold">Route of the Transportation- Source <span className="font-bold">{dispatchData.route_source}</span> Destination <span className="font-bold">{dispatchData.route_destination}</span></span></div>
              <div className="flex"><span className="w-8 font-semibold">11.</span><span className="flex-1">Rate of Mineral <span className="font-bold">{dispatchData.mineral_rate}</span> Total Amount (Excluding GST and Transportation charges) <span className="font-bold">{dispatchData.total_amount}</span></span></div>
              <div className="flex"><span className="w-8 font-semibold">12.</span><span className="flex-1">GST Bill/No. <span className="font-bold">{dispatchData.gst_no}</span> Quantity <span className="font-bold">{dispatchData.gst_qty}</span> Amount <span className="font-bold">{dispatchData.gst_amount}</span> (Enclose copy of GST Invoice)</span></div>
              <div className="flex"><span className="w-8 font-semibold">13.</span><span className="flex-1">Vehicle No. <span className="font-bold">{dispatchData.vehicle_no?.toUpperCase()}</span></span></div>
              <div className="flex"><span className="w-8 font-semibold">14.</span><span className="flex-1">Name & Address of Consignee / Buyer / Purchaser <span className="font-bold">{dispatchData.consignee_details}</span></span></div>
              <div className="flex"><span className="w-8 font-semibold">15.</span><span className="flex-1">Name & Phone No. of Driver <span className="font-bold">{dispatchData.driver_details}</span></span></div>
            </div>

            <div className="mt-2 print:mt-1">
              <p className="text-[13px] print:text-[11px] text-justify font-bold leading-tight">
                Note: The Information mentioned in e-Challan, Such as (Validity and Vehicle No.) should be matched with the information mentioned in the https://geologymining.jk.gov.in/ which can be seen after scanning the QR code encrypted on e-Challan
              </p>

              <div className="mt-10 sm:mt-16 print:mt-4 grid grid-cols-2 gap-4 sm:gap-16 md:gap-24 print:gap-12">
                <div className="h-32 sm:h-40 print:h-28 w-full flex flex-col text-center relative border-2 border-black overflow-hidden bg-white/80 print:bg-white">
                  <span className="py-2 print:py-1 text-xs sm:text-sm bg-gray-50 print:bg-transparent z-10 ">Self Approved by Mineral Concessionary</span>
                  <div className="flex-1 relative flex items-center justify-start p-2">
                    <div className="absolute inset-0 flex items-center justify-start pointer-events-none">
                      <img src="/stamp.png" alt="Approved Stamp" className="w-28 h-28 sm:w-32 sm:h-32 print:w-20 print:h-20 transform -rotate-12 opacity-80 print:opacity-100 object-contain" />
                    </div>
                  </div>
                </div>

                <div className="h-32 sm:h-40 print:h-28 w-full flex flex-col text-center relative border-2 border-black bg-white/80 print:bg-white">
                  <span className="py-2 print:py-1 text-xs sm:text-sm bg-gray-50 print:bg-transparent z-10 relative">Signature & Seal of Mineral Concessionary</span>
                  <div className="flex-1 relative"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}