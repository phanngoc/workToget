<template lang="html">
  <div class="wr-homepage d-flex flex-column">
    <el-carousel :interval="5000" arrow="always">
      <el-carousel-item>
        <div class="item-home">

        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="item-home">

        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="item-home">

        </div>
      </el-carousel-item>
    </el-carousel>
    <div class="row-title">
      <div class="title-intro">
        Find interesting project to join
      </div>
    </div>
    <div class="wr-inner container">
      <div class="card-columns">
        <div class="card" v-for="(project, index) in projects">
          <router-link class="wr-link" :to="{ name: 'overview_project', params: {id: project.id} }">
            <img class="card-img-top" :src="'/img/' + project.logo" alt="Project logo">
            <div class="card-block">
              <h4 class="card-title">{{project.name}}</h4>
              <p class="card-text description">{{project.description}}</p>
              <p class="card-text">
                <b class="num-member"><i class="fa fa-user-circle-o" aria-hidden="true"></i>0</b>
              </p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import { mapGetters, mapActions, mapState } from 'vuex';

import gql from 'graphql-tag';
// GraphQL query
const allProjectsQuery = gql`
  query projects($offset: Int!, $limit: Int!) {
    projectsHomePage(offset: $offset, limit: $limit) {
      id
      name
      description
      logo
      num_star
      user {
        id
        fullname
        username
        avatar
      }
    }
  }
`;

export default {
  created() {
    this.loadProjectPage();
  },
  data: () => {
    return {
      projects: [],
      offset: -6,
      limit: 6,
      loading: false,
      isLast: false,
    }
  },
  apollo: {
    // projects: {
    //   // GraphQL query
    //   query: allProjectsQuery,
    //   variables() {
    //     return {
    //       offset: this.offset,
    //       limit: this.limit
    //     };
    //   },
    //   update(data) {
    //     return data.projectsHomePage;
    //   },
    //   prefetch: true
    // },
  },
  computed: {

  },
  watch: {

  },
  methods: {
    loadProjectPage() {
      var self = this;
      self.offset = self.offset + self.limit;
      self.loading = true;
      self.$apollo.query({
        // Query
        query: allProjectsQuery,
        // Parameters
        variables: {
          offset: self.offset,
          limit: self.limit
        },
      }).then((results) => {
        if (results.data.projectsHomePage.length != 0) {
          self.projects = self.projects.concat(results.data.projectsHomePage);
        } else {
          self.isLast = true;
        }
        self.loading = false;

      }).catch((error) => {
        // Error
        console.error(error)
      });
    }
  },
  components: {

  },
  mounted() {
    let self = this;
    $('#main-app').scroll(function() {
      if($(this).scrollTop() + $(this).height() == $(this)[0].scrollHeight && !self.loading && !self.isLast) {
        self.loadProjectPage();
      }
    });
  }
}
</script>

<style lang="scss" scoped>
  .el-carousel__item {
    background-image: url(/img/discover-bg.svg);
    padding: 0 15px;
    background-size: cover;
  }
  .row-title{
    display: block;
    width: 100%;
    height: 68px;
    .title-intro{
      margin: auto;
      margin-top: 15px;
      height: 29px;
      font-family: montserratlight;
      font-size: 24px;
      color: #1f2d3d;
      letter-spacing: -.5px;
      text-align: center;
      font-weight: bold;
    }
  }
  .card {
    .wr-link{
      text-decoration: none;
      .card-img-top{
        background-color: azure;
      }
    }
    .card-block{
      padding: 10px;
      .card-title{
        color: #28a745;
      }
      .description{
        color: #868e96;
      }
      .num-member{
        color: #8391a5;
        font-size: 23px;
        i{
          margin-right: 11px;
        }
      }
    }
  }
</style>
