<template lang="html">
  <div class="list-btn add-label">
    <el-dropdown trigger="click" :hide-on-click="false">
      <span class="el-dropdown-link">
        <a href="javascript:" class="btn btn-outline-primary btn-label">Labels</a>
      </span>
      <el-dropdown-menu slot="dropdown">
        <div class="wr-list-label">
          <div class="fr-show" v-if="mode==0">
            <div class="title">
              Labels
            </div>
            <div class="wr-content">
              <input type="text" name="search" v-on:keyup="handleSearch()" class="form-control" v-model="search" placeholder="Search labels…"/>
            </div>
            <div class="labels">
              <ul class="list-group">
                <li v-for="(label, index) in filterLabels" :key="index" class="li-label list-group-item">
                  <span class="card-label badge" :style="'background-color:'+label.color"
                    @click="chooseLabel(label.id)">{{showLess(label.name, 6)}}
                    <i class="fa fa-check" aria-hidden="true" v-if="isChoose(label.id)"></i>
                  </span>
                  <a href="javascript:" @click="switchEdit(label)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>
                </li>
              </ul>
            </div>
          </div>
          <div class="fr-edit" v-if="mode==1">
            <div class="title">
              <a href="javascript:" @click="switchShow"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>
              Change Labels
            </div>
            <div class="wr-content">
              <input type="text" name="name" class="form-control" v-model="labelEdit.name" />
            </div>
            <div class="labels">
              <ul class="gr-color">
                <li v-for="(color, index) in colors" :key="index" class="li-color">
                  <span :class="'card-label ' + activeColor(color)" :style="'background-color:'+color"
                    @click="chooseColor(color)">
                  </span>
                </li>
              </ul>
            </div>
            <div class="actions">
              <el-button type="success" @click="saveEditLabel">Save</el-button>
              <el-button type="danger" @click="deleteLabel">Delete</el-button>
            </div>
          </div>
        </div> <!-- .wr-list-label -->
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>

import axios from 'axios';
import { mapGetters, mapActions, mapState } from 'vuex';
// import Label from './Label';

export default {
  created() {

  },
  computed: {
    ...mapState('trello', [
        'activeTask',
        'labels'
    ]),
  },
  watch: {
    labels: function(val, oldVal) {
      this.filterLabels = val;
    },
    activeTask: function (val, oldVal) {
      this.label_ids = _.map(this.activeTask.Labels, function(o) { return o.id;});
    }
  },
  data: function() {
    return {
      label_ids: [],
      filterLabels: [],
      search: "",
      mode: 0,
      labelEdit: {},
      colorChoose: '#88CD7B',
      colors: [
        '#88CD7B',
        '#F5E040',
        '#00C2E0',
        '#FFC077',
        '#F08374',
        '#D299E8',
        '#409ACF',
        '#40D1E8',
        '#7CEEB2',
        '#FFA0DA',
        '#FFFFFF'
      ]
    }
  },
  methods: {
    isChoose: function(id) {
      return this.label_ids.includes(id);
    },
    chooseLabel: function(label_id) {
      let isHas = this.label_ids.includes(label_id);

      if (!isHas) {
        this.label_ids.push(label_id);
      } else {
        var index = this.label_ids.indexOf(label_id);
        if (index > -1) {
            this.label_ids.splice(index, 1);
        }
      }

      this.$store.dispatch('trello/chooseLabel', {id: this.activeTask.id, label_ids: this.label_ids})
    },
    handleSearch: function() {
      let that = this;
      this.filterLabels = _.filter(this.labels, function(o) { return o.name.includes(that.search); });
    },
    switchShow: function() {
      this.mode = 0;
    },
    saveEditLabel: function() {
      this.$store.dispatch('trello/updateLabel', this.labelEdit);
      this.mode = 0;
    },
    deleteLabel: function() {
      let that = this;
      this.$confirm('This will permanently delete the label. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        that.$store.dispatch('trello/deleteLabel', this.labelEdit);
      }).catch(() => {

      });
    },
    activeColor: function(color) {
      if (color == this.labelEdit.color) {
        return "active";
      }
      return "";
    },
    switchEdit: function(label) {
      this.mode=1;
      this.labelEdit=Object.assign({}, label);
    },
    chooseColor: function(color) {
      this.labelEdit.color = color;
    }
  },
  components: {

  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped>
  .gr-color{
    .active{
      border: 2px solid #968e8e;
      box-shadow: 1px 1px 9px #888888;
    }
  }
  .card-label{
    padding-top: 7px;
    padding-bottom: 8px;
    width: 110px;
    cursor: pointer;
  }
  .wr-list-label{
    width: 318px;
    .gr-color{
      padding-left: 0px;
      .li-color{
        list-style: none;
        display: block;
        float: left;
        padding: 3px;
        .card-label{
          display: block;
          width: 46px;
          height: 34px;
        }
      }
    }
  }
</style>
