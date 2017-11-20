<template>
  <section class="section">
    <div class="container is-fluid">
      <table class="table is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th>Dep. Time</th>
            <th>Flight Name</th>
            <th>Destination</th>
            <th>Terminal</th>
            <th>Gate</th>
            <th>Flightstate</th>
            <th>Gate open</th>
            <th>Boarding</th>
            <th>Gate closing</th>
            <th>Exp. off block</th>
            <th>Act. off block</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="flight of flights">
            <th>{{ flight.scheduleTime | convertTime }}</th>
            <td>{{ flight.flightName }}</td>
            <td>
              <ul>
                <li v-for="(value, index) in flight.route.destinations">
                  {{ value }}
                </li>
              </ul>
            </td>
            <td>{{ flight.terminal }}</td>
            <td>{{ flight.gate }}</td>
            <td>{{ flight.publicFlightState.flightStates[0] | convertFlightStateAlias }}</td>
            <td>{{ flight.expectedTimeGateOpen | convertTimezone }}</td>
            <td>{{ flight.expectedTimeBoarding | convertTimezone }}</td>
            <td>{{ flight.expectedTimeGateClosing | convertTimezone}}</td>
            <td>{{ flight.actualLandingTime | convertTimezone}}</td>
            <td>{{ flight.actualOffBlockTime | convertTimezone}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>

import axios from 'axios'
import moment from 'moment'

let config = {
  headers: {
    resourceversion: 'v3'
  }
}

let configSecond = {
  headers: {
    resourceversion: 'v1'
  }
}

export default {
  name: 'flightOverview',
  data () {
    return {
      flights: [],
      errors: []
    }
  },
  created () {
    // Async method for fetching flights
    const getFlights = async () => {
      // Fetch all flights
      const flightsResponse = await axios.get(`https://api.schiphol.nl/public-flights/flights?app_id=6c9eb2dd&app_key=6ca7fa38511113d40eef358fa2813539&scheduletime=15%3A16&flightdirection=D&includedelays=false&page=0&sort=%2Bscheduletime`, config)

      // Fetch all destination names by their code.
      const flights = flightsResponse.data.flights.map(async flight => {
        const destinations = await flight.route.destinations.map(async (destination) => {
          const destinationResponse = await axios.get(`https://api.schiphol.nl/public-flights/destinations/` + destination + `?app_id=6c9eb2dd&app_key=6ca7fa38511113d40eef358fa2813539`, configSecond)
          // Return full destination name
          return destinationResponse.data.publicName.english
        })

        // Overwrite destination property with promise
        flight.route.destinations = await Promise.all(destinations)

        // Return flight
        return flight
      })

      // Resolve all flights
      return Promise.all(flights)
    }

    // Perform the async getFlights call.
    getFlights()
      .then((flights) => {
        this.flights = flights
      })
      .catch((e) => {
        this.errors.push(e)
      })
  },
  filters: {
    convertTime: function (timestamp, inputFormat = 'HH:mm:ss', outputFormat = 'HH:mm') {
      if (timestamp == null) {
        return '-'
      }

      return moment(timestamp, inputFormat).format(outputFormat)
    },
    convertTimezone: function (timestamp, outputFormat = 'HH:mm') {
      if (timestamp == null) {
        return '-'
      }

      return moment.utc(timestamp).format(outputFormat)
    },
    convertDestinationAlias: async function (alias) {
      let destination = '-'

      console.log(alias)

      axios.get(`https://api.schiphol.nl/public-flights/destinations/` + alias + `?app_id=6c9eb2dd&app_key=6ca7fa38511113d40eef358fa2813539`, configSecond)
        .then(function (response) {
          // console.log(response)
        })
        .catch(function (error) {
          console.log(error)
        })

      return destination
    },
    convertFlightStateAlias: function (value) {
      let shortStatus = value.toLowerCase()
      let status

      switch (shortStatus) {
        case 'sch':
          status = 'Scheduled'
          break
        case 'del':
          status = 'Delayed'
          break
        case 'wil':
          status = 'Wait in Lounge'
          break
        case 'gto':
          status = 'Gate Open'
          break
        case 'brd':
          status = 'Boarding'
          break
        case 'gcl':
          status = 'Gate Closing'
          break
        case 'gtd':
          status = 'Gate Closed'
          break
        case 'dep':
          status = 'Departed'
          break
        case 'cnx':
          status = 'Cancelled'
          break
        case 'gch':
          status = 'Gate Change'
          break
        case 'tom':
          status = 'Tomorrow'
          break
        default:
          status = '-'
          break
      }

      return status
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
table tr {
    cursor: pointer;
}
</style>
