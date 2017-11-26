<template lang="html">
  <div class="trix-cl">
    <textarea :id="id" style="display:none;" :name="name" class="form-control" v-model="model" rows="5" cols="80">
    </textarea>
    <trix-editor class="trix-content" :input="id"></trix-editor>
  </div>   
</template>

<script>

import axios from 'axios';

export default {
  created() {

  },
  watch: {
    content: function(val, oldVal) {
   
    },
  },
  props:['id', 'model', 'name'],

  methods: {
   
  },
  mounted() {
    let that = this;
    
    document.addEventListener('trix-change', function(e) {
      that.model = e.target.value;
    });
    var host, uploadAttachment;

    Trix.config.attachments.preview.caption = {
      name: false,
      size: false
    };

    document.addEventListener("trix-attachment-add", function(event) {
      var attachment;
      attachment = event.attachment;

      if (attachment.file) {
        uploadAttachment(attachment).then(function(result) {
          var editor = event.target.editor
          var originalRange = editor.getSelectedRange()
          var attachmentRange = editor.getDocument().getRangeOfAttachment(attachment)

          editor.setSelectedRange(attachmentRange)
          editor.activateAttribute("caption", result.name + " " + result.size);
          editor.setSelectedRange(originalRange)

          attachment.setAttributes({
            url: result.link,
            href: result.link,
          });
        }).catch( (err) => {
          that.$message('Upload failed', err);
          attachment.remove();
        });
      }
    });

    host = "/api/upload";

    uploadAttachment = function(attachment) {
      return new Promise((resolve, reject) => {
        var file, form, key, xhr;
        file = attachment.file;
        form = new FormData;
        form.append("Content-Type", file.type);
        form.append("file", file);
        xhr = new XMLHttpRequest;

        xhr.upload.onprogress = function(event) {
          var progress;
          progress = event.loaded / event.total * 100;
          attachment.setUploadProgress(progress);
        };
        xhr.onload = function() {
          var url;
          if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            url = 'http://localhost:3000/uploads/' + response.data.name;
            let data = {link: url, name: response.data.name, size: response.data.size};
            resolve(data);
          } else {
            reject({status: 400, message: "Upload failed"});
            alert("Upload failed. Try to reload the page.");
          }
        };

        xhr.onerror = () => reject(xhr.statusText);

        xhr.open("POST", host, true);
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('access_token')}`);

        xhr.send(form);
      });
    };
  }
}
</script>

<style lang="scss" scoped>

</style>
