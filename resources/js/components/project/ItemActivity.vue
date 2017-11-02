<template lang="html">
  <div>
    <span class="timeline-label">
      <span class="label label-primary">{{this.date}}</span>
    </span>
    <Action v-for="(act, index) in activity" :activity="act" :key="index" />
  </div>
</template>

<script>

import axios from 'axios';
import { mapGetters, mapActions, mapState } from 'vuex';
import Action from './Action.vue';

export default {
  created() {

  },
  props: ['activity', 'date'],
  data: () => {
    return {

    }
  },
  computed: {

  },
  methods: {

  },
  components: {
    Action
  },
  mounted() {
    var self = this;
  }
}
</script>

<style lang="scss" scoped>

</style>
