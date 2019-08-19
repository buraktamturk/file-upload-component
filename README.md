# File Upload Component

A work in progress HTML file upload with customizable upload backend. 

## Usage

### Register Component

```javascript
  var UploadControllerFactory = require('uploadcontroller');

  var UploadController = UploadControllerFactory({

    // specify a built in upload method,
    upload: UploadControllerFactory.XHR({
      xhrUrl: 'http://localhost/upload.php?filename=$file', // you can use $file to put file name to the URL
      xhrAsFormData: true, // if true, it sends the file as multipart data. Otherwise the whole file is sent as a body with correct mime type
      xhrFormDataFileKey: 'file', // if xhrAsFormData true, 

      xhrMethod: 'POST', // default
      xhrHeaders: {}, // extra headers to be sent
      xhrCallback: function(xhr) { }, // XHR hook before sending data
    })

    // or a customized one
    upload: function(name, blob, contentType, abort, progress) {
      // Disables XHR and enables custom uploading backend.
      // Function must return a promise that will resolve with a javascript object.
      // when the user aborts the uploading, the AbortSignal is fired.
      // upload progress can be reported back to library by calling progress function which accepts numbers from 0 to 1 (i.e. progress(50 / 100) means half of the upload is completed).
    },

    valueKey: 'id', 
    srcKey: 'access_url', 

    fields: ['id', 'access_url', 'name', 'size'] // save additional data from response, so they can be accessed from JavaScript with UploadController inside
  });
```

### Using it in a Form

```html
  <file-picker name="file" desc="Upload File"></file-picker>
```

### Auto-picked file

```html
  <file-picker name="file" filename="2.jpg" size="88316" src="https://www.gstatic.com/webp/gallery/2.jpg" value="11" desc="Upload File"></file-picker>
```

### Submitting Form

"valueKey" returned from the upload backend will be submitted in the form with "name" attribute on the element.