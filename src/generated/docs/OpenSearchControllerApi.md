# OpenSearchControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**bulkIngest**](#bulkingest) | **POST** /api/opensearch/bulk-ingest | |
|[**deleteDocument**](#deletedocument) | **DELETE** /api/opensearch/index/{index}/{id} | |
|[**deleteIndex**](#deleteindex) | **DELETE** /api/opensearch/indices/{index} | |
|[**health**](#health) | **GET** /api/opensearch/health | |
|[**indexDocument**](#indexdocument) | **POST** /api/opensearch/index/{index}/{id} | |
|[**initializeIndices**](#initializeindices) | **POST** /api/opensearch/indices/initialize | |
|[**search1**](#search1) | **GET** /api/opensearch/search | |
|[**searchDocuments**](#searchdocuments) | **GET** /api/opensearch/search/{index} | |

# **bulkIngest**
> BulkIngestionResult bulkIngest()


### Example

```typescript
import {
    OpenSearchControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OpenSearchControllerApi(configuration);

const { status, data } = await apiInstance.bulkIngest();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**BulkIngestionResult**

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

# **deleteDocument**
> { [key: string]: any; } deleteDocument()


### Example

```typescript
import {
    OpenSearchControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OpenSearchControllerApi(configuration);

let index: string; // (default to undefined)
let id: string; // (default to undefined)

const { status, data } = await apiInstance.deleteDocument(
    index,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **index** | [**string**] |  | defaults to undefined|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**{ [key: string]: any; }**

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

# **deleteIndex**
> { [key: string]: any; } deleteIndex()


### Example

```typescript
import {
    OpenSearchControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OpenSearchControllerApi(configuration);

let index: string; // (default to undefined)

const { status, data } = await apiInstance.deleteIndex(
    index
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **index** | [**string**] |  | defaults to undefined|


### Return type

**{ [key: string]: any; }**

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

# **health**
> { [key: string]: string; } health()


### Example

```typescript
import {
    OpenSearchControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OpenSearchControllerApi(configuration);

const { status, data } = await apiInstance.health();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**{ [key: string]: string; }**

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

# **indexDocument**
> { [key: string]: any; } indexDocument(requestBody)


### Example

```typescript
import {
    OpenSearchControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OpenSearchControllerApi(configuration);

let index: string; // (default to undefined)
let id: string; // (default to undefined)
let requestBody: { [key: string]: any; }; //

const { status, data } = await apiInstance.indexDocument(
    index,
    id,
    requestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **{ [key: string]: any; }**|  | |
| **index** | [**string**] |  | defaults to undefined|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**{ [key: string]: any; }**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **initializeIndices**
> { [key: string]: any; } initializeIndices()


### Example

```typescript
import {
    OpenSearchControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OpenSearchControllerApi(configuration);

const { status, data } = await apiInstance.initializeIndices();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**{ [key: string]: any; }**

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

# **search1**
> SearchResponse search1()


### Example

```typescript
import {
    OpenSearchControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OpenSearchControllerApi(configuration);

let q: string; // (default to undefined)
let organizationId: string; // (optional) (default to undefined)
let limit: number; // (optional) (default to 10)

const { status, data } = await apiInstance.search1(
    q,
    organizationId,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **q** | [**string**] |  | defaults to undefined|
| **organizationId** | [**string**] |  | (optional) defaults to undefined|
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

# **searchDocuments**
> string searchDocuments()


### Example

```typescript
import {
    OpenSearchControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OpenSearchControllerApi(configuration);

let index: string; // (default to undefined)
let query: string; // (optional) (default to '*')

const { status, data } = await apiInstance.searchDocuments(
    index,
    query
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **index** | [**string**] |  | defaults to undefined|
| **query** | [**string**] |  | (optional) defaults to '*'|


### Return type

**string**

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

