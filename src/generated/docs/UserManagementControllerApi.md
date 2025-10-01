# UserManagementControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addUserToGroup**](#addusertogroup) | **POST** /api/admin/users/{username}/groups/{groupName} | |
|[**deleteUser**](#deleteuser) | **DELETE** /api/admin/users/{username} | |
|[**disableUser**](#disableuser) | **POST** /api/admin/users/{username}/disable | |
|[**enableUser**](#enableuser) | **POST** /api/admin/users/{username}/enable | |
|[**getUser**](#getuser) | **GET** /api/admin/users/{username} | |
|[**listGroups**](#listgroups) | **GET** /api/admin/users/groups | |
|[**listUsers**](#listusers) | **GET** /api/admin/users | |
|[**removeUserFromGroup**](#removeuserfromgroup) | **DELETE** /api/admin/users/{username}/groups/{groupName} | |
|[**updateUser**](#updateuser) | **PUT** /api/admin/users/{username} | |

# **addUserToGroup**
> { [key: string]: string; } addUserToGroup()


### Example

```typescript
import {
    UserManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserManagementControllerApi(configuration);

let username: string; // (default to undefined)
let groupName: string; // (default to undefined)

const { status, data } = await apiInstance.addUserToGroup(
    username,
    groupName
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **username** | [**string**] |  | defaults to undefined|
| **groupName** | [**string**] |  | defaults to undefined|


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

# **deleteUser**
> { [key: string]: string; } deleteUser()


### Example

```typescript
import {
    UserManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserManagementControllerApi(configuration);

let username: string; // (default to undefined)

const { status, data } = await apiInstance.deleteUser(
    username
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **username** | [**string**] |  | defaults to undefined|


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

# **disableUser**
> { [key: string]: string; } disableUser()


### Example

```typescript
import {
    UserManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserManagementControllerApi(configuration);

let username: string; // (default to undefined)

const { status, data } = await apiInstance.disableUser(
    username
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **username** | [**string**] |  | defaults to undefined|


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

# **enableUser**
> { [key: string]: string; } enableUser()


### Example

```typescript
import {
    UserManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserManagementControllerApi(configuration);

let username: string; // (default to undefined)

const { status, data } = await apiInstance.enableUser(
    username
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **username** | [**string**] |  | defaults to undefined|


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

# **getUser**
> CognitoUserDto getUser()


### Example

```typescript
import {
    UserManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserManagementControllerApi(configuration);

let username: string; // (default to undefined)

const { status, data } = await apiInstance.getUser(
    username
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **username** | [**string**] |  | defaults to undefined|


### Return type

**CognitoUserDto**

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

# **listGroups**
> Array<string> listGroups()


### Example

```typescript
import {
    UserManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserManagementControllerApi(configuration);

const { status, data } = await apiInstance.listGroups();
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

# **listUsers**
> UserListResponse listUsers()


### Example

```typescript
import {
    UserManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserManagementControllerApi(configuration);

let paginationToken: string; // (optional) (default to undefined)
let limit: number; // (optional) (default to 60)

const { status, data } = await apiInstance.listUsers(
    paginationToken,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **paginationToken** | [**string**] |  | (optional) defaults to undefined|
| **limit** | [**number**] |  | (optional) defaults to 60|


### Return type

**UserListResponse**

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

# **removeUserFromGroup**
> { [key: string]: string; } removeUserFromGroup()


### Example

```typescript
import {
    UserManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserManagementControllerApi(configuration);

let username: string; // (default to undefined)
let groupName: string; // (default to undefined)

const { status, data } = await apiInstance.removeUserFromGroup(
    username,
    groupName
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **username** | [**string**] |  | defaults to undefined|
| **groupName** | [**string**] |  | defaults to undefined|


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

# **updateUser**
> CognitoUserDto updateUser(updateUserRequest)


### Example

```typescript
import {
    UserManagementControllerApi,
    Configuration,
    UpdateUserRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UserManagementControllerApi(configuration);

let username: string; // (default to undefined)
let updateUserRequest: UpdateUserRequest; //

const { status, data } = await apiInstance.updateUser(
    username,
    updateUserRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateUserRequest** | **UpdateUserRequest**|  | |
| **username** | [**string**] |  | defaults to undefined|


### Return type

**CognitoUserDto**

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

