import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Response interfaces
export interface CostDetails {
  transcodingCostPerMBinRupees: string;
  hostingCostPer30DaysInRupees: string;
  objectStorageCostPerGBInRupeesFor30Days: string;
}

export interface TranscodingCost {
  transcodingCostPerMBinRupees: string;
}

export interface HostingCost {
  hostingCostPer30DaysInRupees: string;
}

export interface ObjectStorageCost {
  objectStorageCostPerGBInRupeesFor30Days: string;
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

/**
 * Get all cost details for all services
 * @returns Promise with all cost details
 */
export const getAllCostDetails = async (): Promise<CostDetails> => {
  try {
    const response = await axios.get<ApiResponse<CostDetails>>(
      `${API_BASE_URL}/api/v1/cost/details`
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching cost details:', error);
    throw error;
  }
};

/**
 * Get transcoding cost per MB
 * @returns Promise with transcoding cost
 */
export const getTranscodingCost = async (): Promise<string> => {
  try {
    const response = await axios.get<ApiResponse<TranscodingCost>>(
      `${API_BASE_URL}/api/v1/cost/transcoding-cost-per-mb`
    );
    return response.data.data.transcodingCostPerMBinRupees;
  } catch (error) {
    console.error('Error fetching transcoding cost:', error);
    throw error;
  }
};

/**
 * Get hosting cost per 30 days
 * @returns Promise with hosting cost
 */
export const getHostingCost = async (): Promise<string> => {
  try {
    const response = await axios.get<ApiResponse<HostingCost>>(
      `${API_BASE_URL}/api/v1/cost/hosting-cost-per-30-days`
    );
    return response.data.data.hostingCostPer30DaysInRupees;
  } catch (error) {
    console.error('Error fetching hosting cost:', error);
    throw error;
  }
};

/**
 * Get object storage cost per GB for 30 days
 * @returns Promise with object storage cost
 */
export const getObjectStorageCost = async (): Promise<string> => {
  try {
    const response = await axios.get<ApiResponse<ObjectStorageCost>>(
      `${API_BASE_URL}/api/v1/cost/object-storage-cost-per-gb-for-30-days`
    );
    return response.data.data.objectStorageCostPerGBInRupeesFor30Days;
  } catch (error) {
    console.error('Error fetching object storage cost:', error);
    throw error;
  }
};

/**
 * Format cost value for display
 * @param cost - Cost value as string
 * @returns Formatted cost string with rupee symbol
 */
export const formatCost = (cost: string): string => {
  const numericCost = parseFloat(cost);
  if (isNaN(numericCost)) return '₹0.00';
  return `₹${numericCost.toFixed(2)}`;
};

/**
 * Calculate total cost based on quantity
 * @param costPerUnit - Cost per unit as string
 * @param quantity - Quantity (MB, GB, or units)
 * @returns Total cost
 */
export const calculateTotalCost = (costPerUnit: string, quantity: number): number => {
  const cost = parseFloat(costPerUnit);
  if (isNaN(cost)) return 0;
  return cost * quantity;
};
