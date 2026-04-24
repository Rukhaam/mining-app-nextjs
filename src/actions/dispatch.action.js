"use server";

import { db } from '@/db'; 
import { dispatches } from '@/db/schema';

// Helper to generate the custom JK-XXXXXXXX challan format
const generateChallanNo = () => {
  // Generates 8 random digits
  const numbers = Math.floor(10000000 + Math.random() * 90000000); 
  return `JK-${numbers}`;
};

export async function createDispatchAction(formData) {
  try {
    // 1. Basic validation
    if (!formData.valid_from) {
      return { success: false, error: "Valid from time is required" };
    }

    // 2. Parse the frontend time and calculate the 4-hour strict expiry
    const validFromDate = new Date(formData.valid_from);
    const validUptoDate = new Date(validFromDate.getTime() + 4 * 60 * 60 * 1000);

    // 3. Assemble the secure payload
    const payload = {
      seller_name: formData.seller_name,
      seller_location: formData.seller_location,
      route_source: formData.route_source,
      route_destination: formData.route_destination,
      vehicle_no: formData.vehicle_no,
      consignee_details: formData.consignee_details,
      product_name: formData.product_name,
      quantity: formData.quantity,
      mineral_granted_qty: formData.mineral_granted_qty,
      mineral_rate: formData.mineral_rate,
      total_amount: formData.total_amount,
      gst_no: formData.gst_no,
      gst_qty: formData.gst_qty,
      gst_amount: formData.gst_amount,
      driver_details: formData.driver_details,
      
      // Auto-generated backend fields
      qr_id: generateChallanNo(),
      valid_from: validFromDate,
      valid_upto: validUptoDate, 
    };

    // 4. Insert into Drizzle / Postgres
    const [newDispatch] = await db
      .insert(dispatches)
      .values(payload)
      .returning(); // .returning() ensures we get the generated row back (including qr_id)

    // 5. Send success response back to the Client Component
    return { 
      success: true, 
      data: newDispatch 
    };

  } catch (error) {
    console.error("Error creating dispatch:", error);
    
    // Check if it's a unique constraint error (extremely rare chance of same JK- number)
    if (error.code === '23505') {
       return { success: false, error: "Challan collision. Please try generating again." };
    }

    return { 
      success: false, 
      error: "Failed to generate dispatch due to a server error." 
    };
  }
}