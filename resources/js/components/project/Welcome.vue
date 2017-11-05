<template lang="html">
  <div class="alert alert-success" role="alert" v-if="isWecomeNewMem.status">
    <h4 class="alert-heading"><i class="fa fa-bullhorn" aria-hidden="true"></i> New member</h4>
    We have {{isWecomeNewMem.user.fullname + '(@' + isWecomeNewMem.user.username + ')'}} to join this project
    <p>Give him/she applause :d</p>
  </div>
</template>

<script>

import axios from 'axios';
import { mapGetters, mapActions, mapState } from 'vuex';
import People from './People';

export default {
  created() {
  },
  data: () => {
    return {
    }
  },
  computed: {
    ...mapState('project', [
        'isWecomeNewMem'
    ]),
  },
  methods: {

  },
  watch: {

  },
  components: {
    People,
  },
  mounted() {
    var self = this;
    this.$store.watch(() => {
      console.log(this.$store.state.project.isWecomeNewMem.status);
      return this.$store.state.project.isWecomeNewMem.status;
    },
    (val) => {
      console.log('co watch', val);
      if (val) {
        setTimeout(() => {
          this.$store.dispatch('project/hideWelcome');
        }, 5000);
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.bottom{
  margin-top: 20px;
}
</style>
