<template lang="html">
  <div contenteditable="true" @input="update" :class="'contentedit ' + className"></div>
</template>

<script>

import axios from 'axios';

export default {
  created() {

  },
  watch: {
    content: function(val, oldVal) {
      if (_.isUndefined(val) || _.isNull(val)) {
        this.$el.innerText = "";
      } else {
        this.$el.innerText = val;
      }
      this.$emit('update', this.$el.innerText);
    },
  },
  props:['content', 'className'],

  methods: {
    update:function(event) {
      this.$emit('update', event.target.innerText);
    }
  },
  mounted() {
    this.$el.innerText = this.content;
  }
}
</script>

<style lang="scss" scoped>
  .contentedit{
    min-width: 150px;
    background-color: #eee;
    border: 1px solid #bfbfbf;
    border-radius: 4px;
  }
</style>
