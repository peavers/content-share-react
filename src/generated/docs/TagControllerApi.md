# TagControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addTagsToVideo**](#addtagstovideo) | **POST** /api/tags/video/{videoId} | |
|[**createTag**](#createtag) | **POST** /api/tags | |
|[**deleteTag**](#deletetag) | **DELETE** /api/tags | |
|[**deleteTagById**](#deletetagbyid) | **DELETE** /api/tags/{tagId} | |
|[**getAllTags**](#getalltags) | **GET** /api/tags | |
|[**getChildTags**](#getchildtags) | **GET** /api/tags/children | |
|[**getRootTags**](#getroottags) | **GET** /api/tags/root | |
|[**getTagTree**](#gettagtree) | **GET** /api/tags/tree | |
|[**getVideoTags**](#getvideotags) | **GET** /api/tags/video/{videoId} | |
|[**removeTagFromVideo**](#removetagfromvideo) | **DELETE** /api/tags/video/{videoId} | |
|[**replaceVideoTags**](#replacevideotags) | **PUT** /api/tags/video/{videoId} | |
|[**updateTag**](#updatetag) | **PUT** /api/tags/{tagId} | |

# **addTagsToVideo**
> addTagsToVideo(addTagsRequest)


### Example

```typescript
import {
    TagControllerApi,
    Configuration,
    AddTagsRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TagControllerApi(configuration);

let videoId: string; // (default to undefined)
let addTagsRequest: AddTagsRequest; //

const { status, data } = await apiInstance.addTagsToVideo(
    videoId,
    addTagsRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **addTagsRequest** | **AddTagsRequest**|  | |
| **videoId** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createTag**
> Tag createTag(createTagRequest)


### Example

```typescript
import {
    TagControllerApi,
    Configuration,
    CreateTagRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TagControllerApi(configuration);

let createTagRequest: CreateTagRequest; //

const { status, data } = await apiInstance.createTag(
    createTagRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createTagRequest** | **CreateTagRequest**|  | |


### Return type

**Tag**

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

# **deleteTag**
> deleteTag()


### Example

```typescript
import {
    TagControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TagControllerApi(configuration);

let path: string; // (default to undefined)
let deleteChildren: boolean; // (optional) (default to false)

const { status, data } = await apiInstance.deleteTag(
    path,
    deleteChildren
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **path** | [**string**] |  | defaults to undefined|
| **deleteChildren** | [**boolean**] |  | (optional) defaults to false|


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

# **deleteTagById**
> deleteTagById()


### Example

```typescript
import {
    TagControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TagControllerApi(configuration);

let tagId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteTagById(
    tagId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tagId** | [**number**] |  | defaults to undefined|


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

# **getAllTags**
> Array<Tag> getAllTags()


### Example

```typescript
import {
    TagControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TagControllerApi(configuration);

const { status, data } = await apiInstance.getAllTags();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Tag>**

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

# **getChildTags**
> Array<Tag> getChildTags()


### Example

```typescript
import {
    TagControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TagControllerApi(configuration);

let parentPath: string; // (default to undefined)

const { status, data } = await apiInstance.getChildTags(
    parentPath
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **parentPath** | [**string**] |  | defaults to undefined|


### Return type

**Array<Tag>**

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

# **getRootTags**
> Array<Tag> getRootTags()


### Example

```typescript
import {
    TagControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TagControllerApi(configuration);

const { status, data } = await apiInstance.getRootTags();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Tag>**

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

# **getTagTree**
> Array<TagNode> getTagTree()


### Example

```typescript
import {
    TagControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TagControllerApi(configuration);

const { status, data } = await apiInstance.getTagTree();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<TagNode>**

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

# **getVideoTags**
> Array<Tag> getVideoTags()


### Example

```typescript
import {
    TagControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TagControllerApi(configuration);

let videoId: string; // (default to undefined)

const { status, data } = await apiInstance.getVideoTags(
    videoId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **videoId** | [**string**] |  | defaults to undefined|


### Return type

**Array<Tag>**

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

# **removeTagFromVideo**
> removeTagFromVideo()


### Example

```typescript
import {
    TagControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TagControllerApi(configuration);

let videoId: string; // (default to undefined)
let path: string; // (default to undefined)

const { status, data } = await apiInstance.removeTagFromVideo(
    videoId,
    path
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **videoId** | [**string**] |  | defaults to undefined|
| **path** | [**string**] |  | defaults to undefined|


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

# **replaceVideoTags**
> replaceVideoTags(addTagsRequest)


### Example

```typescript
import {
    TagControllerApi,
    Configuration,
    AddTagsRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TagControllerApi(configuration);

let videoId: string; // (default to undefined)
let addTagsRequest: AddTagsRequest; //

const { status, data } = await apiInstance.replaceVideoTags(
    videoId,
    addTagsRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **addTagsRequest** | **AddTagsRequest**|  | |
| **videoId** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateTag**
> Tag updateTag(updateTagRequest)


### Example

```typescript
import {
    TagControllerApi,
    Configuration,
    UpdateTagRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TagControllerApi(configuration);

let tagId: number; // (default to undefined)
let updateTagRequest: UpdateTagRequest; //

const { status, data } = await apiInstance.updateTag(
    tagId,
    updateTagRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateTagRequest** | **UpdateTagRequest**|  | |
| **tagId** | [**number**] |  | defaults to undefined|


### Return type

**Tag**

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

