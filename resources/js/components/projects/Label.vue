<template lang="html">
  <div class="fr-label">
    <div v-if="mode==0" class="it-label">
      <span class="card-label" :style="'background-color:'+label.color">{{label.name}}</span>
      <a href="javascript" @click="switchEdit"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>
    </div>
    <div v-if="mode==1" class="it-label">

      <span class="card-label" :style="'background-color:'+label.color">{{label.name}}</span>
      <a href="javascript" @click="switchEdit"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import { mapGetters, mapActions, mapState } from 'vuex';
import Label from './Label';

export default {
  created() {

  },
  props: ['label'],
  computed: {

  },
  data: () => {
    return {
      mode: 0
    }
  },
  methods: {
    switchEdit: function() {
      this.mode = 1;
    }
  },
  components: {

  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped>

</style>
