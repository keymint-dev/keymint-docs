---
layout: ../../../layouts/DocsLayout.astro
title: Deactivate Device
currentPage: /docs/api/licenses/deactivate
---

# Deactivate Device

Remove a device registration (`hostId`) from a license key (`licenseKey`), freeing up an activation slot. Specify a `hostId` to remove a particular device, or omit it to deactivate _all_ devices associated with the license key.

## Endpoint

```http
POST /deactivate-key
```

Base URL: `https://api.keymint.dev`

## Request Details

Send a `POST` request with a JSON body and `Content-Type: application/json`. Include the `accessToken` as a Bearer token in the `Authorization` header.

### Headers

| **Header**      | **Value**              | **Required** | **Description**                      |
| --------------- | ---------------------- | ------------ | ------------------------------------ |
| `Authorization` | `Bearer <accessToken>` | **Yes**      | API access token for authentication. |

### Body Parameters

| **Parameter** | **Type** | **Required** | **Description**                                                                                      |
| ------------- | -------- | ------------ | ---------------------------------------------------------------------------------------------------- |
| `productId`   | `string` | **Yes**      | Unique product identifier (e.g., `prod_...`).                                                        |
| `licenseKey`  | `string` | **Yes**      | License key string (e.g., `lk_...`).                                                                 |
| `hostId`      | `string` | No           | Unique identifier of the device to deactivate. If omitted, all devices for this key are deactivated. |

### Example Requests

#### Deactivate a Specific Device

```http
POST /deactivate-key HTTP/1.1
Host: api.keymint.dev
Authorization: Bearer at_verylongaccesstokenstringgeneratedforyourapplication12345678
Content-Type: application/json

{
  "productId": "your_product_id_123",
  "licenseKey": "xxxxx-xxxxx-xxxxx-xxxxx",
  "hostId": "a1:b2:c3:d4:e5:f6-hashed-uuid-or-other-id"
}
```

#### Deactivate All Devices

```http
POST /deactivate-key HTTP/1.1
Host: api.keymint.dev
Authorization: Bearer at_verylongaccesstokenstringgeneratedforyourapplication12345678
Content-Type: application/json

{
  "productId": "your_product_id_123",
  "licenseKey": "xxxxx-xxxxx-xxxxx-xxxxx"
}
```

## Responses

The API returns a JSON object confirming the deactivation.

### Success Response (200 OK)

```json
{
  "message": "Device deactivated",
  "code": 0
}
```

### Error Responses

| **Status Code** | **Code** | **Description**                                                          | **Example Response Body**                           |
| --------------- | -------- | ------------------------------------------------------------------------ | --------------------------------------------------- |
| 400             | 1        | Missing required parameters (`productId`, `licenseKey`).                 | `{"message": "Missing required params", "code": 1}` |
| 401             | 1        | Invalid or missing `accessToken` in the `Authorization` header.          | `{"message": "Invalid access token", "code": 1}`    |
| 403             | 2        | License is not active (cannot deactivate if already inactive).           | `{"message": "License not activated", "code": 2}`   |
| 404             | 1        | `productId`, `licenseKey`, or specific `hostId` (if provided) not found. | `{"message": "Device not found", "code": 1}`        |
| 500             | 1        | Internal server error during deactivation.                               | `{"message": "Server error", "code": 1}`            |
