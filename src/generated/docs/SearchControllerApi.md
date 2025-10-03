# SearchControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**search**](#search) | **GET** /api/search | |

# **search**
> SearchResponse search()


### Example

```typescript
import {
    SearchControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SearchControllerApi(configuration);

let q: string; // (default to undefined)
let limit: number; // (optional) (default to 10)

const { status, data } = await apiInstance.search(
    q,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **q** | [**string**] |  | defaults to undefined|
| **limit** | [**number**] |  | (optional) defaults to 10|


### Return type

**SearchResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

