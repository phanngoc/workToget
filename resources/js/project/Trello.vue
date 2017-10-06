<template lang="html">
  <div class="trello row">

  </div>
</template>

<script>

import axios from 'axios';
import draggable from 'vuedraggable';

export default {
  created() {

  },
  data: () => {
    return {
      frames: [],
    }
  },
  methods: {
    switchEditMode: function() {

    }
  },
  components: {

  },
  mounted() {
    var self = this;
    axios.get(this.baseUrl + '/api/projects/' + 1 + '/frames')
      .then(function (response) {
        console.log(response);
        if (response.status == 200) {

        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
</script>

<style lang="scss" scoped>

</style>
