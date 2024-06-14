<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'electron-vue',
  // created() {
  //     if (sessionStorage.getItem('username')) {
  //       this.$store.replaceState(Object.assign({}, this.$store.state, sessionStorage.getItem('username')));
  //     }
  //     window.addEventListener('beforeunload', () => {
  //       sessionStorage.setItem('username', this.$store.state);
  //     });
  //     if (sessionStorage.getItem('password')) {
  //       this.$store.replaceState(Object.assign({}, this.$store.state, sessionStorage.getItem('password')));
  //     }
  //     window.addEventListener('beforeunload', () => {
  //       sessionStorage.setItem('password', this.$store.state);
  //     });
  //     if (sessionStorage.getItem('admin')) {
  //       this.$store.replaceState(Object.assign({}, this.$store.state, sessionStorage.getItem('admin')));
  //     }
  //     window.addEventListener('beforeunload', () => {
  //       sessionStorage.setItem('admin', this.$store.state);
  //     });
  //     if (sessionStorage.getItem('system')) {
  //       this.$store.replaceState(Object.assign({}, this.$store.state, sessionStorage.getItem('system')));
  //     }
  //     window.addEventListener('beforeunload', () => {
  //       sessionStorage.setItem('system', this.$store.state);
  //     });
  //     if (sessionStorage.getItem('token')) {
  //       this.$store.replaceState(Object.assign({}, this.$store.state, sessionStorage.getItem('token')));
  //     }
  //     window.addEventListener('beforeunload', () => {
  //       // sessionStorage.setItem('token', JSON.stringify(this.$store.state));
  //       sessionStorage.setItem('token', this.$store.state);
  //     });
  //   }

  mounted () {
    window.addEventListener('unload', this.saveState)
  },
  methods: {
    saveState () {
      sessionStorage.setItem('state', JSON.stringify(this.$store.state))
    }
  }

}
</script>
