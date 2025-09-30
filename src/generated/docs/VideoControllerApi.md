# VideoControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deleteVideo**](#deletevideo) | **DELETE** /api/videos/{videoId} | |
|[**getOrganizationVideos**](#getorganizationvideos) | **GET** /api/videos | |
|[**getUserVideos**](#getuservideos) | **GET** /api/videos/my-videos | |
|[**getVideo**](#getvideo) | **GET** /api/videos/{videoId} | |
|[**getVideoPresignedUrl**](#getvideopresignedurl) | **GET** /api/videos/{videoId}/presigned-url | |

# **deleteVideo**
> deleteVideo()


### Example

```typescript
import {
    VideoControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VideoControllerApi(configuration);

let videoId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteVideo(
    videoId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **videoId** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getOrganizationVideos**
> Array<Video> getOrganizationVideos()


### Example

```typescript
import {
    VideoControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VideoControllerApi(configuration);

const { status, data } = await apiInstance.getOrganizationVideos();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Video>**

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

# **getUserVideos**
> Array<Video> getUserVideos()


### Example

```typescript
import {
    VideoControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VideoControllerApi(configuration);

const { status, data } = await apiInstance.getUserVideos();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Video>**

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

# **getVideo**
> Video getVideo()


### Example

```typescript
import {
    VideoControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VideoControllerApi(configuration);

let videoId: number; // (default to undefined)

const { status, data } = await apiInstance.getVideo(
    videoId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **videoId** | [**number**] |  | defaults to undefined|


### Return type

**Video**

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

# **getVideoPresignedUrl**
> string getVideoPresignedUrl()


### Example

```typescript
import {
    VideoControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VideoControllerApi(configuration);

let videoId: number; // (default to undefined)

const { status, data } = await apiInstance.getVideoPresignedUrl(
    videoId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **videoId** | [**number**] |  | defaults to undefined|


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

