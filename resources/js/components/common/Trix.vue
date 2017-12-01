<template lang="html">
  <div class="trix-cl">
    <textarea :id="id" style="display:none;" :name="name" class="form-control" rows="5" cols="80">
    </textarea>
    <trix-editor class="trix-content" :input="id"></trix-editor>
  </div>
</template>

<script>

import axios from 'axios';
import _ from 'lodash';

export default {
  created() {
    let that = this;
    this.initValue = _.once(function(val) {
      that.target.editor.loadHTML(val);
      that.attachments = that.target.editorController.attachmentManager.getAttachments();
    });
  },
  watch: {
  },
  data: function() {
    return {
      content: "",
      target: null,
      attachments: []
    };
  },
  props:['id', 'name', 'change', 'value'],

  methods: {
    init: function(value) {
      if (_.isNull(this.target)) {
        let that = this;
        this.$watch('target', function(value, oldVal) {
          that.initValue(value);
        });
      } else {
        this.initValue(value);
      }
    },
    reset: function() {
      this.target.editor.loadHTML("");
      this.target.focus();
    },
    commit: function() {
      let deletedFile = _.differenceBy(this.attachments, this.target.editorController.attachmentManager.getAttachments(), function(value) {
        return value.id;
      });
      _.forEach(deletedFile, function(attachment) {
        let filename = attachment.attachment.attributes.values.filename;
        axios.post('/api/remove-upload', {filename: filename}).then(function(value) {
          if (value.status == 200) {
            console.log('delete file Ok');
          }
        });
      });
    },
  },

  beforeUpdate() {

  },

  mounted() {
    let that = this;
    document.addEventListener('trix-change', function(e) {
      that.content = e.target.value;
      that.change(e.target.value);
    });

    var host, uploadAttachment;

    Trix.config.attachments.preview.caption = {
      name: false,
      size: false
    };

    document.addEventListener('trix-initialize', function(event) {
      that.target = event.target;
      if (!_.isEmpty(that.value)) {
        that.initValue(that.value);
      }
    });

    document.addEventListener('trix-attachment-remove', function(event) {
      let isFind = _.findIndex(this.attachments, function(o) { return o.id == event.attachment.id; });
      let filename = event.attachment.attachment.attributes.values.filename;
      if (isFind == -1) {
        axios.post('/api/remove-upload', {filename: filename}).then(function(value) {
          if (value.status == 200) {
            console.log('delete file Ok');
          }
        });
      }
    });

    document.addEventListener("trix-attachment-add", function(event) {
      var attachment;
      attachment = event.attachment;
      // that.attachments.push(attachment);

      if (attachment.file) {
        uploadAttachment(attachment).then(function(result) {
          var editor = event.target.editor
          var originalRange = editor.getSelectedRange()
          var attachmentRange = editor.getDocument().getRangeOfAttachment(attachment)

          editor.setSelectedRange(attachmentRange)
          editor.activateAttribute("caption", result.name + " " + result.size);
          editor.setSelectedRange(originalRange);

          attachment.setAttributes({
            url: result.link,
            href: result.link,
            filename: result.name
          });
        }).catch( (err) => {
          console.log('err', err);
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
            url = that.baseUrl + '/uploads/' + response.data.name;
            let data = {link: url, name: response.data.name,
                        size: response.data.size, type: response.data.type};
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
