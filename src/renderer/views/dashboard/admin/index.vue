<template>
  <div>
    <admin-view v-if="isAdmin"></admin-view>
    <child-view v-else></child-view>
  </div>
</template>

<script>
import adminView from '@/views/dashboard/admin/child/adminView'
import childView from '@/views/dashboard/admin/child/childView'

export default {
  name: 'DashboardAdmin',
  components: {
    adminView,
    childView
  },
  data () {
    return {
      isAdmin: false
    }
  },
  created () {
    this.isAdmin = this.$store.getters.roles[0] === 'admin'
  },
  methods: {
  }
}
</script>
