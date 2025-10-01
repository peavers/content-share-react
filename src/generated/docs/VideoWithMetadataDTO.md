# VideoWithMetadataDTO

Video with its associated metadata

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**video** | [**Video**](Video.md) | Video information | [optional] [default to undefined]
**metadata** | [**VideoMetadata**](VideoMetadata.md) | Video metadata extracted by Lambda processor (may be null if not yet processed) | [optional] [default to undefined]

## Example

```typescript
import { VideoWithMetadataDTO } from './api';

const instance: VideoWithMetadataDTO = {
    video,
    metadata,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
