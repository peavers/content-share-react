# AwsS3ControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**abortUpload**](#abortupload) | **DELETE** /api/s3/upload/{uploadId} | |
|[**completeMultipartUpload**](#completemultipartupload) | **POST** /api/s3/upload/complete/{uploadId} | |
|[**initiateUpload**](#initiateupload) | **POST** /api/s3/upload/initiate | |
|[**listBuckets**](#listbuckets) | **GET** /api/s3/buckets | |

# **abortUpload**
> string abortUpload()


### Example

```typescript
import {
    AwsS3ControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AwsS3ControllerApi(configuration);

let uploadId: string; // (default to undefined)

const { status, data } = await apiInstance.abortUpload(
    uploadId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **uploadId** | [**string**] |  | defaults to undefined|


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

# **completeMultipartUpload**
> string completeMultipartUpload(uploadCompletionRequest)


### Example

```typescript
import {
    AwsS3ControllerApi,
    Configuration,
    UploadCompletionRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AwsS3ControllerApi(configuration);

let uploadId: string; // (default to undefined)
let uploadCompletionRequest: UploadCompletionRequest; //

const { status, data } = await apiInstance.completeMultipartUpload(
    uploadId,
    uploadCompletionRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **uploadCompletionRequest** | **UploadCompletionRequest**|  | |
| **uploadId** | [**string**] |  | defaults to undefined|


### Return type

**string**

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

# **initiateUpload**
> UploadResult initiateUpload(uploadRequest)


### Example

```typescript
import {
    AwsS3ControllerApi,
    Configuration,
    UploadRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AwsS3ControllerApi(configuration);

let uploadRequest: UploadRequest; //

const { status, data } = await apiInstance.initiateUpload(
    uploadRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **uploadRequest** | **UploadRequest**|  | |


### Return type

**UploadResult**

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

# **listBuckets**
> Array<string> listBuckets()


### Example

```typescript
import {
    AwsS3ControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AwsS3ControllerApi(configuration);

const { status, data } = await apiInstance.listBuckets();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<string>**

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

