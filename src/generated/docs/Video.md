# Video


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**organizationId** | **string** |  | [optional] [default to undefined]
**userId** | **string** |  | [optional] [default to undefined]
**title** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**s3Bucket** | **string** |  | [optional] [default to undefined]
**s3Key** | **string** |  | [optional] [default to undefined]
**fileSize** | **number** |  | [optional] [default to undefined]
**contentType** | **string** |  | [optional] [default to undefined]
**originalFilename** | **string** |  | [optional] [default to undefined]
**etag** | **string** |  | [optional] [default to undefined]
**uploadId** | **string** |  | [optional] [default to undefined]
**durationSeconds** | **number** |  | [optional] [default to undefined]
**width** | **number** |  | [optional] [default to undefined]
**height** | **number** |  | [optional] [default to undefined]
**thumbnailS3Path** | **string** |  | [optional] [default to undefined]
**uploadStatus** | **string** |  | [optional] [default to undefined]
**processingStatus** | **string** |  | [optional] [default to undefined]
**visibility** | **string** |  | [optional] [default to undefined]
**sharedWith** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**tags** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**updatedAt** | **string** |  | [optional] [default to undefined]
**metadataExtracted** | **boolean** |  | [optional] [default to undefined]
**metadataExtractionError** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { Video } from './api';

const instance: Video = {
    id,
    organizationId,
    userId,
    title,
    description,
    s3Bucket,
    s3Key,
    fileSize,
    contentType,
    originalFilename,
    etag,
    uploadId,
    durationSeconds,
    width,
    height,
    thumbnailS3Path,
    uploadStatus,
    processingStatus,
    visibility,
    sharedWith,
    tags,
    createdAt,
    updatedAt,
    metadataExtracted,
    metadataExtractionError,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
