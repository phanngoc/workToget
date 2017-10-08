<template lang="html">
  <div contenteditable="true" @input="update" :class="className"></div>
</template>

<script>

import axios from 'axios';

export default {
  created() {

  },
  watch: {
    content: function(val, oldVal) {
      this.$el.innerText = val;
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

</style>
