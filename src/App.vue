<template>
  <div id="app">
    <section class="hero is-warning">
      <div class="hero-body">
        <div class="container is-fluid">
          <h1 class="title">
            Schiphol Flights
          </h1>
          <h2 class="subtitle">
            Departures
          </h2>
        </div>
      </div>
    </section>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
