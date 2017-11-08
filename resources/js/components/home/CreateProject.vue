<template lang="html">
  <div class="row in-cre-pro">
    <el-card class="wr-in-pr box-card col-md-6">
      <div slot="header" class="clearfix">
        <span>Create project</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="backHome">Back</el-button>
      </div>
      <el-form ref="form" :model="form" label-width="120px" size="mini">
        <el-form-item label="Project name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="Project description" prop="desc">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>

        <el-form-item label="Logo" prop="desc">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :headers = "headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="Team">
          <el-tag
            :key="tag"
            v-for="tag in dynamicUsers"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="mini"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="onSave">Create</el-button>
          <el-button>Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>

import axios from 'axios';
import { mapGetters, mapActions, mapState } from 'vuex';

import gql from 'graphql-tag';

export default {
  created() {
  },
  data: () => {
    return {
      form: {
        name: '',
        description: '',
        logo: ''
      },
      imageUrl: '',
      headers: {
        'Authorization' : `Bearer ${localStorage.getItem('access_token')}`
      },
      dynamicUsers: [],
      inputVisible: false,
      inputValue: ''
    }
  },
  apollo: {

  },
  computed: {
    ...mapState('project', [
        'users',
    ]),
    ...mapState('auth', [
        'user',
    ]),
  },
  watch: {

  },
  methods: {
    backHome() {
      this.$router.go(-1);
    },
    handleAvatarSuccess(res, file) {
      console.log('handleAvatarSuccess', res, file);
      if (res.status == 200) {
        this.form.logo = res.data.name;
        this.imageUrl = URL.createObjectURL(file.raw);
      }
    },
    beforeAvatarUpload(file) {
      var ValidImageTypes = ["image/gif", "image/jpeg", "image/png"];
      var isNotValid = $.inArray(file.type, ValidImageTypes) < 0;
      if (isNotValid) {
          this.$message.error('Avatar picture must be JPG format!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('Logo picture size can not exceed 2MB!');
      }
      return !isNotValid && isLt2M;
    },
    handleClose(tag) {
      this.dynamicUsers.splice(this.dynamicUsers.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicUsers.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },

    onSave() {
      let project = {
        name: this.form.name,
        description: this.form.description,
        logo: this.form.logo,
        num_star: 0,
        owner_id: this.user.id,
        users_id: this.dynamicUsers
      }

      this.$apollo.mutate({
        // Query
        mutation: gql`
          mutation createProject($project: ProjectInputType!) {
            createProject(project: $project) {
              id
              name
              description
              logo
              num_star
              user {
                id
                fullname
                avatar
              }
            }
          }
        `,
        // Parameters
        variables: {
          project: project,
        },
        // Update the cache with the result
        // The query will be updated with the optimistic response
        // and then with the real result of the mutation
        update: (store, { data }) => {
          console.log('update', store, data);
        },
      }).then((data) => {
        // Result
        console.log('then', data);
        this.$router.go(-1);
      }).catch((error) => {
        // Error
        console.error(error)

      });
    }
  },
  components: {

  },
  mounted() {

  }
}
</script>

<style lang="scss">
  .in-cre-pro{
    margin-top: 40px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .wr-in-pr{
    margin: 0px auto;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
