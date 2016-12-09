const mongoose = require('mongoose')


const schema = new mongoose.Schema({
  term: { required: true, type: String },
  time: { required: true, type: Date, default: Date.now },
  total_results: Number,
  search_time: Number
})


module.exports = mongoose.model('Query', schema, 'fcc-img-srch-abst-lyr-queries')
