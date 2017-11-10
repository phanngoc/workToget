<template lang="html">
  <el-card class="box-card form-wrap">
    <el-form ref="login_form" :model="form" label-width="120px" :rules="rules" id="form-login">
      <el-form-item label="Username" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submitLogin">Login</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions, mapState } from 'vuex';
import _ from 'lodash';

export default {
  created() {

  },
  props: [],
  data: function() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {required: true, message: "Username is required", trigger: 'blur'},
          {min: 4, max: 20, message: 'Length should be 4 to 20', trigger: 'blur'},
        ],
        password: [
          {required: true, message: "Password is required", trigger: 'blur'},
          {min: 5, max: 20, message: 'Length should be 5 to 20', trigger: 'blur'}
        ]
      },
    }
  },
  computed: {
  },

  methods: {
    submitLogin: function(e) {
      let that = this;
      e.preventDefault();
      this.$refs['login_form'].validate((valid) => {
        if (valid) {
          this.$store.dispatch('auth/login', {
            username: this.form.username,
            password: this.form.password
          }).then(function(result) {
            if (result.status == 200) {
              that.$router.push({ name: 'homepage'});
            }
          }).catch((err) => {
            console.log(err);
          });
        } else {
          this.$message.error('Login failed !');
          return false;
        }
      });
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
