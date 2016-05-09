---
layout: post
title: Identifying what quota is exceeded in Google Cloud
date: 2020-04-16
---

Say you're trying to launch a Compute Engine VM, but instead see get two log entries:

```
RESOURCE_EXHAUSTED {...}
QUOTA_EXCEEDED {...}
```

Unfortunately it won't show you what quota is causing the issue:

```
{
 insertId: "8m7sncg10ryu27"  
 jsonPayload: {
  error: [
   0: {
    code: "QUOTA_EXCEEDED"     
    detail_message: ""     
    location: ""     
   }
  ]
  event_subtype: "compute.instances.insert"   
  event_type: "GCE_OPERATION_DONE"   
  operation: {
   id: "7423996065872195857"    
   name: "operation-1587023870250-5a363ca094e20-aa192fac-ada42d3c"    
   type: "operation"    
   zone: "europe-west3-a"    
  }
 },
 severity: "ERROR"  
}
```

You can the gcloud command line tool to look up details about the operation and find out what quota was exceeded. Take the operation name from the log entry.

Note that the `--zone` parameter is not optional.

```
gcloud compute operations describe\ 
  operation-1587025770250-5a363ca094e20-aa192fac-ada42d3c\
  --zone=europe-west3-a 
```

This will print the details of the operation:

```
endTime: '2020-04-16T00:58:05.554-07:00'
error:
  errors:
  - code: QUOTA_EXCEEDED
    message: "Quota 'IN_USE_ADDRESSES' exceeded.  Limit: 8.0 in region europe-west3."
httpErrorMessage: FORBIDDEN
httpErrorStatusCode: 403
id: '7423996065872125857'
kind: compute#operation
name: operation-1587023870250-5a363ca0c4e20-aa192fac-ada42d3c
operationType: insert
progress: 100
startTime: '2020-04-16T00:57:52.299-07:00'
status: DONE
targetId: '2991640763302261009'
user: example@appspot.gserviceaccount.com
zone: https://www.googleapis.com/compute/v1/projects/example/zones/europe-west3-a
```