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
              <v-col sm="8" md="6" lg="6" xl="6">
                <h3>Sort by:</h3>
                <v-radio-group row v-model="sortMethod">
                  <v-radio
                    class="pr-5"
                    v-for="(option, index) in sortOptions"
                    :key="index"
                    :label="option.sortRule"
                    :value="option.value"
                  ></v-radio>
                </v-radio-group>
              </v-col>

              <v-col sm="8" md="6" lg="6" xl="6">
                <v-text-field
                  name="search"
                  label="Search by Player Name"
                  id="search-player"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
            <v-data-table :headers="tableHeaders" :items="stats">
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
    current_page: "",
    next_page: "",
    total_pages: ""
  }),
  async fetch() {
    const response = await fetch('http://localhost:3000/api/v1/stats')
    if(response.ok){
      const {stats, current_page, next_page, total_pages} = await response.json()
      this.stats = stats
      this.current_page = current_page
      this.next_page = next_page
      this.total_pages = total_pages
    }
  },
}
</script>
