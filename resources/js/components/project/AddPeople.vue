<template lang="html">
  <div class="wr-add-people">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Add people</span>
      </div>
      <div class="body">
        <el-select
          v-model="user_choose"
          multiple
          filterable
          remote
          reserve-keyword
          placeholder="Please enter a fullname or email"
          :remote-method="remoteMethod"
          :loading="loading">
          <el-option
            v-for="item in option_filter"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="bottom clearfix">
         <el-button type="success" class="btn-add" @click="addMorePeople" round>Add</el-button>
         <el-button plain class="btn-cancel" @click="cancelAddMore" round>Cancel</el-button>
       </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>People in project</span>
      </div>
      <div class="body d-flex" flex-direction="column">
        <People v-for="(item, index) in users" :key="index" :user="item" />
      </div>
    </el-card>
  </div>
</template>

<script>

import axios from 'axios';
import { mapGetters, mapActions, mapState } from 'vuex';
import People from './People';

export default {
  created() {
    this.$store.dispatch('auth/loadUsers');
    this.$store.dispatch('project/loadProject', this.$route.params.id);
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
    ]),
  },
  methods: {
    addMorePeople() {
      var self = this;
      this.$store.dispatch('project/addMorePeople', this.user_choose).then(function(result) {
        if (result.status == 200) {
          self.user_choose = [];
          self.$message('The invitation was sent !');
        }
      });
    },
    cancelAddMore() {

    },
    remoteMethod(query) {
       if (query !== '') {
         this.loading = true;
         setTimeout(() => {
           this.loading = false;
           this.option_filter = this.list.filter(item => {
             return item.label.toLowerCase()
               .indexOf(query.toLowerCase()) > -1;
           });
         }, 200);
       } else {
         this.option_filter = [];
       }
     }
  },
  watch: {
  
  },
  components: {
    People
  },
  mounted() {
    var self = this;
    this.$store.watch(function() {
      return self.$store.state.auth.users;
    },
    (val) => {
      this.list = this.$store.state.auth.users.map(item => {
        return { value: item.id, label: item.fullname + ' (' + item.email + ')' };
      });
    });
  }
}
</script>

<style lang="scss" scoped>
.el-select{
  width: 50%;
  min-width: 300px;
}
</style>
