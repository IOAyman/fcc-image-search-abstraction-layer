const router = require('express').Router()
const got = require('got')
const util = require('util')
const Query = require('../models/query')


const { GOOGLE_CS_API_KEY:API_KEY, GOOGLE_CS_ID:CX } = process.env
const QUERY_TEMPLATE = `https://www.googleapis.com/customsearch/v1?key=%s&cx=%s&searchType=image&fields=items(title,link,mime,image(byteSize,width,height,thumbnailLink,thumbnailWidth,thumbnailHeight)),searchInformation,queries(request(count,startIndex),previousPage(count,startIndex),nextPage(count,startIndex))&num=%d&start=%d&q=%s`


router.all('/imagesearch/:term', (req, res, next) => {
  // extraction
  const { term } = req.params
  let { offset, limit } = req.query

  // validate offset
  if (isNaN(offset) || Number(offset) < 1)
    offset = 1
  // validate limit
  if (isNaN(limit) || Number(limit) > 10)
    limit = 10

  // render the query
  const query = util.format(QUERY_TEMPLATE, API_KEY, CX, limit, offset, term)

  // do the search on google
  got.get(query)
     .then(response => {
       // parse the data I neem
       const { queries, searchInformation, items } = JSON.parse(response.body)

       if (!queries.nextPage)
         throw new Error('No more results!')

       // response
       res.json(items)

       // append to history
       return new Query({
         term,
         total_results: searchInformation.totalResults,
         search_time: searchInformation.searchTime
        }).save()
     })
     // log some info to stdout
     .then(savedQuery => console.info(
       `${savedQuery.time.toISOString()}  found:${savedQuery.total_results} time:${savedQuery.search_time}`
      ))
     .catch(error => next(error))
})


router.get('/latest/imagesearch', (req, res, next) => {
  Query.find()
       .sort({ time: 1 })
       .select({ _id:0 , term: 1, time: 1, search_time: 1, total_results: 1 })
       .then( queries => res.json(queries.reverse()))
       .catch(error => next(error))
})


// Woops!
router.use((error, req, res, next) => {
  if (error.message) error = error.message
  res.json({ error })
})


module.exports = router
