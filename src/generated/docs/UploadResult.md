# UploadResult


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**uploadId** | **string** |  | [optional] [default to undefined]
**uploadType** | **string** |  | [optional] [default to undefined]
**fileKey** | **string** |  | [optional] [default to undefined]
**chunkSize** | **number** |  | [optional] [default to undefined]
**totalChunks** | **number** |  | [optional] [default to undefined]
**presignedUrls** | [**Array&lt;PresignedUrlInfo&gt;**](PresignedUrlInfo.md) |  | [optional] [default to undefined]
**completeUrl** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { UploadResult } from './api';

const instance: UploadResult = {
    uploadId,
    uploadType,
    fileKey,
    chunkSize,
    totalChunks,
    presignedUrls,
    completeUrl,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
