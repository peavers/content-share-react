# UserControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getCurrentUser**](#getcurrentuser) | **GET** /api/users/me | |
|[**getUserProfile**](#getuserprofile) | **GET** /api/users/profile | |
|[**getUserStatus**](#getuserstatus) | **GET** /api/users/status | |
|[**updateCurrentUser**](#updatecurrentuser) | **PUT** /api/users/me | |
|[**updateUserProfile**](#updateuserprofile) | **PUT** /api/users/profile | |
|[**validateToken**](#validatetoken) | **GET** /api/users/validate | |

# **getCurrentUser**
> UserResponse getCurrentUser()


### Example

```typescript
import {
    UserControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

const { status, data } = await apiInstance.getCurrentUser();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**UserResponse**

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

# **getUserProfile**
> UserProfileDto getUserProfile()


### Example

```typescript
import {
    UserControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

const { status, data } = await apiInstance.getUserProfile();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**UserProfileDto**

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

# **getUserStatus**
> UserStatusResponse getUserStatus()


### Example

```typescript
import {
    UserControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

const { status, data } = await apiInstance.getUserStatus();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**UserStatusResponse**

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

# **updateCurrentUser**
> UserResponse updateCurrentUser(updateUserProfileRequest)


### Example

```typescript
import {
    UserControllerApi,
    Configuration,
    UpdateUserProfileRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

let updateUserProfileRequest: UpdateUserProfileRequest; //

const { status, data } = await apiInstance.updateCurrentUser(
    updateUserProfileRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateUserProfileRequest** | **UpdateUserProfileRequest**|  | |


### Return type

**UserResponse**

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

# **updateUserProfile**
> UserProfileDto updateUserProfile(userProfileDto)


### Example

```typescript
import {
    UserControllerApi,
    Configuration,
    UserProfileDto
} from './api';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

let userProfileDto: UserProfileDto; //

const { status, data } = await apiInstance.updateUserProfile(
    userProfileDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userProfileDto** | **UserProfileDto**|  | |


### Return type

**UserProfileDto**

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

# **validateToken**
> { [key: string]: any; } validateToken()


### Example

```typescript
import {
    UserControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

const { status, data } = await apiInstance.validateToken();
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

