<template>
  <v-container fluid class="px-0">
    <v-row>
      <v-col sm="8" md="6" lg="12" xl="12">
        <v-card>
          <v-card-title>
            <h1>Rushing Stats</h1>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-spacer></v-spacer>
              <v-col sm="8" md="3" lg="3" xl="3">
                <v-text-field
                  name="search"
                  label="Search by Player Name"
                  id="search-player"
                  outlined
                  v-model="searchText"
                  @keyup.enter="fetchData"
                ></v-text-field>
              </v-col>
              <v-col sm="8" md="1" lg="1" xl="1">
                <v-btn x-large icon dark @click="fetchData">
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </v-col>

              <v-col sm="2" md="2" lg="2" xl="2">
                <v-btn block x-large @click="exportData">Export data</v-btn>
              </v-col>
            </v-row>
            <v-data-table
              :headers="tableHeaders"
              :items="stats"
              :server-items-length="total_entries"
              :loading="loading"
              :page="current_page"
              :options.sync="options"
              :footer-props="{
                'items-per-page-options': [5, 10, 15, 50],
              }"
            >
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    sortMethod: 'id',
    sortOptions: [
      { value: 'id', sortRule: 'id' },
      { value: 'total_rushing_yards', sortRule: 'Total Rushing Yards' },
      { value: 'longest_rush', sortRule: 'Longest Rush' },
      { value: 'rushing_touchdowns', sortRule: 'Rushing Touchdowns' },
    ],
    tableHeaders: [
      {
        text: 'Player',
        align: 'start',
        value: 'player',
      },
      { text: 'Team', value: 'team' },
      { text: 'Position', value: 'pos' },
      { text: 'Rush attempts', value: 'attempts' },
      { text: 'Rush attempts/game', value: 'att_per_game' },
      { text: 'Total rushing yards', value: 'total_rushing_yards' },
      { text: 'Rushing avg yard/attempt', value: 'avg_yard_attempt' },
      { text: 'Rushing Yards/Game', value: 'yds_per_game' },
      { text: 'Total Rushing Touchdowns', value: 'rushing_touchdowns' },
      { text: 'Longest Rush (T = Touchdown)', value: 'longest_rush' },
      { text: '1st Downs', value: 'rushing_first_downs' },
      { text: '1st Downs %', value: 'first_downs_percent' },
      { text: 'Rushing 20+ Yards', value: 'twenty_plus_rushes' },
      { text: 'Rushing 40+ Yards', value: 'forty_plus_rushes' },
      { text: 'Rushing fumbles', value: 'fumbles' },
    ],
    stats: [],
    current_page: 1,
    next_page: '',
    total_entries: 0,
    searchText: '',
    loading: true,
    options: {},
  }),
  watch: {
    options: {
      handler() {
        this.fetchData()
      },
    },
    deep: true,
  },
  methods: {
    async fetchData() {
      this.loading = true
      const filter = this.buildFilter()
      const response = await fetch(
        `http://localhost:3000/api/v1/stats/${filter}`
      )
      if (response.ok) {
        const { stats, current_page, next_page, total_entries } =
          await response.json()
        this.loading = false
        this.stats = stats
        this.current_page = current_page
        this.next_page = next_page
        this.total_entries = total_entries
      }
    },
    buildFilter() {
      const { page, itemsPerPage, sortBy, sortDesc } = this.options
      let pageNumber = page
      let query = `?page=${pageNumber}&per_page=${itemsPerPage}`

      if (sortBy?.length) {
        query += `&sort_by=${sortBy[0]}`
      }

      if (sortDesc?.length && sortDesc[0] === true) {
        query += `&sort_order=desc`
      }

      if (this.searchText) {
        query += `&player=${this.searchText}`
      }

      return query
    },
    async fetchFiltered() {
      const filter = this.buildFilter()
      const response = await fetch(
        `http://localhost:3000/api/v1/stats/${filter}`
      )
      if (response.ok) {
        const { stats, current_page, next_page, total_entries } =
          await response.json()
        this.stats = stats
        this.current_page = current_page
        this.next_page = next_page
        this.total_entries = total_entries
      }
    },
    async exportData() {
      const filter = this.buildFilter()
      const response = await fetch(
        `http://localhost:3000/api/v1/stats/export_csv/${filter}`
      )
      if (response.ok) {
        const now = new Date().toISOString().slice(0, 10)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(new Blob([blob]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `stats-${now}-export.csv`)
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
      }
    },
  },
  mounted() {
    this.fetchData()
  },
  // async fetch() {
  //   this.loading = true
  //   const response = await fetch('http://localhost:3000/api/v1/stats')
  //   if (response.ok) {
  //     this.loading = false
  //     const { stats, current_page, next_page, total_entries } =
  //       await response.json()
  //     this.stats = stats
  //     this.current_page = current_page
  //     this.next_page = next_page
  //     this.total_entries = total_entries
  //   }
  // },
}
</script>
