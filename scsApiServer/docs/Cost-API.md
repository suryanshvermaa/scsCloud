# Cost API Documentation

## Overview
The Cost API provides endpoints for retrieving pricing information for various services offered by the platform. These endpoints are publicly accessible and do not require authentication.

**Base URL:** `/api/v1/cost`

**Authentication:** None required (Public endpoints)

---

## Table of Contents
- [Get All Cost Details](#1-get-all-cost-details)
- [Get Transcoding Cost](#2-get-transcoding-cost)
- [Get Hosting Cost](#3-get-hosting-cost)
- [Get Object Storage Cost](#4-get-object-storage-cost)

---

## Endpoints

### 1. Get All Cost Details

Retrieve pricing information for all available services in a single request.

**Endpoint:** `GET /api/v1/cost/details`

**Request:**
- No parameters required
- No authentication required

**Response:**
```json
{
  "statusCode": 200,
  "message": "Cost details fetched successfully",
  "data": {
    "transcodingCostPerMBinRupees": "string - Cost per MB for video transcoding",
    "hostingCostPer30DaysInRupees": "string - Cost for 30 days of hosting",
    "objectStorageCostPerGBInRupeesFor30Days": "string - Cost per GB for 30 days of storage"
  }
}
```

**Example Response:**
```json
{
  "statusCode": 200,
  "message": "Cost details fetched successfully",
  "data": {
    "transcodingCostPerMBinRupees": "0.50",
    "hostingCostPer30DaysInRupees": "100",
    "objectStorageCostPerGBInRupeesFor30Days": "10"
  }
}
```

**Use Cases:**
- Display pricing information on landing page
- Show cost estimates in the application
- Calculate total costs before service activation

---

### 2. Get Transcoding Cost

Retrieve the cost per MB for video transcoding service.

**Endpoint:** `GET /api/v1/cost/transcoding-cost-per-mb`

**Request:**
- No parameters required
- No authentication required

**Response:**
```json
{
  "statusCode": 200,
  "message": "Transcoding cost per MB fetched successfully",
  "data": {
    "transcodingCostPerMBinRupees": "string - Cost per MB for video transcoding"
  }
}
```

**Example Response:**
```json
{
  "statusCode": 200,
  "message": "Transcoding cost per MB fetched successfully",
  "data": {
    "transcodingCostPerMBinRupees": "0.50"
  }
}
```

**Service Description:**
- Video transcoding service converts videos to different formats/qualities
- Cost is charged per MB of input video file
- Pricing is configured via `TRANSCODER_SERVICE_CHARGE` environment variable

**Cost Calculation Example:**
```
Video File Size: 100 MB
Cost per MB: ₹0.50
Total Cost: 100 × 0.50 = ₹50
```

---

### 3. Get Hosting Cost

Retrieve the cost for 30 days of website hosting service.

**Endpoint:** `GET /api/v1/cost/hosting-cost-per-30-days`

**Request:**
- No parameters required
- No authentication required

**Response:**
```json
{
  "statusCode": 200,
  "message": "Hosting cost per 30 days fetched successfully",
  "data": {
    "hostingCostPer30DaysInRupees": "string - Cost for 30 days of hosting"
  }
}
```

**Example Response:**
```json
{
  "statusCode": 200,
  "message": "Hosting cost per 30 days fetched successfully",
  "data": {
    "hostingCostPer30DaysInRupees": "100"
  }
}
```

**Service Description:**
- Static website hosting service
- Cost is charged per 30-day period
- Includes subdomain-based routing
- Pricing is configured via `HOSTING_SERVICE_CHARGE_PER_30_DAYS` environment variable

**Billing Cycle:**
- Fixed 30-day billing period
- Service expires after 30 days unless renewed
- Cost remains constant regardless of traffic or storage used

---

### 4. Get Object Storage Cost

Retrieve the cost per GB for 30 days of object storage service.

**Endpoint:** `GET /api/v1/cost/object-storage-cost-per-gb-for-30-days`

**Request:**
- No parameters required
- No authentication required

**Response:**
```json
{
  "statusCode": 200,
  "message": "Object storage cost per GB for 30 days fetched successfully",
  "data": {
    "objectStorageCostPerGBInRupeesFor30Days": "string - Cost per GB for 30 days"
  }
}
```

**Example Response:**
```json
{
  "statusCode": 200,
  "message": "Object storage cost per GB for 30 days fetched successfully",
  "data": {
    "objectStorageCostPerGBInRupeesFor30Days": "10"
  }
}
```

**Service Description:**
- S3-compatible object storage service
- Cost is charged per GB per 30-day period
- Pricing is configured via `OBJECT_STORAGE_COST_PER_GB` environment variable

**Cost Calculation Example:**
```
Storage Allocation: 5 GB
Cost per GB: ₹10
Total Cost: 5 × 10 = ₹50 for 30 days
```

**Billing Notes:**
- Cost is based on allocated storage, not actual usage
- Service expires after 30 days unless extended
- Extension requires payment for another 30-day period

---

## Response Format

All endpoints follow a consistent response format:

```json
{
  "statusCode": number,
  "message": "string",
  "data": {
    // Response data
  }
}
```

---

## Pricing Configuration

All pricing is configured through environment variables:

| Environment Variable | Description | Used By |
|---------------------|-------------|---------|
| `TRANSCODER_SERVICE_CHARGE` | Cost per MB for transcoding | Transcoding Service |
| `HOSTING_SERVICE_CHARGE_PER_30_DAYS` | Cost for 30 days of hosting | Hosting Service |
| `OBJECT_STORAGE_COST_PER_GB` | Cost per GB for 30 days | Object Storage Service |

---

## Currency

All costs are denominated in **Indian Rupees (INR/₹)**.

---

## Integration Examples

### JavaScript/TypeScript
```typescript
// Fetch all cost details
async function getAllCosts() {
  const response = await fetch('https://api.example.com/api/v1/cost/details');
  const data = await response.json();
  console.log(data.data);
}

// Fetch specific service cost
async function getTranscodingCost() {
  const response = await fetch('https://api.example.com/api/v1/cost/transcoding-cost-per-mb');
  const data = await response.json();
  return parseFloat(data.data.transcodingCostPerMBinRupees);
}
```

### Python
```python
import requests

# Fetch all cost details
def get_all_costs():
    response = requests.get('https://api.example.com/api/v1/cost/details')
    return response.json()['data']

# Calculate transcoding cost
def calculate_transcoding_cost(file_size_mb):
    response = requests.get('https://api.example.com/api/v1/cost/transcoding-cost-per-mb')
    cost_per_mb = float(response.json()['data']['transcodingCostPerMBinRupees'])
    return file_size_mb * cost_per_mb
```

### cURL
```bash
# Get all cost details
curl https://api.example.com/api/v1/cost/details

# Get transcoding cost
curl https://api.example.com/api/v1/cost/transcoding-cost-per-mb

# Get hosting cost
curl https://api.example.com/api/v1/cost/hosting-cost-per-30-days

# Get object storage cost
curl https://api.example.com/api/v1/cost/object-storage-cost-per-gb-for-30-days
```

---

## Use Cases

### 1. Pricing Page Display
Use the `/details` endpoint to fetch all pricing information at once for displaying on your pricing page.

### 2. Cost Calculator
Fetch individual service costs to build interactive calculators:
- Transcoding calculator: Input video size → Calculate cost
- Storage calculator: Input GB needed → Calculate monthly cost
- Hosting calculator: Show fixed monthly cost

### 3. Pre-Purchase Validation
Check costs before allowing users to purchase services to ensure they have sufficient balance (SCS Coins).

### 4. Dynamic Pricing Updates
Periodically fetch costs to keep your frontend in sync with backend pricing changes without requiring app updates.

---

## Best Practices

1. **Cache Cost Data**: Cost information typically doesn't change frequently, so consider caching the response for a reasonable period (e.g., 1 hour).

2. **Error Handling**: Always implement proper error handling when fetching cost data to gracefully handle network issues.

3. **User-Friendly Display**: Convert string values to numbers for calculations and format them appropriately for display (e.g., "₹10.00" instead of "10").

4. **Real-Time Calculations**: Use cost data to provide real-time cost estimates as users configure their service requirements.

5. **Currency Display**: Always display the currency symbol (₹) alongside the cost to avoid confusion.

---

## Notes

- All endpoints return costs as strings; convert to numbers for calculations
- Costs are subject to change via environment variable updates
- No rate limiting applied to these public endpoints
- All endpoints return HTTP 200 status code on success
- These endpoints do not require authentication or authorization

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-27 | Initial Cost API documentation |

---

## Support

For pricing inquiries or questions about billing, please contact the support team or refer to the main API documentation at `docs/API.md`.
