# OrganizationControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**acceptInvitation**](#acceptinvitation) | **POST** /api/organizations/invitations/{token}/accept | |
|[**acceptInvitationPublic**](#acceptinvitationpublic) | **POST** /api/organizations/public/invitations/{token}/accept | |
|[**cancelInvitation**](#cancelinvitation) | **DELETE** /api/organizations/{organizationId}/invitations/{invitationId} | |
|[**createOrganization**](#createorganization) | **POST** /api/organizations | |
|[**declineInvitation**](#declineinvitation) | **POST** /api/organizations/invitations/{token}/decline | |
|[**deleteOrganization**](#deleteorganization) | **DELETE** /api/organizations/{organizationId} | |
|[**getCurrentUserMemberships**](#getcurrentusermemberships) | **GET** /api/organizations/my-memberships | |
|[**getOrganization**](#getorganization) | **GET** /api/organizations/{organizationId} | |
|[**getOrganizationInvitations**](#getorganizationinvitations) | **GET** /api/organizations/{organizationId}/invitations | |
|[**getOrganizationMembers**](#getorganizationmembers) | **GET** /api/organizations/{organizationId}/members | |
|[**getUserInvitations**](#getuserinvitations) | **GET** /api/organizations/invitations | |
|[**getUserOrganizations**](#getuserorganizations) | **GET** /api/organizations | |
|[**inviteMember**](#invitemember) | **POST** /api/organizations/{organizationId}/invitations | |
|[**removeMember**](#removemember) | **DELETE** /api/organizations/{organizationId}/members/{targetUserId} | |
|[**updateMemberRole**](#updatememberrole) | **PUT** /api/organizations/{organizationId}/members/{targetUserId} | |
|[**updateOrganization**](#updateorganization) | **PUT** /api/organizations/{organizationId} | |

# **acceptInvitation**
> OrganizationMembership acceptInvitation()


### Example

```typescript
import {
    OrganizationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrganizationControllerApi(configuration);

let token: string; // (default to undefined)

const { status, data } = await apiInstance.acceptInvitation(
    token
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **token** | [**string**] |  | defaults to undefined|


### Return type

**OrganizationMembership**

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

# **acceptInvitationPublic**
> { [key: string]: string; } acceptInvitationPublic(acceptInvitationRequest)


### Example

```typescript
import {
    OrganizationControllerApi,
    Configuration,
    AcceptInvitationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OrganizationControllerApi(configuration);

let token: string; // (default to undefined)
let acceptInvitationRequest: AcceptInvitationRequest; //

const { status, data } = await apiInstance.acceptInvitationPublic(
    token,
    acceptInvitationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **acceptInvitationRequest** | **AcceptInvitationRequest**|  | |
| **token** | [**string**] |  | defaults to undefined|


### Return type

**{ [key: string]: string; }**

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

# **cancelInvitation**
> cancelInvitation()


### Example

```typescript
import {
    OrganizationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrganizationControllerApi(configuration);

let organizationId: string; // (default to undefined)
let invitationId: number; // (default to undefined)

const { status, data } = await apiInstance.cancelInvitation(
    organizationId,
    invitationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **organizationId** | [**string**] |  | defaults to undefined|
| **invitationId** | [**number**] |  | defaults to undefined|


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

# **createOrganization**
> OrganizationResponse createOrganization(createOrganizationRequest)


### Example

```typescript
import {
    OrganizationControllerApi,
    Configuration,
    CreateOrganizationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OrganizationControllerApi(configuration);

let createOrganizationRequest: CreateOrganizationRequest; //

const { status, data } = await apiInstance.createOrganization(
    createOrganizationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createOrganizationRequest** | **CreateOrganizationRequest**|  | |


### Return type

**OrganizationResponse**

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

# **declineInvitation**
> declineInvitation()


### Example

```typescript
import {
    OrganizationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrganizationControllerApi(configuration);

let token: string; // (default to undefined)

const { status, data } = await apiInstance.declineInvitation(
    token
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **token** | [**string**] |  | defaults to undefined|


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

# **deleteOrganization**
> deleteOrganization()


### Example

```typescript
import {
    OrganizationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrganizationControllerApi(configuration);

let organizationId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteOrganization(
    organizationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **organizationId** | [**string**] |  | defaults to undefined|


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

# **getCurrentUserMemberships**
> { [key: string]: OrganizationMembership; } getCurrentUserMemberships()


### Example

```typescript
import {
    OrganizationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrganizationControllerApi(configuration);

const { status, data } = await apiInstance.getCurrentUserMemberships();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**{ [key: string]: OrganizationMembership; }**

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

# **getOrganization**
> OrganizationResponse getOrganization()


### Example

```typescript
import {
    OrganizationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrganizationControllerApi(configuration);

let organizationId: string; // (default to undefined)

const { status, data } = await apiInstance.getOrganization(
    organizationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **organizationId** | [**string**] |  | defaults to undefined|


### Return type

**OrganizationResponse**

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

# **getOrganizationInvitations**
> Array<OrganizationInvitation> getOrganizationInvitations()


### Example

```typescript
import {
    OrganizationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrganizationControllerApi(configuration);

let organizationId: string; // (default to undefined)

const { status, data } = await apiInstance.getOrganizationInvitations(
    organizationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **organizationId** | [**string**] |  | defaults to undefined|


### Return type

**Array<OrganizationInvitation>**

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

# **getOrganizationMembers**
> Array<GetOrganizationMembers200ResponseInner> getOrganizationMembers()


### Example

```typescript
import {
    OrganizationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrganizationControllerApi(configuration);

let organizationId: string; // (default to undefined)

const { status, data } = await apiInstance.getOrganizationMembers(
    organizationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **organizationId** | [**string**] |  | defaults to undefined|


### Return type

**Array<GetOrganizationMembers200ResponseInner>**

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

# **getUserInvitations**
> Array<OrganizationInvitation> getUserInvitations()


### Example

```typescript
import {
    OrganizationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrganizationControllerApi(configuration);

const { status, data } = await apiInstance.getUserInvitations();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<OrganizationInvitation>**

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

# **getUserOrganizations**
> Array<OrganizationResponse> getUserOrganizations()


### Example

```typescript
import {
    OrganizationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrganizationControllerApi(configuration);

const { status, data } = await apiInstance.getUserOrganizations();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<OrganizationResponse>**

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

# **inviteMember**
> OrganizationInvitation inviteMember(inviteMemberRequest)


### Example

```typescript
import {
    OrganizationControllerApi,
    Configuration,
    InviteMemberRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OrganizationControllerApi(configuration);

let organizationId: string; // (default to undefined)
let inviteMemberRequest: InviteMemberRequest; //

const { status, data } = await apiInstance.inviteMember(
    organizationId,
    inviteMemberRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **inviteMemberRequest** | **InviteMemberRequest**|  | |
| **organizationId** | [**string**] |  | defaults to undefined|


### Return type

**OrganizationInvitation**

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

# **removeMember**
> removeMember()


### Example

```typescript
import {
    OrganizationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrganizationControllerApi(configuration);

let organizationId: string; // (default to undefined)
let targetUserId: string; // (default to undefined)

const { status, data } = await apiInstance.removeMember(
    organizationId,
    targetUserId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **organizationId** | [**string**] |  | defaults to undefined|
| **targetUserId** | [**string**] |  | defaults to undefined|


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

# **updateMemberRole**
> OrganizationMembership updateMemberRole(requestBody)


### Example

```typescript
import {
    OrganizationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrganizationControllerApi(configuration);

let organizationId: string; // (default to undefined)
let targetUserId: string; // (default to undefined)
let requestBody: { [key: string]: string; }; //

const { status, data } = await apiInstance.updateMemberRole(
    organizationId,
    targetUserId,
    requestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **{ [key: string]: string; }**|  | |
| **organizationId** | [**string**] |  | defaults to undefined|
| **targetUserId** | [**string**] |  | defaults to undefined|


### Return type

**OrganizationMembership**

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

# **updateOrganization**
> Organization updateOrganization(createOrganizationRequest)


### Example

```typescript
import {
    OrganizationControllerApi,
    Configuration,
    CreateOrganizationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OrganizationControllerApi(configuration);

let organizationId: string; // (default to undefined)
let createOrganizationRequest: CreateOrganizationRequest; //

const { status, data } = await apiInstance.updateOrganization(
    organizationId,
    createOrganizationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createOrganizationRequest** | **CreateOrganizationRequest**|  | |
| **organizationId** | [**string**] |  | defaults to undefined|


### Return type

**Organization**

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

