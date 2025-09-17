# Organization


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**slug** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**avatarUrl** | **string** |  | [optional] [default to undefined]
**websiteUrl** | **string** |  | [optional] [default to undefined]
**organizationType** | **string** |  | [optional] [default to undefined]
**visibility** | **string** |  | [optional] [default to undefined]
**plan** | **string** |  | [optional] [default to undefined]
**maxStorageGb** | **number** |  | [optional] [default to undefined]
**usedStorageBytes** | **number** |  | [optional] [default to undefined]
**maxMembers** | **number** |  | [optional] [default to undefined]
**maxVideos** | **number** |  | [optional] [default to undefined]
**settings** | **{ [key: string]: any; }** |  | [optional] [default to undefined]
**s3Bucket** | **string** |  | [optional] [default to undefined]
**customDomain** | **string** |  | [optional] [default to undefined]
**active** | **boolean** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**updatedAt** | **string** |  | [optional] [default to undefined]
**memberships** | [**Array&lt;OrganizationMembership&gt;**](OrganizationMembership.md) |  | [optional] [default to undefined]
**memberCount** | **number** |  | [optional] [default to undefined]
**videoCount** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { Organization } from './api';

const instance: Organization = {
    id,
    name,
    slug,
    description,
    avatarUrl,
    websiteUrl,
    organizationType,
    visibility,
    plan,
    maxStorageGb,
    usedStorageBytes,
    maxMembers,
    maxVideos,
    settings,
    s3Bucket,
    customDomain,
    active,
    createdAt,
    updatedAt,
    memberships,
    memberCount,
    videoCount,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
