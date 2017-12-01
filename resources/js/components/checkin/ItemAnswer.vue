<template lang="html">
  <div class="feed-item">
    <span style="color:#E2B104 " class="label-date">{{answer.date | calendar}}</span>
    <div class="col-sm-12 col-xs-12 report-in-days">
        <ul class="media-list">
          <li class="media" v-for="(ans, key) in answer.answers" :key="ans.id">
              <a class="pull-left wr-avatar" href="#">
              <img class="media-object rounded-circle" :src="'/img/'+ ans.User.avatar" alt="profile">
              </a>
              <div class="media-body">
                <div class="card card-body bg-light">
                    <p class="card-title text-uppercase reviews">{{ans.User.fullname}} </p>
                    <ul class="media-date text-uppercase reviews list-inline">
                        <li class="dd">{{ans.updateAt | onlyTime}}</li>
                    </ul>
                    <p class="media-comment" v-html="ans.content">
                    </p>
                    <div class="bottom clearfix">
                        <el-button type="success" @click="discuss(ans)">Discuss</el-button>
                        <span class="glyphicon glyphicon-comment"></span> 2 comments
                        <el-button type="text" @click="edit(ans)">Edit</el-button>
                    </div>
                </div>
              </div>
              <div class="collapse" id="replyOne">
                  <ul class="media-list">
                      <li class="media media-replied">
                          <a class="pull-left" href="#">
                          <img class="media-object rounded-circle" src="https://s3.amazonaws.com/uifaces/faces/twitter/ManikRathee/128.jpg" alt="profile">
                          </a>
                          <div class="media-body">
                          <div class="card card-body bg-light">
                              <h4 class="media-heading text-uppercase reviews"><span class="glyphicon glyphicon-share-alt"></span> The Hipster</h4>
                              <ul class="media-date text-uppercase reviews list-inline">
                                  <li class="dd">22</li>
                                  <li class="mm">09</li>
                                  <li class="aaaa">2014</li>
                              </ul>
                              <p class="media-comment">
                                  Nice job Maria.
                              </p>
                              <a class="btn btn-info btn-circle text-uppercase" href="#" id="reply"><span class="glyphicon glyphicon-share-alt"></span> Reply</a>
                          </div>
                          </div>
                      </li>
                      <li class="media media-replied" id="replied">
                          <a class="pull-left" href="#">
                          <img class="media-object rounded-circle" src="https://pbs.twimg.com/profile_images/442656111636668417/Q_9oP8iZ.jpeg" alt="profile">
                          </a>
                          <div class="media-body">
                          <div class="card card-body bg-light">
                              <h4 class="media-heading text-uppercase reviews"><span class="glyphicon glyphicon-share-alt"></span> Mary</h4></h4>
                              <ul class="media-date text-uppercase reviews list-inline">
                                  <li class="dd">22</li>
                                  <li class="mm">09</li>
                                  <li class="aaaa">2014</li>
                              </ul>
                              <p class="media-comment">
                                  Thank you Guys!
                              </p>
                              <a class="btn btn-info btn-circle text-uppercase" href="#" id="reply"><span class="glyphicon glyphicon-share-alt"></span> Reply</a>
                          </div>
                          </div>
                      </li>
                  </ul>
              </div>
          </li>
        </ul>
    </div> <!-- .morningdetail -->
  </div> <!-- .feed-item -->
</template>


<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import _ from 'lodash';
import moment from 'moment';

export default {
  created() {
    this.$store.dispatch('checkin/loadCheckin');
  },
  props: ['answer'],
  data: function() {
    let that = this;
    return {

    };
  },
  filters: {
    onlyTime: function(value) {
      return moment(value).format("hh:mm");
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    onSubmit: function(form) {

    },
    discuss: function(ans) {
      this.$router.push({name: 'checkin.show_answer', params: {id: this.$route.params.id,
                          question_id: this.$route.params.question_id,
                          answer_id: ans.id}})
    },
    edit: function(ans) {
      this.$store.dispatch('checkin/goEditAnswer', ans);
      this.$router.push({name: 'checkin.edit_answer', params: {id: this.$route.params.id,
                          question_id: this.$route.params.question_id,
                          answer_id: ans.id}})
    }
  },
  components: {

  },
  mounted() {
    let that = this;
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../sass/_vars.scss";

</style>
