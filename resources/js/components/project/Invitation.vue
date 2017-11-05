<template lang="html">
  <div class="alert alert-warning" role="alert" v-if="isInvita">
    <h4 class="alert-heading">Invitation</h4>
    Do you want to join project?
    <button type="button" class="btn btn-success" @click="accept">Accept</button>
    <button type="button" class="btn btn-link" @click="cancel">Cancel</button>
  </div>
</template>

<script>

import axios from 'axios';
import { mapGetters, mapActions, mapState } from 'vuex';
import People from './People';

export default {
  created() {
    this.$store.dispatch('project/loadInvitation');
  },
  data: () => {
    return {
      loading: false,
      user_choose: [],
      option_filter: [],
      list: [],
    }
  },
  computed: {
    ...mapState('project', [
        'users',
        'isInvita'
    ]),
  },
  methods: {
    accept: function() {
      this.$store.dispatch('project/acceptInvitation');
    },
    cancel: function() {
      
    }
  },
  watch: {

  },
  components: {
    People
  },
  mounted() {
    var self = this;

  }
}
</script>

<style lang="scss" scoped>
.bottom{
  margin-top: 20px;
}
</style>
